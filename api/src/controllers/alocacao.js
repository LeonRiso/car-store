const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

const read = async (req, res) => {
    const alocacao = await prisma.alocacao.findMany({
        where: {
            id: parseInt(req.params.id)
        }
    });
    return res.json(alocacao);
} 

const readAll = async (req, res) => {
    try {
        const alocacoes = await prisma.Alocacao.findMany({
            include: {
                automovel: true, // Include automovel data
                concessionaria: true, // Include concessionaria data
            }
        });
        return res.json(alocacoes);
    } catch (error) {
        console.error('Error fetching allocations:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const readByArea = async (req, res) => {
    const areaId = req.params.areaId; 
    const alocacoes = await prisma.alocacao.findMany({
        where: {
            area: areaId
        },
        include: {
            automovel: true,        
            concessionaria: true    
        }
    });
    return res.json(alocacoes);
};

const del = async (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id);

    // Check if the parsed id is a valid number
    if (isNaN(parsedId)) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    try {
        // Check if the allocation exists
        const allocation = await prisma.alocacao.findUnique({
            where: {
                id: parsedId,
            },
        });

        // If allocation does not exist, return a 404 error
        if (!allocation) {
            return res.status(404).json({ error: 'Allocation not found' });
        }

        // Proceed to delete the allocation
        await prisma.alocacao.delete({
            where: {
                id: parsedId,
            },
        });

        return res.status(200).json({ message: 'Vehicle sold and removed from allocation' });
    } catch (error) {
        console.error('Error deleting allocation:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = {
    read,
    readAll,
    readByArea,
    del
  }