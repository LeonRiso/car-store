const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const concessionaria = await prisma.concessionaria.findMany({
        where:{
            veiculoId: parseInt(req.params.id)
        } 
    });
    return res.json(concessionaria);
}

module.exports = {
  read 
}