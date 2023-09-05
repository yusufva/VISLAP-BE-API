var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client');
const jwt = require('../middleware/jwtauth');

const prisma = new PrismaClient()
const v = new Validator();

router.get('/', jwt.verifyToken, jwt.auth([2,4]), async (req,res) => {
    if(req.role !=2 ){
        const tx = await prisma.transactions.findMany({
            include:{
                items:true,
                status:{
                    select:{
                        status:true
                    }
                },
                user:{
                    select:{
                        name:true,
                        email:true,
                        alamat:true,
                        provinsi:true,
                        kota:true,
                        kecamatan:true,
                        kode_pos:true
                    }
                }
            },
            where:{
                user_id:req.id
            }
        })
        return res.json(tx)
    }
    const tx = await prisma.transactions.findMany({
        include:{
            items:true,
            status:{
                select:{
                    status:true
                }
            },
            user:{
                select:{
                    name:true,
                    email:true,
                    alamat:true,
                    provinsi:true,
                    kota:true,
                    kecamatan:true,
                    kode_pos:true
                }
            }
        }})
    return res.json(tx)
})

router.post('/range', jwt.verifyToken, jwt.auth([2,4]), async (req,res) => {
    const schema = {
        start_date: "string|required",
        end_date: "string|required"
    };
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    };

    const start_date = new Date(new Date(req.body.start_date).setUTCHours(0,0,0,0));
    const end_date = new Date(new Date(req.body.end_date).setUTCHours(23,59,59,999));

    if(req.role !=2 ){
        const tx = await prisma.transactions.findMany({
            include:{
                items:true,
                status:{
                    select:{
                        status:true
                    }
                },
                user:{
                    select:{
                        name:true,
                        email:true,
                        alamat:true,
                        provinsi:true,
                        kota:true,
                        kecamatan:true,
                        kode_pos:true
                    }
                }
            },
            where:{
                AND:{
                    user_id:req.id,
                    date:{
                        gte: start_date,
                        lte: end_date,
                    }
                }
            }
        })
        return res.json(tx)
    }
    const tx = await prisma.transactions.findMany({
        include:{
            items:true,
            status:{
                select:{
                    status:true
                }
            },
            user:{
                select:{
                    name:true,
                    email:true,
                    alamat:true,
                    provinsi:true,
                    kota:true,
                    kecamatan:true,
                    kode_pos:true
                }
            }
        },
        where:{
            date:{
                gte: start_date,
                lte: end_date,
            }
        }})
    return res.json(tx)
})

router.get('/:id', jwt.verifyToken, jwt.auth([2,4]), async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        const tx = await prisma.transactions.findUnique({
            where: {id:id},
            include:{
                items: true,
                status:{
                    select:{
                        status:true
                    }
                },
                user:{
                    select:{
                        name:true,
                        email:true,
                        alamat:true,
                        provinsi:true,
                        kota:true,
                        kecamatan:true,
                        kode_pos:true
                    }
                }
            }
        });
    
        return res.json(tx);
    } catch (e) {
        return res.status(400).json({message:"id must be a number"});
    }

})

router.post('/', jwt.verifyToken, jwt.auth([4]), async (req,res) => {
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
            items:true,
            user:{
                select:{
                    name:true,
                    email:true,
                    alamat:true,
                    provinsi:true,
                    kota:true,
                    kecamatan:true,
                    kode_pos:true
                }
            }
        }
    });
    await prisma.cart.deleteMany({where:{id_user:req.id}});

    res.status(201).json(tx);
})

router.put('/:id', jwt.verifyToken, jwt.auth([2,4]), async (req,res) => {
    try {
        const id = parseInt(req.params.id);
        let tx = await prisma.transactions.findUnique({where:{id:id}, include:{items:true}})
        if (!tx) return res.status(404).json({message:"transaction not found"})

        const schema = {
            status_id: "number|required",
            resi: "string|optional"
        }
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        };

        // if(req.body.status_id == 4){
        //     for (let i in tx.items){
        //         let produk = await prisma.products.findFirst({where:{nama:tx.items[i].product_name}})
        //         produk = await prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock - tx.items[i].quantity}})
        //     }
        //     tx = await prisma.transactions.update({where:{id:id}, data:req.body, include:{items:true}})
        //     return res.json(tx)
        // }

        tx = await prisma.transactions.update({where:{id:id}, data:req.body, include:{items:true}})
        return res.json(tx)
    } catch (e) {
        return console.log(e)
    }
})

router.delete('/:id', jwt.verifyToken, jwt.auth([1]), async (req,res) => {
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