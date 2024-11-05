const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config();

// Function to read a specific client by ID
const read = async (req, res) => {
    try {
        const cliente = await prisma.clientes.findUnique({
            where: {
                id: parseInt(req.params.id),
            },
        });

        if (!cliente) {
            return res.status(404).json({ error: 'Client not found' });
        }

        return res.json(cliente);
    } catch (error) {
        console.error('Error fetching client:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const readAll = async (req, res) => {
    try {
        const clientes = await prisma.clientes.findMany();
        return res.json(clientes);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    read,
    readAll,
};
