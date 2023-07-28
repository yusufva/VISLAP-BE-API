var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const v = new Validator();

router.get('/', async (req,res) => {
    const tx = await prisma.transactions.findMany({
        include:{
            items:true,
            status:{
                select:{
                    status:true
                }
            }
        }})
    res.json(tx)
})

router.get('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const tx = await prisma.transactions.findUnique({
            where: {id:id},
            include:{
                items: true,
            }
        });
    
        return res.json(tx);
    } catch (e) {
        return res.status(400).json({message:"id must be a number"});
    }

})

router.post('/', async (req,res) => {
    const schema = {
        user_id: "number|required",
        items: {type:"array", items:{ type: "object", props: {
            product_name: "string|required",
            price: "number|required",
            quantity: "number|required",
            total_price: "number|required"
        }}},
        final_price: "number|required"
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    };

    const tx = await prisma.transactions.create({
        data: {
            user_id: req.body.user_id,
            final_price: req.body.final_price,
            items:{
                createMany: {
                    data: req.body.items
                }
            },
            expiration: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        include:{
            items:true
        }
    });

    res.status(201).json(tx);
})

router.put('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let tx = await prisma.transactions.findUnique({where:{id:id}})
        if (!tx) return res.status(404).json({message:"transaction not found"})

        const schema = {
            status: "number|required"
        }
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        };

        tx = await prisma.transactions.update({where:{id:id}, data:req.body})
        return res.json(tx)
    } catch (e) {
        
    }
})

router.delete('/:id', async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let tx = await prisma.transactions.findUnique({where:{id:id}})

        if (!tx) return res.status(404).json({message:"transaction not found"})
        tx = await prisma.transactions.delete({where:{id:id}});
        return res.json({message:"transaction successfully deleted"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

module.exports = router