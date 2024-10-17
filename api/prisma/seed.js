const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map model names to Prisma models
const modelMap = {
  alocacao: prisma.alocacao,
  automoveis: prisma.automoveis,
  clientes: prisma.clientes,
  concessionarias: prisma.concessionarias,
};

async function seedCSV(filePath, modelName, dataMapping) {
  const dataArray = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        dataArray.push(row);
      })
      .on('end', async () => {
        try {
          console.log(`CSV file ${filePath} successfully processed`);

          const model = modelMap[modelName];
          if (!model) {
            throw new Error(`Model ${modelName} does not exist`);
          }

          // Insert the data into the appropriate model
          for (const dataRow of dataArray) {
            const dataToInsert = dataMapping(dataRow);
            await model.create({
              data: dataToInsert,
            });
          }

          console.log(`Database seeding for ${filePath} completed!`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function main() {
  try {
    // Seed alocacao.csv
    await seedCSV('./dados/alocacao.csv', 'alocacao', (row) => ({
      id: parseInt(row.id),
      area: row.area,
      automovel: row.automovel,
      concecionaria: row.concessionaria,
      quantidade: parseInt(row.quantidade),
    }));

    // Seed automoveis.csv
    await seedCSV('./dados/automoveis.csv', 'automoveis', (row) => ({
      id: parseInt(row.id),
      modelo: row.modelo,
      preco: parseFloat(row.preco), // Parse floats for decimal values
    }));

    // Seed clientes.csv
    await seedCSV('./dados/clientes.csv', 'clientes', (row) => ({
      id: parseInt(row.Id),
      nome: row.Nome,
    }));

    // Seed concessionarias.csv
    await seedCSV('./dados/concessionarias.csv', 'concessionarias', (row) => ({
      id: parseInt(row.id),
      concessionaria: row.concessionaria,
    }));

    console.log('All CSV files seeded successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Seeding complete');
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });
