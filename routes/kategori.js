var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const v = new Validator();

router.get('/', async (req,res) => {
    const kategori = await prisma.kategori.findMany()
    res.json(kategori||{})
})

router.get('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const kategori = await prisma.kategori.findUnique({where:{id:id}});
        return res.json(kategori||{})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

router.post('/', async (req,res) => {
    const schema = {
        name : 'string|required',
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    };

    const kategori = await prisma.kategori.create({data:req.body});
    res.json(kategori);
})

router.put('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let kategori = await prisma.kategori.findUnique({where:{id:id}});

        if(!kategori) return res.status(404).json({message:"kategori not found"});

        const schema = {
            name : 'string|required'
        };
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        };

        kategori = await prisma.kategori.update({data:req.body, where:{id:id}});

        return res.json(kategori)
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

router.delete('/', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let kategori = await prisma.kategori.findUnique({where:{id:id}});

        if(!kategori) return res.status(404).json({message:"kategori not found"});

        kategori = await prisma.kategori.delete({where:{id:id}})

        return res.json({message:"kategori successfully deleted"})
    } catch (e) {
        return res.status.json({message:"id must be a number"})
    }
})

module.exports = router