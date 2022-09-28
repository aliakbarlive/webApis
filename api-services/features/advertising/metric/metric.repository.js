const { AdvMetric } = require('@models');

const BaseRepository = require('../../base/base.repository');

class MetricRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }
}

module.exports = new MetricRepository(AdvMetric);
