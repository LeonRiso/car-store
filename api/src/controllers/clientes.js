const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const clientes = await prisma.clientes.findMany();
    return res.json(clientes);
}

module.exports = {
    read
}