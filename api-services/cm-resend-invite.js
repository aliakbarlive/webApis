const dotenv = require('dotenv');
const { sequelize, ClientMigration } = require('./models');
const { sendEmail } = require('./services/clientMigrationService');

const start = async () => {
  dotenv.config({ path: 'config/config.env' });
  await sequelize.authenticate();
  console.log('Database Connected!');

  const clients = await ClientMigration.findAll({
    where: { resend: true },
  });

  clients.forEach(async (cm) => {
    try {
      console.log(`Resending invite ${cm.clientName} (${cm.id})...`);
      await sendEmail(cm.id, 'resend');
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
