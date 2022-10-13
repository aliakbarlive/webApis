//Manual initialization of cron schedule -- this is run via commandline (just in case its needed)

const { initCronSchedule } = require('./queues/schedule');

initCronSchedule();
