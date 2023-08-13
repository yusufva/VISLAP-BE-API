var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client');
const jwt = require('../middleware/jwtauth');

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

router.post('/', jwt.verifyToken, async (req,res) => {
    const schema = {
        user_id: "number|required",
        items: {type:"array", items:{ type: "object", props: {
            product_name: "string|required",
            price: "number|required",
            quantity: "number|required",
            total_price: "number|required"
        }}},
        final_price: "number|required",
        unique_code: "number|required"
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
            unique_code: req.body.unique_code,
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
    await prisma.cart.deleteMany({where:{id_user:req.id}});

    res.status(201).json(tx);
})

router.put('/:id', jwt.verifyToken, jwt.auth([2]), async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let tx = await prisma.transactions.findUnique({where:{id:id}, include:{items:true}})
        if (!tx) return res.status(404).json({message:"transaction not found"})

        const schema = {
            status_id: "number|required"
        }
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        };

        if(req.body.status_id != 4){
            tx = await prisma.transactions.update({where:{id:id}, data:req.body, include:{items:true}})
            return res.json(tx)
        }

        tx.items.map( (Item) =>{
            produk = prisma.products.findFirst({where:{nama:Item.product_name}})
            return prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock-Item.quantity}})
        })

        // for (let i in tx.items){
        //     let produk = await prisma.products.findUnique({where:{nama:tx.items[i]}})
        //     produk = await prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock - tx.items[i].quantity}})
        // }
        tx = await prisma.transactions.update({where:{id:id}, data:req.body, include:{items:true}})
        return res.json(tx)
    } catch (e) {
        return console.log(e)
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