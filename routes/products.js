var express = require('express');
var router = express.Router();
const fs = require('node:fs/promises')
const Validator = require('fastest-validator');
const mtr = require('../middleware/upload')
const { Prisma, PrismaClient } = require('@prisma/client');

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

router.post('/single', mtr.upload.single('img') , async (req,res) => {
    if(!req.file) return res.status(400).json({message:"please upload the image"});
    const filename = req.file.filename
    res.json({filename:filename})
})

router.post('/', jwt.verifyToken, jwt.auth([2]), mtr.upload.single('img'), async (req,res)=>{
    if(!req.file) return res.status(400).json({message:"please upload the image"});

    const {nama, harga, kategori, stock} = req.body;
    const intStock = parseInt(stock);
    const intHarga = parseInt(harga);
    const product = await prisma.products.create({
        data:{
            nama:nama,
            harga:intHarga,
            kategori: kategori,
            photo: req.file.filename,
            stock: intStock,
        }
    })

    res.json(product)
})

router.put('/:id', jwt.verifyToken, jwt.auth([2]), mtr.upload.single('img'), async (req,res)=>{
    if(!req.file) {
        try {
            const id = parseInt(req.params.id);
            
            let product = await prisma.products.findUnique({where:{id:id}})
            if (!product) return res.status(404).json({message:"product not found"})

            const {nama, harga, kategori, stock} = req.body;
            const intStock = parseInt(stock);
            const intHarga = parseInt(harga);
            product = await prisma.products.update({
                data:{
                    nama:nama,
                    harga:intHarga,
                    kategori: kategori,
                    stock: intStock,
                },
                where:{id:id}
            })
        
            return res.json(product)
        } catch (e) {
            return res.status(400).json({message:"id must be a number"})
        }
    } else {
        try {
            const id = parseInt(req.params.id);
            
            let product = await prisma.products.findUnique({where:{id:id}})
            if (!product) return res.status(404).json({message:"product not found"})
    
            const {nama, harga, kategori, stock} = req.body;
            const intStock = parseInt(stock);
            const intHarga = parseInt(harga);
            product = await prisma.products.update({
                data:{
                    nama:nama,
                    harga:intHarga,
                    kategori: kategori,
                    photo: req.file.filename,
                    stock: intStock,
                },
                where:{id:id}
            })
        
            return res.json(product)
        } catch (e) {
            return res.status(400).json({message:"id must be a number"})
        }
    }
})

router.delete('/:id', jwt.verifyToken, jwt.auth([2]), async (req,res)=>{
    const param = req.params.id;
    try {
        const id = parseInt(param);
        let product = await prisma.products.findUnique({where:{id:id}});

        if(!product) return res.status(404).json({message:"product not fount"});

        fs.unlink(`./public/images/${product.photo}`)
        product = await prisma.products.delete({where:{id:id}})

        return res.json({message:"product successfully deleted"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

module.exports = router