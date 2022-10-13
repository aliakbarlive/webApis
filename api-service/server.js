require('module-alias/register');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const dotenv = require('dotenv');
const { BullMonitorExpress } = require('@bull-monitor/express');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const { sequelize } = require('./models');
const errorHandler = require('./middleware/error');

const { queues, initWorkers } = require('./queues');

const invoicing = require('./routes/agency/invoicing');
const agencyClients = require('./routes/agency/client');
const creditNotes = require('./routes/agency/creditNotes');
const subscriptions = require('./routes/agency/subscription');
const commissions = require('./routes/agency/commissions');
const invoices = require('./routes/agency/invoices');
const reports = require('./routes/agency/reports');
const invites = require('./routes/agency/invites');
const employees = require('./routes/agency/employees');
const marketplaces = require('./routes/agency/marketplaces');
const terminations = require('./routes/agency/terminations');
const upsells = require('./routes/agency/upsells.routes');
const leads = require('@features/lead/lead.route');
const agencyClient = require('@features/agencyClient/agencyClient.route');
const roles = require('@features/role/role.route');
const permissions = require('./routes/agency/permissions');
const ErrorResponse = require('./utils/errorResponse');
const {
  healthCheck,
  socketTest,
  getSocketConnectedUsers,
} = require('./controllers/healthCheck');
const { initCronSchedule } = require('./queues/schedule');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const SocketInit = require('./socket');
const { protect, authorize } = require('./middleware/auth');
const { socketAuth } = require('./middleware/socket');
const { initEvents } = require('./events');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/resources/locales/{{lng}}/{{ns}}.json',
    },
    fallbackLng: 'en',
    preload: ['en'],
  });

dotenv.config({ path: 'config/config.env' });

const app = express();
const agencyPrefix = 'agency';
const version = 'v1';

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(i18nextMiddleware.handle(i18next));

app.disable('etag');
app.use(cookieParser());

// set security HTTP headers
// app.use(helmet());

// create custom request for zoho webhook
// we need rawBody to verify the signature hash
const body = {
  verify: function (req, res, buf) {
    req.rawBody = buf;
  },
};
const versionPrefix = `${version}/${agencyPrefix}`;

app.post(`/${versionPrefix}/commission/autoadd`, express.json(body));
app.post(`/${versionPrefix}/subscription/syncstatus`, express.json(body));
app.post(`/${versionPrefix}/invoice/syncdetails`, express.json(body));

// parse json request body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

app.use(bodyParser.json({ limit: '50MB' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50MB' }));

// sanitize request data
// app.use(xss());

// gzip compression
// app.use(compression());

// CORS
app.use(
  cors({
    origin: [
      'http://172.17.0.1',
      'http://localhost',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:3003',
      'http://local.stalliondirect.com',
      'https://app.betterseller.com',
      'http://app.betterseller.com',
      'https://app.test.better-seller.betterseller.com',
      'http://app.test.better-seller.betterseller.com',
      'https://agency.betterseller.com',
      'http://agency.betterseller.com',
      'https://agency.test.better-seller.betterseller.com',
      'http://agency.test.better-seller.betterseller.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);
app.options('*', cors()); // include before other routes

// health check route
app.use(`/health-check`, healthCheck);
app.use('/socket-test', socketTest);
app.use('/socket-users', getSocketConnectedUsers);

// v1 api routes
app.use(`/${version}`, routes);

// v1 agency api routes
app.use(`/${version}/${agencyPrefix}/invoicing`, invoicing);
app.use(`/${version}/${agencyPrefix}/client`, agencyClients);
app.use(`/${version}/${agencyPrefix}/credit-notes`, creditNotes);
app.use(`/${version}/${agencyPrefix}/subscription`, subscriptions);
app.use(`/${version}/${agencyPrefix}/commission`, commissions);
app.use(`/${version}/${agencyPrefix}/invoice`, invoices);
app.use(`/${version}/${agencyPrefix}/reports`, reports);
app.use(`/${version}/${agencyPrefix}/invite`, invites);
app.use(`/${version}/${agencyPrefix}/employees`, employees);
app.use(`/${version}/${agencyPrefix}/marketplaces`, marketplaces);
app.use(`/${version}/${agencyPrefix}/terminations`, terminations);
app.use(`/${version}/${agencyPrefix}/permissions`, permissions);
app.use(`/${version}/${agencyPrefix}/upsells`, upsells);
app.use(`/${version}/${agencyPrefix}/leads`, leads);
app.use(`/${version}/${agencyPrefix}/roles`, roles);
app.use(`/${version}/${agencyPrefix}/client-v2`, agencyClient);

// Initialize bull monitor
(async () => {
  const monitor = new BullMonitorExpress({
    gqlPlayground: false,
    queues,
  });
  await monitor.init();
  console.log('Bull monitor initialized');
  app.use('/bull-monitor', protect, authorize, monitor.router);

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ErrorResponse('Not found', 404));
  });
})();

// Error handle middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

let server = app;

if (process.env.MODE === 'api') {
  server = http.createServer(app);
  const socketIo = require('socket.io');
  const { instrument } = require('@socket.io/admin-ui');

  const io = socketIo(server, {
    cors: {
      origin: [
        process.env.SITE_URL,
        'https://admin.socket.io',
        'http://localhost',
      ],
      methods: ['GET', 'POST'],
      allowedHeaders: ['my-custom-header'],
      credentials: true,
    },
  });

  instrument(io, {
    auth: {
      type: 'basic',
      username: 'admin',
      password: '$2a$10$96AbRrGRWN.Y7OMUVruVg.rI68kBTOcXmXqsZZAzNDq9r7yhh2ozO',
    },
  });

  const { createClient } = require('redis');
  const { createAdapter } = require('@socket.io/redis-adapter');

  const pubClient = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
  const subClient = pubClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));
  io.use(socketAuth);

  new SocketInit(io);

  console.log('Socket initialized');
}

server.listen(PORT, async () => {
  console.log(
    `🚀 ${process.env.NODE_ENV} - ${process.env.MODE} server ready at: http://localhost:${PORT}`
  );

  try {
    // Check for sequelize connection
    await sequelize.authenticate();
    console.log('Database Connected!');

    // Initialize bull queue workers
    initWorkers();
    console.log('Bull queue workers initiated');

    // CRON jobs
    initCronSchedule();
    console.log('Scheduled jobs initiated');

    // event emitters
    initEvents();
    console.log('Event emitter initiated');
  } catch (error) {
    console.log('Error', error.message);
  }
});

// Hanlde unhandled promised rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(err);
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
