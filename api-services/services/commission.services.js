const { Credential, Subscription, Commission, Account } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');
const sp = require('../utils/sellingPartner');
const ErrorResponse = require('../utils/errorResponse');
const uuidValidate = require('../utils/uuidValidate');
const { addInvoiceError } = require('./invoiceError.service');
const { addInvoiceComment } = require('./invoice.service');
const { upperCase } = require('lodash');
const {
  addCommissionComputedValue,
} = require('./commissionComputedValue.service');

const getCommissionsByAccountId = async (accountId) => {
  return await Commission.findAll({ where: { accountId } });
};

/**
 * * Add commission
 * @param {uuid} accountId
 * @param {string} marketplaceId
 * @param {numeric} rate
 * @param {jsonb} rules
 * @param {enum} type ['gross','rolling','benchmark','tiered','managed_asins']
 * @param {integer} monthThreshold
 * @param {integer} preContractAvgBenchmark
 * @param {jsonb} managedAsins
 * @param {boolean} commence
 * @returns {object} commission
 */
const createCommission = async ({
  accountId,
  marketplaceId,
  rate,
  rules,
  type,
  monthThreshold,
  preContractAvgBenchmark,
  managedAsins,
  commence,
}) => {
  const commission = await Commission.create({
    accountId,
    marketplaceId,
    rate,
    rules,
    type,
    monthThreshold,
    preContractAvgBenchmark,
    managedAsins,
    commencedAt: commence ? new Date() : null,
  });

  return commission;
};

/**
 * * Update commission
 * @param {commissionId} commissionId
 * @param {string} marketplaceId
 * @param {numeric} rate
 * @param {jsonb} rules
 * @param {enum} type ['gross','rolling','benchmark','tiered','managed_asins']
 * @param {integer} monthThreshold
 * @param {integer} preContractAvgBenchmark
 * @param {jsonb} managedAsins
 * @param {boolean} commence
 * @returns {object} commission
 */
const updateCommission = async ({
  commissionId,
  marketplaceId,
  rate,
  rules,
  type,
  monthThreshold,
  preContractAvgBenchmark,
  managedAsins,
  commence,
}) => {
  const commission = await Commission.findByPk(commissionId);

  await commission.update({
    type,
    rate,
    rules,
    marketplaceId,
    monthThreshold,
    preContractAvgBenchmark,
    managedAsins,
    commencedAt: commence ? new Date() : null,
  });

  return commission;
};

/**
 * * Update commission where accountId
 * @param {uuid} accountId
 * @param {string} marketplaceId
 * @param {numeric} rate
 * @param {jsonb} rules
 * @param {enum} type ['gross','rolling','benchmark','tiered','managed_asins']
 * @param {integer} monthThreshold
 * @param {integer} preContractAvgBenchmark
 * @param {jsonb} managedAsins
 * @param {boolean} commence
 * @returns {object} commission
 */
const updateCommissionViaAccountId = async ({
  accountId,
  marketplaceId,
  rate,
  rules,
  type,
  monthThreshold,
  preContractAvgBenchmark,
  managedAsins,
  commence,
}) => {
  const commission = await Commission.findOne({
    where: { accountId },
  });

  await commission.update({
    type,
    rate,
    rules,
    marketplaceId,
    monthThreshold,
    preContractAvgBenchmark,
    managedAsins,
    commencedAt: commence ? new Date() : null,
  });

  return commission;
};

/**
 * * Check if account has spApi credentials which is neede to compute for commission
 * @param {uuid} accountId
 * @returns {boolean} can compute
 */
const canComputeCommission = async (accountId) => {
  // * exit if accountId is not UUID
  if (!uuidValidate(accountId)) return false;

  const account = await Account.findByPk(accountId, {
    include: {
      model: Credential,
      as: 'credentials',
      where: { service: 'spApi' },
    },
  });

  return account ? true : false;
};

// @desc     Compute Monthly Commissions for Subscription
// @access   Private
const computeMonthlyCommission = async ({
  accountId,
  invoiceDate,
  invoiceId,
  invoiceNumber,
  isAuto = true,
}) => {
  // * exit if accountId is not UUID
  if (!uuidValidate(accountId)) return;
  // const account = await Account.findByPk(accountId, {
  //   include: {
  //     model: Credential,
  //     as: 'credentials',
  //     where: { service: 'spApi' },
  //   },
  // });

  const account = await Account.findByPk(accountId);
  if (!account) return;

  const credentials = await account.getCredentials({
    where: { service: 'spApi' },
  });

  const prevMonthDate = moment(invoiceDate)
    .clone()
    .subtract(1, 'month')
    .format('YYYY-MM');

  const commissions = isAuto
    ? await account.getCommissions({
        where: { commencedAt: { [Op.not]: null } },
      })
    : await account.getCommissions();

  if (commissions) {
    if (credentials.length > 0) {
      let computed = await Promise.all(
        commissions.map(async (commission) => {
          return await computeCommission(
            commission,
            prevMonthDate,
            accountId,
            invoiceId
          );
        })
      );

      return computed;
    } else {
      if (invoiceId) {
        if (isAuto)
          await addInvoiceError({
            invoiceId,
            invoiceNumber,
            invoiceDate,
            accountId,
            status: 'pending',
            description: 'no SP-API credentials',
          });
      }
    }
  } else {
    if (invoiceId) {
      await addInvoiceComment(
        invoiceId,
        `no ${isAuto ? 'auto-added' : ''} commissions`
      );
    }
  }
};

// @desc     Compute Commission for single comission
// @access   Private
const computeCommission = async (
  commission,
  prevMonthDate,
  accountId,
  invoiceId
) => {
  let data = {};
  const prevMonthSales =
    commission.managedAsins && commission.managedAsins.length > 0
      ? await getMonthlySalesManagedAsins(commission, accountId, prevMonthDate)
      : await getMonthlySales(
          accountId,
          commission.marketplaceId,
          prevMonthDate
        );

  const { amount, currencyCode } = prevMonthSales.totalSales;

  let commissionValue = amount; //for GROSS commission type
  let commissionRate = commission.rate;
  let historicalSalesData = {};

  if (commission.type === 'benchmark') {
    if (commission.managedAsins && commission.managedAsins.length > 0) {
      const { totalAverageSales } = await getBenchmarkAvgManagedAsins(
        commission
      );

      commissionValue = amount - totalAverageSales;
    } else {
      if (commission.preContractAvgBenchmark == 0) {
        const { sales, totalAverageSales } = await getBenchmarkAvg(commission);
        historicalSalesData = {
          interval: sales.interval,
          totalSales: sales.totalSales,
          totalAverageSales,
        };
        await commission.update({
          preContractAvgBenchmark: totalAverageSales,
        });
      }

      commissionValue = amount - commission.preContractAvgBenchmark;
    }
  } else if (commission.type === 'rolling') {
    if (commission.managedAsins && commission.managedAsins.length > 0) {
      const { sales, totalAverageSales } = await getRollingAvgManagedAsins(
        commission,
        prevMonthDate
      );
      historicalSalesData = {
        interval: sales[0].sales.sales.interval,
        totalSales: sales.map((ma) => {
          return {
            asin: ma.asin,
            totalAverageSales: ma.sales.totalAverageSales,
            totalSales: ma.sales.sales.totalSales,
          };
        }),
        totalAverageSales,
      };

      commissionValue = amount - totalAverageSales;
    } else {
      const { sales, totalAverageSales } = await getRollingAvg(
        commission,
        prevMonthDate
      );
      historicalSalesData = {
        interval: sales.interval,
        totalSales: sales.totalSales,
        totalAverageSales,
      };

      commissionValue = amount - totalAverageSales;
    }
  } else if (commission.type === 'tiered') {
    let matchedRule = commission.rules.find(
      (rule) =>
        amount >= parseFloat(rule.min) &&
        (amount <= parseFloat(rule.max) || rule.max === null || rule.max === '')
    );
    commissionRate = matchedRule ? matchedRule.rate : 0;
  } else if (commission.type === 'yearlySalesImprovement') {
    historicalSalesData = await getYearlySalesDifference(
      commission,
      prevMonthDate
    );
    commissionValue = historicalSalesData.totalSalesDifference;
  }

  let computedCommission = (commissionValue * commissionRate) / 100;

  if (invoiceId) {
    await addInvoiceComment(
      invoiceId,
      `BS AUTO COMM - ${upperCase(
        commission.type
      )} @ ${commissionRate}%\n${prevMonthDate} Total Sales ${currencyCode}: ${amount}\nCommission Avg. Total: ${commissionValue.toFixed(
        2
      )}\nComputed Rate: ${computedCommission.toFixed(2)}\n--${
        computedCommission > 0 ? 'ADD' : 'DO NOT ADD'
      }`
    );
  }

  await addCommissionComputedValue({
    commissionId: commission.commissionId,
    total: computedCommission.toFixed(2),
    canAdd: computedCommission > 0 ? 1 : 0,
    computedMonth: prevMonthDate,
    data: {
      prevMonthSales: {
        interval: prevMonthSales.interval,
        totalSales: prevMonthSales.totalSales,
        managedAsinsSales: prevMonthSales?.managedAsinsSales,
      },
      computed: {
        rate: commissionRate,
        currencyCode,
        grossSales: amount,
        averageTotal: commissionValue.toFixed(2),
        rateTotal: computedCommission.toFixed(2),
        historicalSalesData,
      },
    },
  });

  return {
    //data,
    commission,
    prevMonthSales: {
      interval: prevMonthSales.interval,
      totalSales: prevMonthSales.totalSales,
      managedAsinsSales: prevMonthSales?.managedAsinsSales,
    },
    computed: {
      rate: commissionRate,
      currencyCode,
      grossSales: amount,
      averageTotal: commissionValue.toFixed(2),
      rateTotal: computedCommission.toFixed(2),
      historicalSalesData,
    },
  };
};

/**
 * * Get Benchmark (% of improved sales) - Trailing 12 (or X) month average monthly revenue before contract date as benchmark
 * Avg = total sales from last x months before subscription activated_at / x
 * @param {object} commission
 * @param {string=} asin
 * @returns {object} sales, totalAverageSales
 */
const getBenchmarkAvg = async (commission, asin = null) => {
  const { accountId, marketplaceId, monthThreshold } = commission;

  const subscription = await Subscription.findOne({
    where: { accountId },
  });

  const start = moment(subscription.activatedAt)
    .clone()
    .subtract(monthThreshold, 'months')
    .startOf('month')
    .format();
  const end = moment(subscription.activatedAt)
    .clone()
    .subtract(1, 'month')
    .endOf('month')
    .format();

  const response = await getOrderMetrics(
    accountId,
    marketplaceId,
    start,
    end,
    asin
  );

  const { amount } = response.totalSales;
  let totalAverageSales = amount / monthThreshold;

  return {
    sales: response,
    totalAverageSales,
    log: {
      start,
      end,
      at: subscription.activatedAt,
    },
  };
};

/**
 * * Get Rolling (% of improved sales) - Rolling average based on X months
 * Avg = total sales from last x months / X
 * @param {object} commission
 * @param {date} endDate
 * @param {string=} asin
 * @returns {object} sales, totalAverageSales
 */
const getRollingAvg = async (commission, endDate, asin = null) => {
  const { accountId, marketplaceId, monthThreshold } = commission;

  const start = moment(endDate)
    .clone()
    .subtract(monthThreshold, 'months')
    .startOf('month')
    .format();
  const end = moment(endDate)
    .clone()
    .subtract(1, 'month')
    .endOf('month')
    .format();

  const response = await getOrderMetrics(
    accountId,
    marketplaceId,
    start,
    end,
    asin
  );

  const { amount } = response.totalSales;
  let totalAverageSales = amount / monthThreshold;

  return {
    sales: response,
    totalAverageSales,
  };
};

/**
 * * Get Monthly Total Sales Data From SP-API
 * @param {uuid} accountId
 * @param {string} marketplaceId
 * @param {date} endDate
 * @param {string=} asin
 * @returns {object} response
 */
const getMonthlySales = async (
  accountId,
  marketplaceId,
  endDate,
  asin = null
) => {
  const start = moment(endDate).clone().startOf('month').format();
  const end = moment(endDate).clone().endOf('month').format();

  const response = await getOrderMetrics(
    accountId,
    marketplaceId,
    start,
    end,
    asin
  );

  return response;
};

/**
 * * Get Monthly Total Sales Data From SP-API
 * @param {uuid} accountId
 * @param {object} commission
 * @param {string} marketplaceId
 * @param {date} endDate
 * @returns {object} response
 */
const getMonthlySalesManagedAsins = async (commission, accountId, endDate) => {
  const managedAsinsSales = await Promise.all(
    commission.managedAsins.map(async ({ asin }) => {
      let sales = await getMonthlySales(
        accountId,
        commission.marketplaceId,
        endDate,
        asin
      );

      return {
        asin,
        sales,
      };
    })
  );

  let totalManagedAsinsSales = managedAsinsSales.reduce(
    (a, b) => a + (b.sales ? b.sales.totalSales.amount : 0),
    0
  );

  return {
    interval: managedAsinsSales[0].sales?.interval,
    totalSales: {
      amount: totalManagedAsinsSales,
      currencyCode: managedAsinsSales[0].sales?.totalSales.currencyCode,
    },
    managedAsinsSales,
  };
};

/**
 * * Get Benchmark (% of improved sales) - Trailing 12 (or X) month average monthly revenue before contract date as benchmark
 * Avg = total sales from last x months before subscription activated_at / x
 * @param {object} commission
 * @returns {object} sales, totalAverageSales
 */
const getBenchmarkAvgAsin = async (
  accountId,
  marketplaceId,
  start,
  end,
  asin
) => {
  let sales = await getOrderMetrics(accountId, marketplaceId, start, end, asin);

  return {
    asin,
    sales,
  };
};

/**
 * * Get Benchmark (% of improved sales) - Trailing 12 (or X) month average monthly revenue before contract date as benchmark
 * Avg = total sales from last x months before subscription activated_at / x
 * @param {object} commission
 * @returns {object} sales, totalAverageSales
 */
const getBenchmarkAvgManagedAsins = async (commission) => {
  let hasChanges = false;
  let data = await Promise.all(
    commission.managedAsins.map(async (ma) => {
      if (!ma.baseline || (ma.baseline && ma.baseline == 0)) {
        const { sales, totalAverageSales } = await getBenchmarkAvg(
          commission,
          ma.asin
        );
        ma.baseline = totalAverageSales;
        ma.sales = sales;

        hasChanges = true;
      }

      return ma;
    })
  );

  if (hasChanges) {
    await Commission.update(
      { managedAsins: data },
      {
        where: { commissionId: commission.commissionId },
      }
    );
  }

  let totalAverageSales = data.reduce((a, b) => a + b.baseline, 0);

  return {
    sales: data,
    totalAverageSales,
  };
};

/**
 * * Get Rolling (% of improved sales) - Rolling average based on X months
 * Avg = total sales from last x months / X
 * @param {object} commission
 * @param {date} endDate
 * @returns {object} sales, totalAverageSales
 */
const getRollingAvgManagedAsins = async (commission, endDate) => {
  let data = await Promise.all(
    commission.managedAsins.map(async (ma) => {
      const sales = await getRollingAvg(commission, endDate, ma.asin);

      return {
        asin: ma.asin,
        sales,
      };
    })
  );

  let totalAverageSales = data.reduce(
    (a, b) => a + b.sales.totalAverageSales,
    0
  );
  return {
    sales: data,
    totalAverageSales,
  };
};

/**
 * Get yearly sales difference
 *
 * @param {uuid} accountId
 * @param {string} marketplaceId
 * @param {string} endDate
 * @param {string} asin
 * @returns {object}
 */
const getYearlySalesDifference = async (commission, endDate) => {
  let { accountId, marketplaceId, managedAsins } = commission;

  const currentYearStart = moment(endDate).clone().startOf('month').format();
  const currentYearEnd = moment(endDate).clone().endOf('month').format();

  const previousYearStart = moment(currentYearStart)
    .clone()
    .subtract(1, 'y')
    .format();
  const previousYearEnd = moment(currentYearEnd)
    .clone()
    .subtract(1, 'y')
    .format();

  let totalCurrentYearSales = 0;
  let totalPreviousYearSales = 0;
  let totalSalesDifference = 0;

  managedAsins = managedAsins.length ? managedAsins : [{ asin: null }];

  managedAsins = await Promise.all(
    managedAsins.map(async ({ asin }) => {
      const currentYearSalesResponse = await getOrderMetrics(
        accountId,
        marketplaceId,
        currentYearStart,
        currentYearEnd,
        asin
      );

      const previousYearSalesResponse = await getOrderMetrics(
        accountId,
        marketplaceId,
        previousYearStart,
        previousYearEnd,
        asin
      );

      if (
        'totalSales' in currentYearSalesResponse &&
        'totalSales' in previousYearSalesResponse
      ) {
        const currentSales = currentYearSalesResponse.totalSales.amount;
        const prevSales = previousYearSalesResponse.totalSales.amount;

        totalCurrentYearSales += currentSales;
        totalPreviousYearSales += prevSales;

        totalSalesDifference +=
          (totalCurrentYearSales * 100 - totalPreviousYearSales * 100) / 100;

        return asin
          ? {
              asin,
              totalCurrentYearSales: currentSales,
              totalPreviousYearSales: prevSales,
              totalSalesDifference:
                (currentSales * 100 - prevSales * 100) / 100,
            }
          : { asin };
      }
    })
  );

  managedAsins = managedAsins.filter((sales) => sales.asin);

  return {
    totalCurrentYearSales,
    totalPreviousYearSales,
    totalSalesDifference,
    managedAsins,
  };
};

/**
 * * Get Total Sales Data From SP-API depending on set interval
 * @param {uuid} accountId
 * @param {string} marketplaceId
 * @param {date} startDate
 * @param {date} endDate
 * @param {string=} asin
 * @returns {object} response
 */
const getOrderMetrics = async (
  accountId,
  marketplaceIds,
  startDate,
  endDate,
  asin = null
) => {
  const interval = `${startDate}--${endDate}`;
  const granularity = 'Total';
  const granularityTimeZone = 'US/Pacific';

  const account = await Credential.findOne({
    where: {
      service: 'spApi',
      accountId,
    },
  });

  if (account) {
    try {
      const response = await sp('na', account.refreshToken).callAPI({
        endpoint: 'sales',
        operation: 'getOrderMetrics',
        query: {
          marketplaceIds,
          interval,
          granularity,
          granularityTimeZone,
          asin,
        },
      });

      return response[0];
    } catch (err) {
      console.log(accountId, 'invalid credentials');
      return null;
    }
  }

  return null;
};

module.exports = {
  getCommissionsByAccountId,
  createCommission,
  updateCommission,
  updateCommissionViaAccountId,
  canComputeCommission,
  computeMonthlyCommission,
  getBenchmarkAvg,
  getBenchmarkAvgAsin,
  getRollingAvg,
  getMonthlySales,
  getOrderMetrics,
  getYearlySalesDifference,
  getMonthlySalesManagedAsins,
  getBenchmarkAvgManagedAsins,
  getRollingAvgManagedAsins,
};
