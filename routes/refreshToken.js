var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401)
        const user = await prisma.users.findFirst({ where:{ refresh_token: refreshToken }});
        if(!user) return res.sendStatus(403)
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode)=>{
            if(err) return res.sendStatus(403)
            const userId = user.id;
            const name = user.name;
            const role = user.role;
            const accessToken = jwt.sign({userId, name, role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
            res.json({ accessToken });
        })
    } catch (e) {
        res.sendStatus(500);
    }
})

module.exports = router;