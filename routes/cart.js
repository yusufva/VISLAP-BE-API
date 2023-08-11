var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client');
const jwt = require('../middleware/jwtauth');

const prisma = new PrismaClient();
const v = new Validator();

router.get('/', jwt.verifyToken, jwt.auth([4]), async (req,res) => {
    const cart = await prisma.cart.findMany({
        where:{id_user:req.id},
        include: {
            barang: true
        }
    })
    res.json(cart)
})

router.post('/', jwt.verifyToken, jwt.auth([4]), async (req,res) => {
    const schema = {
        id_barang: 'number|required',
        quantity: 'number|required',
        price: 'number|required',
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const cart = await prisma.cart.create({
        data:{
            id_user: req.id,
            id_barang: req.body.id_barang,
            quantity: req.body.quantity,
            price: req.body.price
        }
    })
    res.json(cart)
})

router.delete('/:id', jwt.verifyToken, jwt.auth([4]), async (req,res) =>{
    try {
        const cartId = parseInt(req.params.id)
        let cart = await prisma.cart.findUnique({where:{id:cartId}})
        if (!cart) return res.status(404).json({message:"no cart item founded"})
        cart = await prisma.cart.delete({where:{id:cartId}})
        return res.json({message:"cart item successfully deleted"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
} )

module.exports = router;