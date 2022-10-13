const syncSubscriptionsCron = require('./queues/subscription/syncSubscriptionsCron');

const start = async () => {
  const args = process.argv.slice(2);
  const page = args.length > 0 ? args[0] : 1;

  console.log(page);
  await syncSubscriptionsCron.add(
    { page },
    {
      delay: 1000 * 60 * 120,
    }
  );
};

start();
