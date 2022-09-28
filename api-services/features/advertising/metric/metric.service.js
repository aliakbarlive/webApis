const Response = require('@utils/response');
const MetricRepository = require('./metric.repository');

const getAllMetricNames = async () => {
  const metrics = await MetricRepository.findAll({ attributes: ['name'] });

  return new Response().withData(metrics.map(({ name }) => name));
};

module.exports = { getAllMetricNames };
