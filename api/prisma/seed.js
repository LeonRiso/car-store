const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Map model names to Prisma models
const modelMap = {
  alocacao: prisma.alocacao, // Make sure model names are lowercased
  automoveis: prisma.automoveis,
  clientes: prisma.clientes,
  concessionarias: prisma.concessionarias,
};

async function seedCSV(filePath, modelName, dataMapping) {
  const dataArray = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Adjust the separator according to your CSV file
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
    // Seed automoveis.csv first to ensure foreign key references are available
    await seedCSV('./dados/automoveis.csv', 'automoveis', (row) => ({
      id: parseInt(row.id), // Ensure you parse the ID
      modelo: row.modelo,
      preco: parseFloat(row.preco), // Parse floats for decimal values
    }));

    // Seed concessionarias.csv next
    await seedCSV('./dados/concessionarias.csv', 'concessionarias', (row) => ({
      id: parseInt(row.id),
      concessionaria: row.concessionaria,
    }));

    // Seed clientes.csv
    await seedCSV('./dados/clientes.csv', 'clientes', (row) => ({
      id: parseInt(row.Id), // Ensure the casing matches your CSV
      nome: row.Nome,
    }));

    // Seed alocacao.csv last to ensure foreign keys reference existing records
    await seedCSV('./dados/alocacao.csv', 'alocacao', (row) => ({
      area: row.area, // Assuming 'area' can be directly used as a string
      automovel: {
        connect: { id: parseInt(row.automovel) } // Connect to existing automovel by ID
      },
      concessionaria: {
        connect: { id: parseInt(row.concessionaria) } // Connect to existing concessionaria by ID
      },
      quantidade: parseInt(row.quantidade),
    }));

    console.log('All CSV files seeded successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
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
