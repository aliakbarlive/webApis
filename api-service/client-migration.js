const dotenv = require('dotenv');
const { sequelize, ClientMigration } = require('./models');
const { addClient, sendEmail } = require('./services/clientMigrationService');

const migrateClient = async (cm) => {
  await addClient(cm.id);
  await sendEmail(cm.id);
};

const start = async () => {
  dotenv.config({ path: 'config/config.env' });
  await sequelize.authenticate();
  console.log('Database Connected!');

  const clients = await ClientMigration.findAll({
    where: { status: null },
  });

  clients.forEach(async (cm) => {
    try {
      console.log(`Migrating ${cm.clientName} (${cm.id})...`);
      await migrateClient(cm);
      console.log(`${cm.clientName} (${cm.id}) - DONE`);
      cm.status = 'done';
    } catch (error) {
      console.error(`${cm.clientName} (${cm.id}) - ERROR`);
      console.error(error);
      cm.status = 'error';
      cm.error = error;
    }

    await cm.save();
  });
};

start();
