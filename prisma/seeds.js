const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs");

async function account(){
    const adminList = [
        {
            name: "dayat",
            email: "dayat@gmail.com",
            password: bcrypt.hashSync("12345678", 13),
            role: 1
        },
        {
            name: "far",
            email: "far@gmail.com",
            password: bcrypt.hashSync("12345678", 13),
            role: 2
        },
        {
            name: "ilzam",
            email: "ilzam@gmail.com",
            password: bcrypt.hashSync("12345678", 13),
            role: 3
        },
    ]
    const user = {
        name: "user1",
        email: "pengguna@gmail.com",
        password: bcrypt.hashSync("12345678", 13),
        role: 4
    }

    for (let data of adminList){
        await prisma.admins.create({ data:data })
    }
    await prisma.users.create({ data: user})
}

async function role(){
    const list = [
        {
            role_name: "SuperAdmin"
        },
        {
            role_name: "WebAdmin"
        },
        {
            role_name: "Technician"
        },
        {
            role_name: "Users"
        }
    ]
    for (let data of list) {
        await prisma.role.create({
            data: data
        })
    }
}

async function serv_status(){
    const list =[
        {
            status_name: "Pending"
        },
        {
            status_name: "Processed"
        },
        {
            status_name: "Finished"
        },
        {
            status_name: "Cancelled"
        },
        {
            status_name: "Refund"
        },
    ]

    for (let data of list){
        await prisma.service_Status.create({ data: data })
    }
}

async function transaksi_status(){
    const list =[
        {
            status: "Menunggu Pembayaran"
        },
        {
            status: "Pesanan Diproses"
        },
        {
            status: "Menunggu pengiriman/pengambilan"
        },
        {
            status: "Selesai"
        },
        {
            status: "Cancelled"
        },
    ]

    for (let data of list){
        await prisma.transaksi_Status.create({data:data})
    }
}

transaksi_status()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.log(e)
        await prisma.$disconnect()
        process.exit(1)
    })

role()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

account()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

serv_status()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async e => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })