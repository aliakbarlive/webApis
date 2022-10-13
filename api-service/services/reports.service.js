const dotenv = require('dotenv');
const {
  Invoice,
  InvoiceItem,
  Account,
  Subscription,
  User,
} = require('@models');
const { Parser } = require('json2csv');
const { Op, literal, fn, col } = require('sequelize');
const moment = require('moment');

dotenv.config({ path: 'config/config.env' });
moment.tz.setDefault('America/Toronto');

/**
 * Get Month Range e.g [01-2022,02-2022]
 *
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} purpose sql | ''
 * @returns {object}
 */
const getMonthRange = (startDate, endDate, purpose = '') => {
  let dateRef = moment(startDate);
  let monthlyQuery = [];

  while (dateRef.isSameOrBefore(moment(endDate).endOf('month'))) {
    const dateRange = {
      start: dateRef.clone().format('YYYY-MM-DD'),
      end: dateRef.clone().endOf('month').isSameOrBefore(moment(endDate))
        ? dateRef.clone().endOf('month').format('YYYY-MM-DD')
        : moment(endDate).format('YYYY-MM-DD'),
    };

    if (purpose === 'sql') {
      monthlyQuery.push([
        literal(
          `SUM(CASE WHEN "Invoice"."invoiceDate" >= '${dateRange.start}' AND "Invoice"."invoiceDate" <=  '${dateRange.end}' THEN "invoiceItems"."itemTotal" ELSE 0 END)`
        ),
        moment(dateRange.start).format('MM-YYYY'),
      ]);
    } else {
      monthlyQuery.push(moment(dateRange.start).format('MM-YYYY'));
    }

    dateRef = dateRef.add(1, 'month').startOf('month');
  }

  return monthlyQuery;
};

/**
 * Get Monthly sales breakdown by client QUERY.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {object}
 */
const monthlySalesBreakdownByClientQuery = (startDate, endDate, customerId) => {
  return {
    raw: true,
    subQuery: false,
    group: [literal('name'), literal('code')],
    attributes: [
      [literal(`"invoiceItems"."code"`), 'code'],
      [literal(`"invoiceItems"."name"`), 'name'],
      [fn('MAX', col('invoiceNumber')), 'invoiceNumber'],
      ...getMonthRange(startDate, endDate, 'sql'),
    ],
    include: {
      model: InvoiceItem,
      as: 'invoiceItems',
      attributes: [],
    },
    where: {
      status: 'paid',
      invoiceDate: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
      customerId,
    },
  };
};

/**
 * Get Monthly sales breakdown by client.
 *
 * @param {obj} clients list of clients
 * @param {string} startDate
 * @param {string} endDate
 * @param {boolean} showBreakdown
 * @returns {object} list of clients with computed revenue breakdown
 */
const getMonthlyRevenueBreakdown = async (
  clients,
  startDate,
  endDate,
  showBreakdown = false
) => {
  const monthRange = getMonthRange(startDate, endDate);

  return await Promise.all(
    clients.map(async (client) => {
      const data = await Invoice.findAll({
        ...monthlySalesBreakdownByClientQuery(
          startDate,
          endDate,
          client.zohoId
        ),
      });

      let breakdown = [];

      data.forEach((d) => {
        let name = d.name ? d.name.trim().toLowerCase() : '';

        switch (name) {
          case 'monthly retainer':
          case 'agency subscription':
            type = 'mr';
            break;
          case 'walmart management':
            type = 'wm';
            break;
          case 'website content/seo & social media management':
            type = 'wc';
            break;
          case 'ongoing sales commission':
          case 'ongoing sales commissions':
          case 'ongoing sales commission .ca':
          case 'ongoing sales commission .com':
            type = 'com';
            break;
          default:
            type = 'otf';
            break;
        }

        const x = monthRange.map((month) => {
          return {
            code: d.code,
            name: d.name,
            total: d[month],
            type: `${month}-${type}`,
            invoiceNumber: d.invoiceNumber,
          };
        });

        breakdown.push(...x);
      });

      let groupBy = (data, field) =>
        data.reduce(
          (acc, obj) =>
            Object.assign(acc, {
              [obj[field]]: (acc[obj[field]] || []).concat(obj),
            }),
          {}
        );

      let result = groupBy(breakdown, 'type');

      const objKeys = Object.keys(result);
      const computed = [];

      objKeys.forEach((o) => {
        if (showBreakdown == 'true') {
          let d = result[o]
            .map((r) => `${r.invoiceNumber} | (${r.code})${r.name}:${r.total}`)
            .join('\n');
          computed.push([o, d]);
        } else {
          let total = result[o].reduce((a, b) => a + parseFloat(b.total), 0);
          computed.push([o, total]);
        }
      });

      const summary = Object.fromEntries(computed);
      return { row: client, ...summary, breakdown };
    })
  );
};

const clientSummaryOptions = (limit, offset) => {
  return {
    attributes: [
      'agencyClientId',
      'contractSigned',
      'client',
      'service',
      'phone',
      'address',
      'website',
      'amazonPageUrl',
      'contactName',
      'contactName2',
      'primaryEmail',
      'secondaryEmail',
      'thirdEmail',
      [col('defaultContact.email'), 'email'],
      'accountStatus',
      'status',
      [col('account.subscription.status'), 'subscription'],
      [col('account.subscription.activatedAt'), 'activatedAt'],
      'createdAt',
      [col('account.subscription.isOffline'), 'isOffline'],
      [
        literal(
          `(SELECT EXISTS
        (
          SELECT * FROM credentials
            where "credentials"."accountId" = "account"."accountId"
            and service = 'spApi'
        )
      )`
        ),
        'spApi',
      ],
      [
        literal(
          `(SELECT EXISTS
        (
          SELECT * FROM credentials
            where "credentials"."accountId" = "account"."accountId"
            and service = 'advApi'
        )
      )`
        ),
        'advApi',
      ],
      [
        literal(
          `
          (SELECT "marketplaceId" FROM "accountMarketplaces"
            where "accountMarketplaces"."accountId" = "account"."accountId"
            and "isDefault" = true        
          )`
        ),
        'defaultMarketplace',
      ],
    ],
    include: [
      {
        model: Account,
        as: 'account',
        attributes: [],
        include: [
          {
            model: Subscription,
            as: 'subscription',
            attributes: [],
          },
        ],
      },
      {
        model: User,
        as: 'defaultContact',
        attributes: ['firstName', 'lastName', 'email'],
      },
    ],
    distinct: true,
    raw: true,
    order: [['client', 'ASC']],
    ...(limit && { limit }),
    ...(offset && { offset }),
  };
};

module.exports = {
  getMonthRange,
  monthlySalesBreakdownByClientQuery,
  getMonthlyRevenueBreakdown,
  clientSummaryOptions,
};
