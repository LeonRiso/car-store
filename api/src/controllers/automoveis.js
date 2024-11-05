const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const veiculo = await prisma.veiculo.findMany({
        where: {
            id: parseInt(req.params.id)
        }
    });
    return res.json(veiculo);
}

module.exports = {
    read 
  }