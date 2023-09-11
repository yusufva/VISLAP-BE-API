var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtm = require('../middleware/jwtauth')
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const v = new Validator({
    useNewCustomCheckerFunction: true,
    messages: {
        notEqual: "{field} and {expected} can not be equal"
    }
  });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('mau ngapain hayo~');
});

router.post('/registers', async (req,res)=>{
  const schema = {
    name : 'string',
    email: 'email',
    password: 'string|min:8',
    confirm_password: 'equal|field:password',
    reset_question: 'string',
    reset_answer: 'string'
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) return res.status(400).json(validate);
  const {email, password, confirm_password} = req.body
  // if(password!=confirm_password) return res.status(400).json({message:"password and confirm password does not same"})
  const salt = await bcrypt.genSalt(13)
  const hashPassword = await bcrypt.hash(password,salt)
  try {
    await prisma.users.create({
      data:{
        name: req.body.name,
        email: email,
        password: hashPassword,
        reset_question: req.body.reset_question,
        reset_answer: req.body.reset_answer
      }
    })
    res.status(201).json({message:"user has been successfully registered"})
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        return res.status(409).json({ message:"this email have been used" });
      }
    res.sendStatus(500)
    }
  }
})

router.post('/login', async (req,res)=>{
  const schema = {
    email: 'email',
    password: 'string'
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) return res.status(400).json(validate);
  try {
    const user = await prisma.users.findFirstOrThrow({where: { email: req.body.email }});
    const isValid = await bcrypt.compare(req.body.password, user.password);
    if(!isValid) return res.status(400).json({ message: "wrong password" })
    const userId = user.id;
    const name = user.name
    const role = user.role;
    const accessToken = jwt.sign({userId, name, role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
    const refreshToken = jwt.sign({userId, name, role}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d'});
    await prisma.users.update({
      data: { refresh_token: refreshToken },
      where: { id:userId }
    });
    res.cookie('refreshToken', refreshToken,{
      httpOnly: false,
      maxAge: 72*60*60*1000,
      secure: true, //comment this line for localhost
      sameSite: 'None',
      domain: "vislap-fe.vercel.app"
    });
    res.json({
      message : "user successfully loged in",
      access_token : accessToken,
      refreshToken: refreshToken
    })
  } catch (e) {
    res.status(404).json({ message:"email not found" })
  }
})

router.post('/reset', async(req,res)=>{
  const schema = {
    email: 'email',
    reset_question: 'string',
    reset_answer: 'string'
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) return res.status(400).json(validate);

  let user = await prisma.users.findFirst({
    where:{
      email:req.body.email
    },
    select:{
      id:true,
      email:true,
      name:true,
      role:true,
      reset_answer:true,
      reset_question:true
    }
  })
  if(!user) return res.status(404).json({message:`user with email ${req.body.email} does not exist`})
  if(user.reset_question!=req.body.reset_question  || user.reset_answer != req.body.reset_answer) return res.status(400).json({message:"question and answer does not match"})
  const userId = user.id
  const name = user.name
  const role = user.role
  const email = user.email
  const resetToken = jwt.sign({userId, name, role, email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' });
  return res.json({resetToken:resetToken})
})

router.put('/reset', jwtm.verifyToken, async(req,res, next)=>{
  const schema = {
    new_password: 'string|min:8',
    confirm_newPassword: 'equal|field:new_password'
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) return res.status(400).json(validate);

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) =>{
    if(err) return res.sendStatus(403);
    if(!decode.email) return res.sendStatus(400)
    req.email = decode.email;
  })
  let user = await prisma.users.findFirst({where:{AND:{id:req.id,email:req.email}}})
  if(!user) return res.status(404).json({message:"user not found"})
  const salt = await bcrypt.genSalt(13)
  const hashPassword = await bcrypt.hash(req.body.new_password,salt)
  user = await prisma.users.update({where:{id:req.id}, data:{password:hashPassword}})
  return res.json({message:"password successfully changed"})
})

router.get('/profile', jwtm.verifyToken, jwtm.auth([4]), async(req,res)=>{
  const id = req.id
  // return res.json(id)
  try {
    const user = await prisma.users.findFirstOrThrow({where:{id:id}, select:{
      id: true,
      email: true,
      name: true,
      alamat: true,
      provinsi: true,
      kota: true,
      kecamatan: true,
      kode_pos:true
    }})
    res.json(user)
  } catch (e) {
    res.sendStatus(404)
  }
  
})

router.put("/profile/:id", jwtm.verifyToken, jwtm.auth([4]), async(req,res)=>{
  const paramId = req.params.id
  try {
    const id = parseInt(paramId);
    let profile = await prisma.users.findUnique({where:{id:id}})
    jwtm.authId([profile.id])
    const schema = {
      name : 'string',
      alamat: 'string',
      provinsi: 'string',
      kota: 'string',
      kecamatan : 'string',
      kode_pos: 'number'
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);
    await prisma.users.update({ where:{ id:id }, data:req.body })
    return res.json({message:"user profile successfully updated"})
  } catch (e) {
    
  }
})

router.put("/password/:id", jwtm.verifyToken, jwtm.auth([4]), async(req,res)=>{
  
  const schema = {
      old_password : {type:"string"},
      new_password: {type:"string", min:8, field:"old_password", custom:(value, errors, schema, name, parent, context)=>{
        if (context.data.old_password === value) errors.push({type: "notEqual", expected:schema.field})
        return value
      }},
      confirm_newPassword: {type:"equal",field:"new_password"}
  }
  const validate = v.validate(req.body, schema);
  if (validate.length) return res.status(400).json(validate);

  try {
      const id = parseInt(req.params.id)
      let user = await prisma.users.findUnique({where:{id:id}})
      if(req.id != user.id) return res.status(401).json({message:"you can't change other account's password"})
      const password = req.body.new_password
      const salt = await bcrypt.genSalt(13)
      const hashPassword = await bcrypt.hash(password,salt)
      user = await prisma.users.update({where:{id:id}, data:{password:hashPassword}})
      return res.json({message:"password successfully changed"})
  } catch (e) {
      return res.status(500).json({message:e.message})
  }
})

router.delete('/logout', async(req,res)=>{
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const user = await prisma.users.findFirst({ where:{ refresh_token: refreshToken }});
  if(!user) return res.sendStatus(204);
  const userId = user.id;
  await prisma.users.update({data:{ refresh_token:null }, where:{ id:userId }});
  res.clearCookie('refreshToken');
  return res.status(200).json({message:"user successfully logged out"})
})

module.exports = router;
