var express = require('express');
var router = express.Router();
const Validator = require('fastest-validator');
const { Prisma, PrismaClient } = require('@prisma/client');
const jwt = require('../middleware/jwtauth');

const prisma = new PrismaClient();
const v = new Validator();

router.get('/user', jwt.verifyToken, jwt.auth([4]), async (req,res) => {
    const service = await prisma.services.findMany({
        include:{
            service_status:{
                select:{
                    status_name:true
                }
            }
        }, 
        where:{
            user_id:req.id
        }
    })
    res.json(service)
})

router.get('/admin', jwt.verifyToken, jwt.auth([2]), async (req,res) => {
    const service = await prisma.services.findMany({
        include:{
            service_status:{
                select:{
                    status_name:true
                }
            }
        }, 
    })
    res.json(service)
})

router.get('/technician', jwt.verifyToken, jwt.auth([3]), async (req,res) => {
    const service = await prisma.services.findMany({
        include:{
            service_status:{
                select:{
                    status_name:true
                }
            }
        }, 
        where:{
            technician_id:req.id
        }
    })
    res.json(service)
})

router.get('/:id', jwt.verifyToken, jwt.auth([2,3]), async (req,res) => {
    try {
        const id = req.params.id;
        const service = await prisma.services.findUnique({
            where:{
                id:id,
            },
            include:{
                service_status:{
                    select:{
                        id:true,
                        status_name:true
                    }
                }
            }
        });
        res.json(service)
    } catch (e) {
        res.status(400).json({message:"id must be a number"})
    }
})

router.get('/technician/:id', jwt.verifyToken, jwt.auth([3]), async (req,res) => {
    try {
        const id = req.params.id;
        const service = await prisma.services.findUnique({
            where:{
                id:id,
            },
            include:{
                service_status:{
                    select:{
                        id:true,
                        status_name:true
                    }
                }
            }
        });
        res.json(service)
    } catch (e) {
        res.status(400).json({message:"id must be a number"})
    }
})

router.post('/', jwt.verifyToken, jwt.auth([4]), async (req,res) => {
    const schema = {
        wa_user : 'string|required',
        message1: 'string|required',
    }
    const validate = v.validate(req.body, schema);
    if (validate.length) {
        return res
        .status(400)
        .json(validate);
    }

    const service = await prisma.services.create({
        data:{
            user_id: req.id,
            wa_user: req.body.wa_user,
            message1: req.body.message1
        }
    })
    res.status(201).json(service)
})

router.put('/:id', jwt.verifyToken, jwt.auth([2]), async (req,res) => {
       const schema = {
            technician_id : 'number|required',
            status_id: 'number|required',
        }
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        }
    try {
 
        const id = parseInt(req.params.id)
        let service = await prisma.services.findUnique({where:{id:id}})
        if (!service) return res.status(404).json({message:"services data not found"});
        service = await prisma.services.update({data:req.body})
        return res.json({message:"services data has been updated"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

router.put('/technician/:id', jwt.verifyToken, jwt.auth([3]), async (req,res,next) => {
    try {
        const id = parseInt(req.params.id)
        let service = await prisma.services.findUnique({where:{id:id}})
        jwt.authId([service.technician_id]);
        
        const schema = {
            message2 : 'string',
            message3 : 'string',
            status_id: 'number'
        }
        const validate = v.validate(req.body, schema);
        if (validate.length) {
            return res
            .status(400)
            .json(validate);
        }

        if (!service) return res.status(404).json({message:"services data not found"});
        service = await prisma.services.update({data:req.body})
        return res.json({message:"services data has been updated"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

router.delete('/:id', jwt.verifyToken, jwt.auth([1]), async (req,res) => {
    try {
        const id = parseInt(req.params.id)
        let service = await prisma.services.findUnique({where:{id:id}})
        if (!service) return res.status(404).json({message:"services data not found"});

        service = await prisma.services.delete({where:{id:id}})
        return res.json({message:"service data has been deleted"})
    } catch (e) {
        return res.status(400).json({message:"id must be a number"})
    }
})

module.exports = router;