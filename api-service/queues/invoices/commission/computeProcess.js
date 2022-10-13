'use strict';
const {
  computeMonthlyCommission,
} = require('../../../services/commission.services');
const zohoSubscription = require('../../../utils/zohoSubscription');
const moment = require('moment');
const {
  getInvoice,
  addInvoiceComment,
} = require('../../../services/invoice.service');
const { Marketplace } = require('../../../models');

const computeProcess = async (job) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { invoiceId, invoiceNumber, invoiceDate } = job.data;
      let { accountId } = job.data;

      if (!accountId) {
        const output = await getInvoice(invoiceId);

        if (output.code !== 0) {
          return reject('fetch invoice fail');
        }
        accountId = output.invoice.reference_id;
      }

      let computeOutput = await computeMonthlyCommission({
        accountId,
        invoiceDate,
        invoiceId,
        invoiceNumber,
      });

      if (!computeOutput) {
        await addInvoiceComment(invoiceId, `no commission account`);
        return resolve({
          success: true,
          message: `no commission  account ${accountId}`,
        });
      }

      // * commission must be greater than 0
      const allowedItems = computeOutput.filter(
        (c) => c.computed.rateTotal > 0
      );

      let invoice_items = await Promise.all(
        allowedItems.map(async (commission) => {
          return await addCommissionLineItem(commission, {
            invoiceId,
            invoice_date: invoiceDate,
            currency_code: 'USD',
          });
        })
      );

      if (invoice_items) {
        //return invoice_items;
        // //add sales commission line item to invoice
        const commissionLineItems = await zohoSubscription.callAPI({
          method: 'POST',
          operation: `invoices/${invoiceId}/lineitems`,
          body: {
            invoice_items,
          },
        });

        await zohoSubscription.callAPI({
          method: 'POST',
          operation: `invoices/${invoiceId}/customfields`,
          body: {
            custom_fields: [{ label: 'commission added', value: true }],
          },
        });

        //await addInvoiceComment(invoiceId, `commission item(s) added`);

        return resolve({
          success: true,
          commissionLineItems,
        });
      } else {
        await addInvoiceComment(
          invoiceId,
          `no commission item(s) added for this invoice`
        );

        return resolve({
          success: true,
          message: 'no commissions for this duration',
        });
      }
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

const addCommissionLineItem = async (data, invoice) => {
  const { invoice_date, currency_code, invoiceId } = invoice;

  let { commission, computed, prevMonthSales } = data;

  const marketplace = await Marketplace.findOne({
    where: { marketplaceId: commission.marketplaceId },
  });

  let site = '';

  switch (marketplace.countryCode) {
    case 'CA':
      site = '.CA';
      break;
    case 'US':
      site = '.COM';
      break;
    default:
      site = marketplace.countryCode;
      break;
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_code,
  });

  const billPrevMonth = moment(invoice_date)
    .clone()
    .subtract(1, 'month')
    .format('MMM');

  let hasBenchmarkAvg =
    commission.type === 'benchmark'
      ? ` \n Baseline: ${formatter.format(commission.preContractAvgBenchmark)} `
      : '';

  let managedAsins = '';

  //console.group();

  if (commission.managedAsins && commission.managedAsins.length > 0) {
    //console.log('compute managed asins');
    managedAsins = prevMonthSales.managedAsinsSales
      .map((ma) => {
        return `${ma.asin}: ${formatter.format(ma.sales.totalSales.amount)}`;
      })
      .join('\n ');

    await addInvoiceComment(invoiceId, `Managed Asins Sales: ${managedAsins}`);

    if (commission.type === 'benchmark') {
      const benchmarks = commission.managedAsins
        .map((ma) => {
          return `${ma.asin}: ${formatter.format(ma.baseline)}`;
        })
        .join('\n ');

      let totalBenchmarkAvg = commission.managedAsins.reduce(
        (a, b) => a + b.baseline,
        0
      );

      hasBenchmarkAvg = ` \n Baseline:\n ${benchmarks} \nTotal Baseline: ${formatter.format(
        totalBenchmarkAvg
      )}\n `;
    }
  } else {
    console.log('no managed asins');
  }

  let x = {
    code: `ongoing-sales-commission${site === '.CA' ? '-ca' : ''}`,
    name: `Ongoing Sales Commission ${site}`,
    description: `${managedAsins}\n ${billPrevMonth.toUpperCase()} Gross Sales: ${formatter.format(
      computed.grossSales
    )}
    ${hasBenchmarkAvg}\n Commissionable: ${formatter.format(
      computed.averageTotal
    )} @ ${computed.rate}%`,
    price: computed.rateTotal,
    quantity: 1,
  };

  console.log(x);
  console.groupEnd();

  return x;
};

module.exports = computeProcess;
