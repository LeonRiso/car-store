const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const alocacao = await prisma.alocacao.findMany({
        where: {
            area: parseInt(req.params.id)
        }
    });
    return res.json(alocacao);
} 

module.exports = {
    read 
  }