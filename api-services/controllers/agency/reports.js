const moment = require('moment');
const { Parser } = require('json2csv');
const { literal, Op, col } = require('sequelize');
const {
  Account,
  Invoice,
  InvoiceItem,
  AgencyClient,
  Subscription,
} = require('../../models');

const asyncHandler = require('../../middleware/async');
const { paginate } = require('../../services/pagination.service');
const {
  getMonthlyRevenueBreakdown,
  clientSummaryOptions,
} = require('../../services/reports.service');
const { omit } = require('lodash');

/**
 * Get Monthly sales by client query.
 *
 * @param {string} startDate
 * @param {string} endDate
 * @returns {object}
 */
const monthlySalesByClientQuery = (startDate, endDate) => {
  let monthlyQuery = [];
  let dateRef = moment(startDate);

  while (dateRef.isSameOrBefore(moment(endDate).endOf('month'))) {
    const dateRange = {
      start: dateRef.clone().format('YYYY-MM-DD'),
      end: dateRef.clone().endOf('month').isSameOrBefore(moment(endDate))
        ? dateRef.clone().endOf('month').format('YYYY-MM-DD')
        : moment(endDate).format('YYYY-MM-DD'),
    };

    monthlyQuery.push([
      literal(
        `CASE 
          WHEN 
            SUM(CASE WHEN "invoices"."invoiceDate" >= '${dateRange.start}' AND "invoices"."invoiceDate" <=  '${dateRange.end}' THEN "invoices"."total" ELSE 0 END) - SUM(CASE WHEN "invoices"."invoiceDate" >= '${dateRange.start}' AND "invoices"."invoiceDate" <=  '${dateRange.end}' THEN "invoices"."balance" ELSE 0 END) 
              IS NULL THEN 0 
            ELSE SUM(CASE WHEN "invoices"."invoiceDate" >= '${dateRange.start}' AND "invoices"."invoiceDate" <=  '${dateRange.end}' THEN "invoices"."total" ELSE 0 END) - SUM(CASE WHEN "invoices"."invoiceDate" >= '${dateRange.start}' AND "invoices"."invoiceDate" <=  '${dateRange.end}' THEN "invoices"."balance" ELSE 0 END) 
          END`
      ),
      moment(dateRange.start).format('MM-YYYY'),
    ]);

    dateRef = dateRef.add(1, 'month').startOf('month');
  }

  return {
    distinct: true,
    subQuery: false,
    group: [
      'account->subscription.subscriptionId',
      'account.accountId',
      'AgencyClient.agencyClientId',
    ],
    attributes: [
      'agencyClientId',
      'client',
      'zohoId',
      'service',
      [
        literal(
          `CASE WHEN SUM("invoices"."total") - SUM("invoices"."balance") IS NULL THEN 0 ELSE SUM("invoices"."total") - SUM("invoices"."balance") END`
        ),
        'totalSales',
      ],
      ...monthlyQuery,
    ],
    include: [
      {
        model: Account,
        as: 'account',
        attributes: [
          'accountId',
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
            'spApiAuthorized',
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
            'advApiAuthorized',
          ],
        ],
        include: [
          {
            model: Subscription,
            as: 'subscription',
            attributes: ['activatedAt', 'status'],
            required: false,
          },
        ],
      },
      {
        model: Invoice,
        as: 'invoices',
        attributes: [],
        required: false,
        where: {
          status: 'paid',
          invoiceDate: {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      },
    ],
  };
};

// @desc     Get clients summary
// @route    GET /api/v1/agency/reports/clients-summary
// @access   Private
exports.getClientsSummary = asyncHandler(async (req, res, next) => {
  const { page, pageOffset, pageSize } = req.query;

  const { rows, count } = await AgencyClient.findAndCountAll(
    clientSummaryOptions(pageSize, pageOffset)
  );

  res.status(200).json({
    success: true,
    data: {
      count,
      page,
      pageSize,
      rows,
    },
  });
});

// @desc     Export clients summary
// @route    GET /api/v1/agency/reports/clients-summary/sales
// @access   Private
exports.exportClientsSummary = asyncHandler(async (req, res, next) => {
  const rows = await AgencyClient.findAll(clientSummaryOptions());

  if (JSON.stringify(req.query) !== '{}') {
    req.query['defaultContact.firstName'] = req.query['firstName'];
    req.query['defaultContact.lastName'] = req.query['lastName'];
    req.query['defaultContact.email'] = req.query['email'];

    delete req.query['firstName'];
    delete req.query['lastName'];
    delete req.query['email'];

    rows.map((item) => {
      Object.keys(item).map((key) => {
        if (key == 'email' || key == 'createdAt') {
          delete item[key];
        }

        if (
          key in req.query &&
          req.query[key] == ('false' || undefined || null)
        ) {
          delete item[key];
        }
      });
    });
  }

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment('clients-summary.csv');
  return res.send(csv);
});

// @desc     Get monthly sales by client.
// @route    GET /api/v1/agency/reports/clients-monthly-sales
// @access   Private
exports.getMontlySalesByClient = asyncHandler(async (req, res, next) => {
  const { page, pageOffset, pageSize, startDate, endDate } = req.query;

  const { rows, count } = await AgencyClient.findAndCountAll({
    limit: pageSize,
    offset: pageOffset,
    ...monthlySalesByClientQuery(startDate, endDate),
  });

  res.status(200).json({
    success: true,
    data: paginate(rows, count.length, page, pageOffset, pageSize),
  });
});

// @desc     Export monthly sales by client.
// @route    GET /api/v1/agency/reports/clients-monthly-sales/export
// @access   Private
exports.exportMontlySalesByClient = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  let clients = await AgencyClient.findAll(
    monthlySalesByClientQuery(startDate, endDate)
  );

  const rows = clients.map((record) => {
    const row = record.toJSON();

    const {
      agencyClientId,
      client,
      zohoId,
      service,
      totalSales,
      account,
      ...rest
    } = row;

    return {
      clientId: agencyClientId,
      client,
      zohoId: zohoId,
      service,
      spApiAuthorized: account && account.spApiAuthorized ? 'Yes' : 'No',
      advApiAuthorized: account && account.advApiAuthorized ? 'Yes' : 'No',
      subscriptionStatus:
        account && account.subscription
          ? account.subscription.status
          : 'Not-subscribed',
      activatedAt:
        account && account.subscription
          ? moment(account.subscription.activatedAt).format('YYYY-MM-DD')
          : 'N/A',
      ...rest,
    };
  });

  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(rows);

  res.header('Content-Type', 'text/csv');
  res.attachment('clients-monthly-sales-report.csv');
  return res.send(csv);
});

// @desc     Get monthly sales breakdown by client.
// @route    GET /api/v1/agency/reports/clients-monthly-sales
// @access   Private
exports.getMontlySalesBreakdownByClient = asyncHandler(
  async (req, res, next) => {
    const { page, pageOffset, pageSize, startDate, endDate } = req.query;

    let { rows, count } = await AgencyClient.findAndCountAll({
      limit: pageSize,
      offset: pageOffset,
      attributes: ['agencyClientId', 'client', 'zohoId'],
      order: [['client', 'ASC']],
      where: {
        status: { [Op.notIn]: ['registered', 'draft', 'invited'] },
      },
    });

    const output = await getMonthlyRevenueBreakdown(rows, startDate, endDate);

    res.status(200).json({
      success: true,
      data: paginate(output, count, page, pageOffset, pageSize),
    });
  }
);

// @desc     Export monthly sales breakdown by client.
// @route    GET /api/v1/agency/reports/clients-monthly-sales/export
// @access   Private
exports.exportMontlySalesBreakdownByClient = asyncHandler(
  async (req, res, next) => {
    const { startDate, endDate, toggleBreakdown } = req.query;

    let clients = await AgencyClient.findAll({
      attributes: ['agencyClientId', 'client', 'zohoId'],
      order: [['client', 'ASC']],
      where: {
        status: { [Op.notIn]: ['registered', 'draft', 'invited'] },
      },
    });

    const output = await getMonthlyRevenueBreakdown(
      clients,
      startDate,
      endDate,
      toggleBreakdown
    );

    const rows = output.map((o) => {
      const {
        row: { agencyClientId, client, zohoId },
        ...rest
      } = o;

      let data = {
        agencyClientId,
        client,
        zohoId,
        ...rest,
      };

      return omit(data, 'breakdown');
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('clients-monthly-sales-report-breakdown.csv');
    return res.send(csv);
  }
);
