const moment = require('moment');
const {
  Lead,
  LeadNote,
  User,
  LinkedInAccount,
  LeadConversation,
  LeadVariable,
} = require('@models');
const { Op, literal, fn, wheres } = require('sequelize');
const Sequelize = require('sequelize');

const BaseRepository = require('../base/base.repository');
moment.tz.setDefault('America/Toronto');

class LeadRepository extends BaseRepository {
  constructor(model) {
    super(model);
  }

  async findAndCountLeads(options) {
    let {
      sort,
      pageSize,
      pageOffset,
      statuses,
      // lead,
      // companyName,
      search,
      fields,
      status,
      leadsRep,
      podId,
      manager,
      pitcher,
      startDateStr,
      endDateStr,
    } = options;

    let leadStatus =
      statuses === 'Old-Leads'
        ? ['Old-Leads']
        : statuses === 'No LinkedIn Available'
        ? ['No LinkedIn Available']
        : statuses === 'Duplicate'
        ? ['Duplicate']
        : statuses === 'Unqualified'
        ? ['Unqualified']
        : statuses === 'Out of Stock'
        ? ['Out of Stock']
        : statuses === 'Less than $5000'
        ? ['Less than $5000']
        : statuses === 'Unprocessed New Leads'
        ? ['Unprocessed New Leads']
        : statuses === 'New Leads'
        ? ['New Leads']
        : statuses === 'Approved'
        ? ['Approved']
        : statuses === 'Rejected'
        ? ['Rejected']
        : statuses === 'Revision'
        ? ['Revision']
        : statuses === 'Pitched'
        ? ['Pitched-LL']
        : statuses === 'New Response'
        ? ['Positive-Response', 'Neutral-Response', 'Negative-Response']
        : statuses === 'Booked'
        ? ['Direct-Booking', 'Call-Booked', 'RepliedTo', 'Booked']
        : [];

    let where = {};

    if (startDateStr && endDateStr) {
      const startDate = moment(startDateStr)
        .startOf('day')
        .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
        .format();
      const endDate = moment(endDateStr)
        .endOf('day')
        .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
        .format();

      where.approvedDate = {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      };
      where.status = {
        [Op.notIn]: [
          'No LinkedIn Available',
          'Duplicate',
          'Out of Stock',
          'Less than $5000',
        ],
      };
    }

    if (status) {
      where.status = status;
    } else if (statuses) {
      where.status = { [Op.in]: leadStatus };
    }

    let filteredStatuses = ['Approved', 'Pitched', 'New Response', 'Booked'];

    if (leadsRep && filteredStatuses.includes(statuses) && pitcher !== 'true') {
      where.leadsRep = leadsRep;
    }

    const searches = search?.split(/[\s-]+/);

    if (fields && search) {
      if (fields === 'all') {
        where[Op.and] = {
          [Op.and]: searches.map((s) => {
            return {
              [Op.or]: [
                'productCategory',
                'lead',
                'leadLastName',
                'companyName',
                'email',
                'website',
              ].map((attribute) => {
                return Sequelize.where(
                  Sequelize.fn('unaccent', Sequelize.col(`Lead.${attribute}`)),
                  {
                    [Op.iLike]: `%${s
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')}%`,
                  }
                );
              }),
            };
          }),
        };
      } else {
        where[Op.and] = {
          [Op.and]: searches.map((s) => {
            return Sequelize.where(
              Sequelize.fn('unaccent', Sequelize.col(`Lead.${fields}`)),
              {
                [Op.iLike]: `%${s
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')}%`,
              }
            );
          }),
        };
      }
    }

    const { rows, count } = await super.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      order: sort,
      attributes: [
        'companyName',
        'leadId',
        'lead',
        'leadLastName',
        'status',
        'currentEarnings',
        'productCategory',
        'subCategory2',
        'asinFullTitle',
        'leadType',
        'linkedinContact',
        'instagram',
        'email',
        'facebook',
        'decisionMakersEmail',
        'pitchDate',
        'dateBooked',
        'dateOfCall',
        'dateTimeOfResponse',
        'dateTimeWeResponded',
      ],
      where,
      include: [
        // {
        //   model: User,
        //   as: 'requestedByUser',
        //   attributes: ['userId', 'firstName', 'lastName'],
        //   required: false,
        // },
        {
          model: User,
          as: 'processedByUser',
          attributes: ['userId', 'firstName', 'lastName'],
          required: false,
        },
        {
          model: User,
          as: 'pitchedByUser',
          attributes: ['userId', 'firstName', 'lastName'],
          required: false,
        },
        // {
        //   model: LinkedInAccount,
        //   as: 'liAccountUsed',
        //   attributes: ['linkedInAccountId', 'name', 'email'],
        // },
        // { model: LeadNote, as: 'leadNotes' },
      ],
    });

    return { rows, count };
  }

  async findDuplicateLeads(options) {
    let { lead, companyName, leadLastName } = options;

    let where = {};

    //if (lead) where.lead = { [Op.iLike]: `%${lead}%` };
    if (companyName) where.companyName = { [Op.iLike]: `%${companyName}%` };
    //if (leadLastName) where.leadLastName = { [Op.iLike]: `%${leadLastName}%` };

    const records = await super.findAll({
      where,
      attributes: [
        'lead',
        'leadId',
        'companyName',
        'pitchedDate',
        'status',
        'leadLastName',
      ],
      raw: true,
    });

    return records;
  }

  async findLeadWithNotes(leadId) {
    return await super.findById(leadId, {
      include: [
        {
          model: User,
          as: 'requestedByUser',
          attributes: ['userId', 'firstName', 'lastName'],
        },
        {
          model: User,
          as: 'processedByUser',
          attributes: ['userId', 'firstName', 'lastName'],
        },
        { model: LeadNote, as: 'leadNotes' },
      ],
    });
  }

  async findLeadByField(where) {
    return await super.findOne({
      attributes: ['leadId'],
      where,
    });
  }

  async findLeadsByFields(where) {
    return await super.findAll({
      attributes: ['leadId', 'lead', 'leadLastName', 'companyName', 'status'],
      where,
    });
  }

  async countLeads(where) {
    if (Array.isArray(where.status)) {
      where.status = {
        [Op.in]: where.status,
      };
    }

    return await super.findAndCountAll({
      where,
      attributes: ['companyName', 'leadId', 'status'],
    });
  }

  async listLeadConversationByLeadId(leadId) {
    return await LeadConversation.findAll({
      where: {
        leadId,
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async createLeadConversationByLeadId(leadId, body) {
    return await LeadConversation.create({ leadId, ...body });
  }
}

module.exports = new LeadRepository(Lead);
