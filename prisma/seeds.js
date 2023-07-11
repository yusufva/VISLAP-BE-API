const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs");

async function account(){
    const adminList = [
        {
            email: "dayat@gmail.com",
            password: bcrypt.hashSync("12345678", 8),
            role: 1
        },
        {
            email: "far@gmail.com",
            password: bcrypt.hashSync("12345678", 8),
            role: 2
        },
        {
            email: "ilzam@gmail.com",
            password: bcrypt.hashSync("12345678", 8),
            role: 3
        },
    ]
    const user = {
        email: "pengguna@gmail.com",
        password: bcrypt.hashSync("12345678", 8),
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
    ]

    for (let data of list){
        await prisma.service_Status.create({ data: data })
    }
}

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