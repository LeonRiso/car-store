const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {

    fs.createReadStream('./dados/alocacao.csv')
    .pipe(csv({ separator: ';' }))  // Adjust separator if your CSV uses semicolon
    .on('data', (row) => {
      users.push(row);
    })
    .on('end', async () => {
      console.log('CSV file successfully processed');

      // Insert users into the database
      for (const alocacao of alocacaoData) {
        await prisma.alocacao.create({
          data: {
            id: parseInt(alocacao.id), // Assuming this is an Int in your model
            area: alocacao.area,       // As 'area' is a String in your model
            automovel: alocacao.automovel, // 'automovel' is a String
            concecionaria: alocacao.concessionaria, // This needs to match your model spelling
            quantidade: parseInt(alocacao.quantidade), // 'quantidade' is an Int
          },
        });
      }

      console.log('Database seeding completed!');
      await prisma.$disconnect();
    });
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