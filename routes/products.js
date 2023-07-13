var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client')
const multer = require('multer');
const path = require('path')

const productStorage = multer.diskStorage({
    destination: (req,file,cb)=> {
        cb(null, './public/images')
    },
    filename: (req,file,cb)=>{
        cb(null, `produk-${Math.floor(Math.random()*1000)}${Date.now()}`+path.extname(file.originalname))
    }
});

const productFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)){
        return cb(new Error('Please upload a Image'))
    }
    cb(null, true)
};

exports.upload = multer({
    storage: productStorage,
    fileFilter: productFilter
});



const prisma = new PrismaClient()
const v = new Validator();

router.get('/', async (req,res)=> {
    const products = await prisma.products.findMany();
    res.json(products||{});
})

router.get('/:id', async (req,res)=> {
    const param = req.params.id
    try {
        const id = parseInt(param)
        const product = await prisma.products.findUnique({ where:{ id:id } });
        return res.json(product||{});
    } catch (e) {
        res.status(400).json({message:"id must be a number"})
    }
})

router.post('/', this.upload.single('img'), async (req,res)=>{
    const schema = {
        nama : 'string',
        harga: 'number|required',
        kategori: 'string',
        stock: 'number',
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const {nama, harga, kategori, stock} = req.body;
    // const intStock = parseInt(stock);
    // const intHarga = parseInt(harga);
    const product = await prisma.products.create({
        data:{
            nama:nama,
            harga:harga,
            kategori: kategori,
            photo: req.file.filename,
            stock: stock,
        }
    })

    res.json(product)
})

router.put('/:id', async (req,res)=>{

})

router.delete('/:id', async (req,res)=>{
    const param = req.params.id;
    try {
        const id = parseInt(param);
        let product = await prisma.products.findUnique({where:{id:id}});
        if(!product) return res.status(404).json({message:"product not fount"});
        product = await prisma.products.delete({where:{id:id}})
        return res.json({message:"product successfully deleted"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

module.exports = router