const { LeadNote, User } = require('@models');

const BaseRepository = require('../../base/base.repository');

class LeadNoteRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountAllByLeadId(leadId, options) {
    let { sort, pageSize, pageOffset } = options;

    const { rows, count } = await super.findAndCountAll({
      where: { leadId },
      limit: pageSize,
      offset: pageOffset,
      order: sort,
      include: {
        model: User,
        as: 'addedByUser',
        attributes: ['userId', 'firstName', 'lastName', 'email'],
      },
    });

    return { rows, count };
  }
}

module.exports = new LeadNoteRepository(LeadNote);
