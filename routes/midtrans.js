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

router.post("/confirm-payment", async (req, res) => {
    try {
        snap.transaction.notification(notificationJson)
            .then(async (statusResponse) => {
                const encrypt = sha512(statusResponse.order_id+statusResponse.status_code+statusResponse.gross_amount+config.serverKey)
                if (encrypt != statusResponse.signature_key) return res.status(401).json({message:"signature key doesn't match"})

                let order = statusResponse.order_id;
                const orderId = order.split("-")
                const id = parseInt(orderId[2]);

                let transactionStatus = statusResponse.transaction_status;
                let fraudStatus = statusResponse.fraud_status;

                let tx = await prisma.transactions.findUnique({where:{id:id}, include:{items:true}})
                if (!tx) return res.status(404).json({message:"transaction not found"})
        
                console.log(`Transaction notification received. Order ID: ${order}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);
        
                // Sample transactionStatus handling logic
        
                if (transactionStatus == 'capture'){
                    if (fraudStatus == 'accept'){
                        // TODO set transaction status on your database to 'success'
                        // and response with 200 OK
                        tx = await prisma.transactions.update({where:{id:id}, data:{status_id:2}, include:{items:true}})
                        for (let i in tx.items){
                            let produk = await prisma.products.findFirst({where:{nama:tx.items[i].product_name}})
                            produk = await prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock - tx.items[i].quantity}})
                        }
                        return res.sendStatus(200)
                    }
                } else if (transactionStatus == 'settlement'){
                    // TODO set transaction status on your database to 'success'
                    // and response with 200 OK
                    tx = await prisma.transactions.update({where:{id:id}, data:{status_id:2}, include:{items:true}})
                    for (let i in tx.items){
                        let produk = await prisma.products.findFirst({where:{nama:tx.items[i].product_name}})
                        produk = await prisma.products.update({where:{id:produk.id}, data:{stock:produk.stock - tx.items[i].quantity}})
                    }
                    return res.sendStatus(200)
                } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
                  // TODO set transaction status on your database to 'failure'
                  // and response with 200 OK
                    tx = await prisma.transactions.update({where:{id:id}, data:{status_id:5}, include:{items:true}})
                    return res.sendStatus(200)
                } else if (transactionStatus == 'pending'){
                  // TODO set transaction status on your database to 'pending' / waiting payment
                  // and response with 200 OK
                    return res.sendStatus(200)
                }
        })

    } catch (e) {
        return res.status(500).json({message:e.message})
    }
})

module.exports = router