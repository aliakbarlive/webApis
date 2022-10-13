const { LeadVariable } = require('@models');

const BaseRepository = require('../../base/base.repository');

class LeadVariableRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountLeadVariables(options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
    });

    return { rows, count };
  }
}

module.exports = new LeadVariableRepository(LeadVariable);
