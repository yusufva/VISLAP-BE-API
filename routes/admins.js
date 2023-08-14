var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtm = require("../middleware/jwtauth")
const {auth, verifyToken} = require('../middleware/jwtauth')
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const v = new Validator();

router.get('/', jwtm.verifyToken, jwtm.auth([1,2]), async (req,res)=>{
    let roleget
    switch (req.id) {
        case 1:
            roleget = 2
            break;
    
        case 2:
            roleget = 3
            break;
    }
    const admins = await prisma.admins.findMany({
        where:{
            role:roleget
        },
        select:{
            id:true,
            email:true,
            name:true,
            role:true,
        }
    });
    res.json(admins)
})

router.post('/registers', jwtm.verifyToken, jwtm.auth([1,2]), async (req,res)=>{
    const schema = {
        name : 'string',
        email: 'email',
        password: 'string|min:8',
        confirm_password: 'equal|field:password',
        role: 'number|required'
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);
    const {email, password} = req.body
    // if(password!=confirm_password) return res.status(400).json({message:"password and confirm password does not same"})
    const salt = await bcrypt.genSalt(13)
    const hashPassword = await bcrypt.hash(password,salt)
    try {
        await prisma.admins.create({
        data:{
            name: req.body.name,
            email: email,
            password: hashPassword,
            role: req.body.role,
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
        const user = await prisma.admins.findFirstOrThrow({where: { email: req.body.email }});
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if(!isValid) return res.status(400).json({ message: "wrong password" })
        const userId = user.id;
        const name = user.name
        const role = user.role;
        const accessToken = jwt.sign({userId, name, role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
        const refreshToken = jwt.sign({userId, name, role}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d'});
        await prisma.admins.update({
        data: { refresh_token: refreshToken },
        where: { id:userId }
        });
        res.cookie('refreshToken', refreshToken,{
        httpOnly: false,
        maxAge: 72*60*60*1000,
        secure: true, //comment this line for localhost
        sameSite: 'Lax'
        });
        res.json({
        message : "user successfully loged in",
        access_token : accessToken
        })
    } catch (e) {
        res.status(404).json({ message:"email not found" })
    }
})

router.get('/profile', verifyToken, async(req,res)=>{
    const id = req.id
    // return res.json(id)
    try {
        const user = await prisma.admins.findFirstOrThrow({where:{id:id}, select:{
        id: true,
        email: true,
        name: true,
        }})
        res.json(user)
    } catch (e) {
        res.sendStatus(404)
    }
})

router.put("/profile/:id", async(req,res)=>{
    const paramId = req.params.id
    const schema = {
        name : 'string',
        alamat: 'email',
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) return res.status(400).json(validate);
    try {
        const id = parseInt(paramId);
        await prisma.admins.update({ where:{ id:id }, data:req.body })
        return res.json({message:"user profile successfully updated"})
    } catch (e) {
        
    }
})

router.delete('/logout', async(req,res)=>{
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await prisma.admins.findFirst({ where:{ refresh_token: refreshToken }});
    if(!user) return res.sendStatus(204);
    const userId = user.id;
    await prisma.admins.update({data:{ refresh_token:null }, where:{ id:userId }});
    res.clearCookie('refreshToken');
    return res.status(200).json({message:"user successfully logged out"})
})

module.exports = router;
