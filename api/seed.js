
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const alocacao = require("./dados/alocacao.json");
const automoveis = require("./dados/automoveis.json");
const clientes = require("./dados/clientes.json");
const concessionarias = require("./dados/concessionarias.json");

async function main() {
    for (const alocacao of alocacao) {
        await prisma.alocacao.create({
            data: alocacao
        });
    }
    for (const automoveis of automoveis) {
        await prisma.automoveis.create({
            data: automoveis
        });
    }
    for (const clientes of clientes) {
        await prisma.clientes.create({
            data: clientes
        });
    }
    for (const concessionarias of concessionarias) {
        await prisma.concessionarias.create({
            data: concessionarias
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('Seed complete');
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });