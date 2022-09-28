const { Op, literal, fn, col } = require('sequelize');

const Response = require('@utils/response');

const LeadRepository = require('./lead.repository');
const LeadNoteRepository = require('./notes/note.repository');

const roleService = require('@services/role.service');
const userService = require('@services/user.service');
const agencyClientService = require('@services/agencyClient.service');
const usergroupService = require('@services/usergroup.service');
const LeadVariableRepository = require('./variables/variable.repository');
const LinkedInAccountsRepository = require('./liAccounts/liAccount.repository');
const AgencyClientRepository = require('../agencyClient/AgencyClientRepository');

const { paginate } = require('@services/pagination.service');

const moment = require('moment');
const leadSourceRepository = require('./leadSource.repository');
moment.tz.setDefault('America/Toronto');

/**
 * Get the list of leads
 * @param {Object} options - parameters needed to get the list of leads
 * @returns JSON Array Object
 */
const listLeads = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await LeadRepository.findAndCountLeads(options);

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Leads successfully fetched.');
};

/**
 * Get the duplicate leads
 * @param {Object} options - parameters needed to get the list of leads
 * @returns JSON Array Object
 */
const listLeadsDuplicate = async (options) => {
  const { companyName } = options;

  let records = await LeadRepository.findDuplicateLeads(options);

  if (companyName) {
    const clientRecords = await AgencyClientRepository.findAll({
      where: {
        client: { [Op.iLike]: `%${companyName}%` },
      },
      attributes: [
        ['client', 'companyName'],
        ['agencyClientId', 'leadId'],
        'status',
        'cancelledAt',
      ],
      raw: true,
    });
    records = [...clientRecords, ...records];
  }
  return new Response()
    .withData(records)
    .withMessage('Leads successfully fetched.');
};

const countLeads = async (options) => {
  const { podId, leadsRep } = options;

  let records = {};

  records.Approved = await LeadRepository.countLeads({
    leadsRep,
    status: 'Approved',
  });

  records.AssignedToMe = await LeadRepository.countLeads({
    leadsRep,
    status: ['Unprocessed New Leads', 'Old-Leads'],
  });

  return new Response()
    .withData(records)
    .withMessage('Leads successfully fetched.');
};

const listLeadsVariables = async (options) => {
  // const { page, pageSize, pageOffset } = options;

  const records = await LeadVariableRepository.findAndCountLeadVariables(
    options
  );

  return new Response()
    .withData(records)
    .withMessage('Leads variable successfully fetched.');
};

const createLeadVariable = async (req) => {
  const { body } = req;

  const sameKey = await LeadVariableRepository.findAll({
    where: {
      key: {
        [Op.iLike]: body.key,
      },
    },
  });

  if (sameKey.length > 0) {
    return new Response().failed().withCode(409).withMessage('Same key exist!');
  }

  const leadVariable = await LeadVariableRepository.create(body);
  return new Response()
    .withData(leadVariable)
    .withMessage('Lead variable successfully created.');
};

const updateLeadVariable = async (req, id) => {
  const { body } = req;

  const sameKey = await LeadVariableRepository.findAll({
    where: {
      key: {
        [Op.iLike]: body.key,
      },
    },
  });

  if (sameKey.length > 1) {
    return new Response().failed().withCode(409).withMessage('Same key exist!');
  }

  const leadVariable = await LeadVariableRepository.update(body, {
    where: { leadVariableId: id },
  });

  return new Response()
    .withData(leadVariable)
    .withMessage('Lead variable successfully updated.');
};

const listLinkedInAccounts = async (options) => {
  // const { page, pageSize, pageOffset } = options;

  const records = await LinkedInAccountsRepository.findAndCountLinkedInAccounts(
    options
  );

  return new Response()
    .withData(records)
    .withMessage('Leads LinkedIn Accounts successfully fetched.');
};

const createliAccount = async (req) => {
  const { body } = req;

  const leadVariable = await LinkedInAccountsRepository.create(body);

  return new Response()
    .withData(leadVariable)
    .withMessage('Lead LinkedIn Accounts successfully created.');
};

const updateliAccount = async (req, id) => {
  const { body } = req;

  const liAccount = await LinkedInAccountsRepository.update(body, {
    where: { linkedInAccountId: id },
  });

  return new Response()
    .withData(liAccount)
    .withMessage('LinkedIn Account successfully updated.');
};

const getLeadByCompanyName = async (lead, companyName) => {
  return await LeadRepository.findLeadByField({ lead, companyName });
};

const getLeadByLinkedIn = async (companyLI) => {
  const lead = await LeadRepository.findLeadByField({ companyLI });

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully fetched.');
};

const getLead = async (leadId) => {
  const lead = await LeadRepository.findLeadWithNotes(leadId);

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully fetched.');
};

const createLead = async (req) => {
  const { body, user } = req;

  body.pitchDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const lead = await LeadRepository.create(body);

  if (lead) {
    const { leadId } = lead;
    if (body.notes) {
      body.notes.map(async (note) => {
        await LeadNoteRepository.create({
          leadId,
          name: note.name,
          description: note.description.toString(),
          addedBy: user.userId,
        });
      });
    }
    await LeadNoteRepository.create({
      leadId,
      name: 'Added Lead',
      description: 'Lead is successfully added ',
      addedBy: user.userId,
    });
  }

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully created.');
};

const addUnprocessedLead = async (payload) => {
  const lead = await LeadRepository.create(payload);
  const leadSource = await leadSourceRepository.findById(payload.leadSourceId);

  if (lead) {
    await LeadNoteRepository.create({
      leadId: lead.leadId,
      name: 'Added Lead',
      description: `Lead imported from ${leadSource.filename}. Source ID: ${leadSource.leadSourceId}`,
      addedBy: leadSource.uploadedBy,
    });
  }

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully created.');
};

/**
 * Update Lead
 * @param {String} leadId
 * @param {Object} req
 * @param {Boolean} log
 * @returns Object
 */
const updateLead = async (leadId, req, log = true) => {
  const { body, user } = req;
  const lead = await LeadRepository.update(body, { where: { leadId } });
  if (lead && log) {
    const currentLead = LeadRepository.findLeadWithNotes(leadId);

    let description = '';

    if (currentLead.status !== body.status) {
      description += `Lead status is changed to ${body.status} \n`;
    }

    if (currentLead.typeOfResponse !== body.typeOfResponse) {
      description += `Lead type of response is changed to ${body.typeOfResponse} \n`;
    }

    if (currentLead.leadType !== body.leadType) {
      description += `Lead type is changed to ${body.leadType} \n`;
    }

    if (currentLead.leadQuality !== body.leadQuality) {
      description += `Lead type quality is changed to ${body.leadQuality} \n`;
    }

    if (currentLead.remarks !== body.remarks) {
      description += `Lead remarks is changed to ${body.remarks} \n`;
    }

    if (currentLead.dateBooked !== body.dateBooked) {
      description += `Lead date booked is set to ${body.dateBooked} \n`;
    }

    if (body.notes) {
      body.notes.map(async (note) => {
        await LeadNoteRepository.create({
          leadId,
          name: note.name,
          description: note.description.toString(),
          addedBy: user.userId,
        });
      });
    }

    await LeadNoteRepository.create({
      leadId,
      name: 'Updated Lead',
      description,
      addedBy: user.userId,
    });
  }

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully updated.');
};

/**
 * Delete Lead
 * @param {String} leadId
 * @returns
 */
const deleteLead = async (leadId) => {
  const lead = await LeadRepository.delete({ where: { leadId } });

  return new Response()
    .withData(lead)
    .withMessage('Lead successfully deleted.');
};

/**
 *
 * @param {String} leadId - ID of the lead
 * @param {Object} options - parameters for getting the lead notes
 * @returns
 */
const listLeadNotesByLead = async (leadId, options) => {
  const { page, pageSize, pageOffset } = options;
  const { rows, count } = await LeadNoteRepository.findAndCountAllByLeadId(
    leadId,
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Lead Notes successfully fetched.');
};

/**
 * Create lead note
 * @param {Object} body - parameter needed for creating the lead note
 * @returns
 */
const createLeadNote = async (body) => {
  const note = await LeadNoteRepository.create(body);

  return new Response()
    .withData(note)
    .withMessage('Lead Note successfully created.');
};

/**
 * Delete the lead note by lead note id
 * @param {String} leadNoteId - ID
 * @returns Object
 */
const deleteLeadNote = async (leadNoteId) => {
  const lead = await LeadNoteRepository.delete({ where: { leadNoteId } });

  return new Response()
    .withData(lead)
    .withMessage('Lead Note successfully deleted.');
};

/**
 * Get overall metrics for the leads base on status
 * @param {String} startDateStr - start date for getting the leads
 * @param {String} endDateStr - end date for getting the leads
 * @returns JSON Array Object
 */
const getOverallMetrics = async (startDateStr, endDateStr) => {
  const startDate = moment(startDateStr)
    .startOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();
  const endDate = moment(endDateStr)
    .endOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();

  const roleIds = await roleService.getRoleIds([
    'Lead Generation Representative - New Leads',
    'Lead Generation Representative - Old Leads',
    'Lead Generation Representative - Pitcher',
    'Lead Generation Representative - Responses',
  ]);

  const totalRep = await userService.getUsersByRoleId(roleIds);

  const totalPitches = await LeadRepository.findLeadsByFields({
    approvedDate: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
  });
  const totalSentPitches = await LeadRepository.findLeadsByFields({
    pitchedDate: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
    // [Op.or]: [
    //   {
    //     typeOfResponse: 'PositiveResponse',
    //   },
    //   {
    //     typeOfResponse: 'PositiveResponsetoBookedCall',
    //   },
    //   {
    //     typeOfResponse: 'NeutralResponse',
    //   },
    //   {
    //     status: 'Positive-Response',
    //   },
    //   {
    //     status: 'Neutral-Response',
    //   },
    //   {
    //     status: 'Negative-Response',
    //   },
    //   {
    //     status: 'Pitched-LL',
    //   },
    // ],
  });
  const totalResponses = await LeadRepository.findLeadsByFields({
    dateTimeOfResponse: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
    [Op.or]: [
      {
        typeOfResponse: 'PositiveResponse',
      },
      {
        typeOfResponse: 'PositiveResponsetoBookedCall',
      },
      {
        typeOfResponse: 'NeutralResponse',
      },
      {
        status: 'Positive-Response',
      },
      {
        status: 'Neutral-Response',
      },
      {
        status: 'Negative-Response',
      },
    ],
  });
  const totalBookedCalls = await LeadRepository.findLeadsByFields({
    dateBooked: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
    status: 'Call-Booked',
  });

  const responseRate =
    totalResponses.length > 0 && totalSentPitches.length > 0
      ? (totalResponses.length / totalSentPitches.length) * 100
      : 0;

  const bookedCallRate =
    totalBookedCalls.length > 0 && totalResponses.length > 0
      ? (totalBookedCalls.length / totalResponses.length) * 100
      : 0;

  let stats = {
    totalRep: totalRep.length,
    totalPitches: totalPitches.length,
    totalSentPitches: totalSentPitches.length,
    totalResponses: totalResponses.length,
    responseRate: responseRate.toFixed(2),
    bookedCallRate: bookedCallRate.toFixed(2),
    totalBookedCalls: totalBookedCalls.length,
    startDate,
    endDate,
  };

  return stats;
};

const weekMonth = (date) => {
  const prefixes = [1, 2, 3, 4, 5];
  return prefixes[0 | (moment(date).date() / 7)];
};

/**
 * Get all call-booked leads and group it by week
 * @param {String} startDateStr - start date for getting the leads
 * @param {String} endDateStr - end date for getting the leads
 * @returns JSON Array Object
 */
const getGraphMetrics = async (startDateStr, endDateStr, podId) => {
  const startDate = moment(startDateStr)
    .startOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();
  const endDate = moment(endDateStr)
    .endOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();

  let bookedCallByWeek = [];
  let weekRange = [];

  const start = moment(startDate); //.startOf('isoWeek');
  const end = moment(endDate);

  let initial = start;
  while (initial < end) {
    weekRange.push({
      startDate: initial.format('YYYY-MM-DD'),
    });
    initial = initial.add(1, 'weeks');
  }

  const promises = weekRange.map(async (d) => {
    const startDate = moment(d.startDate).format('YYYY-MM-DD');
    const endDate = moment(d.startDate)
      .add(1, 'weeks')
      .subtract(1, 'days')
      .format('YYYY-MM-DD');

    const totalBookedCalls = await LeadRepository.findLeadsByFields({
      // podId: podId ?? [],
      dateBooked: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
      status: 'Call-Booked',
    });
    return {
      week: moment(d.startDate).format('MMM') + ' Week ' + weekMonth(startDate),
      count: totalBookedCalls.length,
    };
  });
  bookedCallByWeek = await Promise.all(promises);
  return bookedCallByWeek;
};

/**
 * Get team metrics by pod and return the breakdown of leads by representatives
 * @param {String} startDateStr - start date for getting the leads
 * @param {String} endDateStr - end date for getting the leads
 * @returns JSON Array Object
 */
const getGroupMetrics = async (startDateStr, endDateStr) => {
  const startDate = moment(startDateStr)
    .startOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();
  const endDate = moment(endDateStr)
    .endOf('day')
    .tz('2022-08-02 14:12:45+00', 'America/Los_Angeles')
    .format();

  const users = await usergroupService.getPodsByType('sales lead');
  const result = users.map(async (u) => {
    const { podId, name, Cells } = u;
    let reps = Cells.length > 0 ? Cells : [];

    let userList = [];
    reps.map(async (r) => {
      const { users } = r;
      users.map(async (u) => {
        const { userId, firstName, lastName, email } = u;
        userList = [...userList, { userId, firstName, lastName, email }];
      });
    });

    const temp = userList.map(async (r) => {
      const { userId, firstName, lastName, email } = r;

      // Basic Query
      let where = {
        leadsRep: userId,
      };

      // Stats per lead gen reps
      const pitches = await LeadRepository.findLeadsByFields({
        ...where,
        approvedDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
      });

      const sentPitches = await LeadRepository.findLeadsByFields({
        ...where,
        pitchedDate: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        // [Op.or]: [
        //   {
        //     typeOfResponse: 'PositiveResponse',
        //   },
        //   {
        //     typeOfResponse: 'PositiveResponsetoBookedCall',
        //   },
        //   {
        //     typeOfResponse: 'NeutralResponse',
        //   },
        //   {
        //     status: 'Positive-Response',
        //   },
        //   {
        //     status: 'Neutral-Response',
        //   },
        //   {
        //     status: 'Negative-Response',
        //   },
        // ],
      });

      const positiveResponse = await LeadRepository.findLeadsByFields({
        ...where,
        dateTimeOfResponse: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        [Op.or]: [
          {
            typeOfResponse: 'PositiveResponse',
          },
          {
            typeOfResponse: 'PositiveResponsetoBookedCall',
          },
          {
            status: 'Positive-Response',
          },
        ],
      });

      const negativeResponse = await LeadRepository.findLeadsByFields({
        ...where,
        dateTimeOfResponse: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        status: 'Negative-Response',
      });

      const neutralResponse = await LeadRepository.findLeadsByFields({
        ...where,
        dateTimeOfResponse: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        [Op.or]: [
          {
            typeOfResponse: 'NeutralResponse',
          },
          {
            status: 'Neutral-Response',
          },
        ],
      });

      const totalResponseOfRep =
        negativeResponse.length +
        positiveResponse.length +
        neutralResponse.length;

      const bookedCalls = await LeadRepository.findLeadsByFields({
        ...where,
        dateBooked: {
          [Op.gte]: startDate,
          [Op.lte]: endDate,
        },
        status: 'Call-Booked',
      });

      const responseRate =
        totalResponseOfRep > 0 && sentPitches.length > 0
          ? (totalResponseOfRep / sentPitches.length) * 100
          : 0;

      const bookedCallRate =
        bookedCalls.length > 0 && positiveResponse.length > 0
          ? (bookedCalls.length / positiveResponse.length) * 100
          : 0;

      return {
        userId,
        name: firstName + ' ' + lastName,
        email,
        totalPitches: pitches[0] ? pitches.length : 0,
        totalPitchesSent: sentPitches.length,
        totalResponseOfRep,
        positiveResponse: positiveResponse.length,
        negativeResponse: negativeResponse.length,
        neutralResponse: neutralResponse.length,
        numOfBookedCalls: bookedCalls.length,
        responseRate: responseRate.toFixed(2),
        bookedCallRate: bookedCallRate.toFixed(2),
      };
    });

    const leadReps = await Promise.all(temp);
    const totalPitches = leadReps.reduce(
      (total, next) => total + next.totalPitches,
      0
    );
    const totalPitchesSent = leadReps.reduce(
      (total, next) => total + next.totalPitchesSent,
      0
    );

    const numOfPositiveResponses = leadReps.reduce(
      (total, next) => total + next.positiveResponse,
      0
    );

    const numOfNegativeResponses = leadReps.reduce(
      (total, next) => total + next.negativeResponse,
      0
    );

    const numOfNeutralResponses = leadReps.reduce(
      (total, next) => total + next.neutralResponse,
      0
    );
    const numOfBookedCalls = leadReps.reduce(
      (total, next) => total + next.numOfBookedCalls,
      0
    );

    const totalResponse =
      numOfNeutralResponses + numOfNegativeResponses + numOfPositiveResponses;

    const responseRate =
      totalResponse > 0 && totalPitchesSent > 0
        ? (totalResponse / totalPitchesSent) * 100
        : 0;

    const bookedCallRate =
      numOfBookedCalls > 0 && numOfPositiveResponses > 0
        ? (numOfBookedCalls / numOfPositiveResponses) * 100
        : 0;

    return {
      podId,
      name,
      teamMetrics: {
        totalPitches,
        totalPitchesSent,
        totalResponse,
        numOfPositiveResponses,
        numOfNegativeResponses,
        numOfNeutralResponses,
        numOfBookedCalls,
        responseRate: responseRate.toFixed(2),
        bookedCallRate: bookedCallRate.toFixed(2),
      },
      group: leadReps,
    };
  });

  return await Promise.all(result);
};

const checkExistingLead = async (leadName) => {
  return await agencyClientService.getClientByName(leadName);
};

const checkBrandExists = async (leadName) => {
  const clientExists = await AgencyClientRepository.count({
    where: { client: leadName },
  });
  const leadExists = await LeadRepository.count({
    where: { brandName: leadName },
  });

  return clientExists || leadExists;
};

const cleanExistingLeads = async () => {
  const leads = await LeadRepository.findAll();

  leads.map(async (lead) => {
    const exists = await checkExistingLead(lead.lead);
    if (exists) {
      await LeadNoteRepository.delete({ where: { leadId: lead.leadId } });
      await LeadRepository.delete({ where: { leadId: lead.leadId } });
    }
  });
};

const listLeadConversation = async (leadId) => {
  const records = await LeadRepository.listLeadConversationByLeadId(leadId);

  return new Response()
    .withData(records)
    .withMessage('Lead Conversation successfully fetched.');
};

const createLeadConversation = async (leadId, req) => {
  const { body } = req;
  const conversation = await LeadRepository.createLeadConversationByLeadId(
    leadId,
    body
  );

  return new Response()
    .withData(conversation)
    .withMessage('Lead Conversation successfully fetched.');
};

const cleanDuplicateLeads = async () => {
  // Get and count all occurrences of the Lead Company
  const leads = await LeadRepository.findAll({
    attributes: ['companyName', [literal('COUNT("companyName")'), 'dupCount']],
    where: {
      lead: {
        [Op.ne]: '',
      },
      [Op.or]: [
        { status: 'Pitched-LL' },
        { status: 'Positive-Response' },
        { status: 'Negative-Response' },
        { status: 'Neutral-Response' },
        { status: 'Call-Booked' },
      ],
    },
    group: ['"companyName"'],
    raw: true, // this is important to filter the list of leads
  });

  // Filter companies with more than occurrencies
  const filteredLeads = leads.filter((lead) => {
    const { dupCount } = lead;
    return dupCount > 1; // get all with duplicates only
  });

  filteredLeads.map(async (lead) => {
    // Get the duplicates per company / lead
    const dups = await LeadRepository.findAll({
      attributes: ['leadId', 'companyName', 'status'],
      where: {
        companyName: lead.companyName,
      },
      raw: true,
    });

    let counter = 0;
    let toDeleteLeadId = '';

    // checked if all are Pitched-LL or Not
    dups.map((dup) => {
      if (dup.status === 'Pitched-LL') {
        counter++;
        toDeleteLeadId = dup.leadId;
      }
    });

    if (dups.length === counter) {
      // do nothing if all duplicates are Pitched-LL
    } else {
      // Delete Pitched-LL if there are other Lead Status
      console.log(toDeleteLeadId);
      await LeadRepository.delete({ where: { leadId: toDeleteLeadId } });
    }
  });

  return filteredLeads;
};

const getLeadSources = async (options) => {
  const { page, pageSize, pageOffset } = options;

  const { rows, count } = await leadSourceRepository.findAndCountSources(
    options
  );

  return new Response()
    .withData(paginate(rows, count, page, pageOffset, pageSize))
    .withMessage('Leads sources successfully fetched');
};

module.exports = {
  getLeadByCompanyName,
  getLeadByLinkedIn,
  getLead,
  countLeads,
  listLeads,
  createLead,
  addUnprocessedLead,
  updateLead,
  deleteLead,
  listLeadNotesByLead,
  createLeadNote,
  deleteLeadNote,
  listLeadsDuplicate,
  getOverallMetrics,
  getGraphMetrics,
  getGroupMetrics,
  listLeadsVariables,
  createLeadVariable,
  updateLeadVariable,
  listLinkedInAccounts,
  createliAccount,
  updateliAccount,
  checkExistingLead,
  checkBrandExists,
  cleanExistingLeads,
  listLeadConversation,
  createLeadConversation,
  cleanDuplicateLeads,
  getLeadSources,
};
