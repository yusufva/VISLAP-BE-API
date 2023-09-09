var express = require('express');
var router = express.Router();
var sha512 = require('crypto-js/sha512')
const midtransClient = require('midtrans-client');
const { Prisma, PrismaClient } = require('@prisma/client');
const jwt = require('../middleware/jwtauth');
const Validator = require('fastest-validator');

const prisma = new PrismaClient();
const v = new Validator();

const config = {
    isProduction : false,
    serverKey : process.env.SERVER_KEY,
    clientKey : process.env.CLIENT_KEY,
}

let snap = new midtransClient.Snap(config);
let midtransUrl = config.isProduction ? process.env.PRODUCTION_API : process.env.SANDBOX_API

router.post("/process-payment", jwt.verifyToken, async (req, res) => {
    // return res.json(config)
    const schema = {
        id: "number|required",
        final_price: "number|required"
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    };

    try {
        payload = {
            transaction_details: {
                order_id: `VislapOrder-${new Date().getTime()}-${req.body.id}`,
                gross_amount: req.body.final_price
            },
            "customer_details": {
                "first_name": `${req.body.user.name}`,
                "email": `${req.body.user.email}`,
                "shipping_address": {
                    "first_name": `${req.body.user.name}`,
                    "email": `${req.body.user.email}`,
                    "address": `${req.body.user.alamat}, ${req.body.user.kecamatan}, ${req.body.user.kota}, ${req.body.user.provinsi}`,
                    "city": `${req.body.user.kota}`,
                    "postal_code": `${req.body.user.kode_pos}`,
                    "country_code": "IDN"
                }
            },
            enabled_payments: ["bca_va", "bni_va", "bri_va","cimb_va", "other_va", "gopay", "shopeepay", "indomaret", "alfamart"],
            "bca_va": {
                "va_number": "12345678911",
                "sub_company_code": "00000",
                "free_text": {
                    "inquiry": [
                    {
                        "en": "text in English",
                        "id": "text in Bahasa Indonesia"
                    }
                    ],
                    "payment": [
                    {
                        "en": "text in English",
                        "id": "text in Bahasa Indonesia"
                    }
                    ]
                }
                },
                "bni_va": {
                "va_number": "12345678"
                },
                "bri_va": {
                "va_number": "1234567891234"
                },
                "cimb_va": {
                "va_number": "1234567891234567"
                },
                "cstore": {
                    "alfamart_free_text_1" : "qwerty",
                    "alfamart_free_text_2" : "asdfg",
                    "alfamart_free_text_3" : "zxcvb"
                }
        }

        snap.createTransaction(payload).then((tx) => {
            const dataPayment = {
                response: JSON.stringify(tx)
            }
            const token = tx.token
            const redirect = tx.redirect_url
            res.status(200).json({message:"berhasil", dataPayment, token:token, redirectUrl:redirect})
        })
    } catch (e) {
        res.status(500).json({message : e.message})
    }
})

router.post("/process-payment/services", jwt.verifyToken, jwt.auth([2]), async (req,res)=>{
    // return res.json(config)
    const schema = {
        id: "number|required",
        price: "number|required"
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    };

    try {
        payload = {
            transaction_details: {
                order_id: `VislapServices-${new Date().getTime()}-${req.body.id}`,
                gross_amount: req.body.price
            },
            "customer_details": {
                "first_name": `${req.body.user.name}`,
                "email": `${req.body.user.email}`,
                "shipping_address": {
                    "first_name": `${req.body.user.name}`,
                    "email": `${req.body.user.email}`,
                    "address": `${req.body.user.alamat}, ${req.body.user.kecamatan}, ${req.body.user.kota}, ${req.body.user.provinsi}`,
                    "city": `${req.body.user.kota}`,
                    "postal_code": `${req.body.user.kode_pos}`,
                    "country_code": "IDN"
                }
            },
            enabled_payments: ["bca_va", "bni_va", "bri_va","cimb_va", "other_va", "gopay", "shopeepay", "indomaret", "alfamart"],
            "bca_va": {
                "va_number": "12345678911",
                "sub_company_code": "00000",
                "free_text": {
                    "inquiry": [
                    {
                        "en": "text in English",
                        "id": "text in Bahasa Indonesia"
                    }
                    ],
                    "payment": [
                    {
                        "en": "text in English",
                        "id": "text in Bahasa Indonesia"
                    }
                    ]
                }
                },
                "bni_va": {
                "va_number": "12345678"
                },
                "bri_va": {
                "va_number": "1234567891234"
                },
                "cimb_va": {
                "va_number": "1234567891234567"
                },
                "cstore": {
                    "alfamart_free_text_1" : "qwerty",
                    "alfamart_free_text_2" : "asdfg",
                    "alfamart_free_text_3" : "zxcvb"
                }
        }

        snap.createTransaction(payload).then((tx) => {
            const dataPayment = {
                response: JSON.stringify(tx)
            }
            const token = tx.token
            const redirect = tx.redirect_url
            res.status(200).json({message:"berhasil", dataPayment, token:token, redirectUrl:redirect})
        })
    } catch (e) {
        res.status(500).json({message : e.message})
    }
})

router.post("/confirm-payment", async (req, res) => {
    try {
        console.log(`Transaction notification recieved. Order ID: ${req.body.order_id}. Transaction status: ${req.body.transaction_status}. Fraud status: ${req.body.fraud_status}`)
        const encrypt = sha512(req.body.order_id+req.body.status_code+req.body.gross_amount+config.serverKey)
        if (encrypt != req.body.signature_key) return res.status(401).json({message:"signature key doesn't match"})

        const order = req.body.order_id
        const orderId = order.split("-")
        const id = parseInt(orderId[2]);

        //get services
        let service = await prisma.services.findUnique({where:{id:id}})
        if (!tx) return res.status(404).json({message:"services not found"})

        //get txs
        let tx = await prisma.transactions.findUnique({where:{id:id}, include:{items:true}})
        if (!tx) return res.status(404).json({message:"transaction not found"})

        const approved = ["capture", "settlement"]

        if (approved.includes(req.body.transaction_status)){

            if (orderId[0] == "VislapServices") {
                service = await prisma.services.update({where:{id:id}, data:{status_id:4}})
            return res.sendStatus(200)
            }

            tx = await prisma.transactions.update({where:{id:id}, data:{status_id:2}, include:{items:true}})
            for (let i in tx.items){
                let produk = await prisma.products.findFirst({where:{nama:tx.items[i].product_name}})
                produk = await prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock - tx.items[i].quantity}})
            }
            return res.sendStatus(200)

        } else if(req.body.transaction_status === "pending"){
            return res.sendStatus(200)
        }

        if (orderId[0] == "VislapServices") {
            service = await prisma.services.update({where:{id:{id}}, data:{status_id:5}})
            return res.sendStatus(200)
        }
        tx = await prisma.transactions.update({where:{id:id}, data:{status_id:5}, include:{items:true}})
        return res.sendStatus(200)

    } catch (e) {
        return res.status(500).json({message:e.message})
    }
})

module.exports = router