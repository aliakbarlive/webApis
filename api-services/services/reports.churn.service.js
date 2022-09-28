const dotenv = require('dotenv');
const { Subscription, Termination } = require('@models');
const { Op, fn, col } = require('sequelize');
const moment = require('moment');

dotenv.config({ path: 'config/config.env' });
moment.tz.setDefault('America/Toronto');

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const quarters = ['Jan:Mar', 'Apr:Jun', 'Jul:Sep', 'Oct:DEc'];

/**
 * Get all invoices with commission errors that aren't notified yet
 * @param string range = monthly | quarterly
 *
 * @returns {object} invoice errors including account + agencyclient
 */
const getChurnReport = async () => {
  const currentMonth = moment.utc().startOf('month').format('M');
  const currentYear = moment.utc().startOf('year').format('YYYY');

  const getMonths = months.filter((r, i) => i < parseInt(currentMonth));

  let out = await Promise.all(
    getMonths.map(async (month) => {
      const startOfMonth = moment(
        `${currentYear} ${month} 01`,
        'YYYY MMM DD'
      ).startOf('month');

      const endOfMonth = moment(startOfMonth).endOf('month');

      const active = await Subscription.count({
        where: {
          activatedAt: {
            [Op.lt]: startOfMonth,
          },
          status: {
            [Op.not]: 'cancelled',
          },
        },
      });

      const cancelled = await Subscription.count({
        where: {
          cancelledAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
          status: {
            [Op.eq]: 'cancelled',
          },
        },
      });

      const newSubs = await Subscription.count({
        where: {
          activatedAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalActiveEnd = parseInt(active) + parseInt(newSubs);

      const churnRate = ((parseInt(cancelled) / totalActiveEnd) * 100).toFixed(
        2
      );

      return {
        month: moment(endOfMonth).format('MMMM'),
        data: {
          active,
          new: newSubs,
          cancelled,
          churnRate,
          totalActiveEnd,
          activePercentage: 0,
        },
      };
    })
  );

  out.forEach((d, i) => {
    if (i > 0) {
      prevIdx = i - 1;
      out[prevIdx].data.activePercentage = parseFloat(
        ((d.data.totalActiveEnd - out[prevIdx].data.totalActiveEnd) /
          out[prevIdx].data.totalActiveEnd) *
          100
      ).toFixed(2);
    }
  });

  return {
    range: `${getMonths[0]} - ${
      getMonths[getMonths.length - 1]
    } ${currentYear}`,
    currentMonth,
    currentYear,
    getMonths,
    out,
  };
};

const getChurnReportQuarterly = async () => {
  const currentQuarter = moment.utc().quarter();
  const currentYear = moment.utc().startOf('year').format('YYYY');

  const getQuarters = quarters.filter((r, i) => i < currentQuarter);

  let out = await Promise.all(
    getQuarters.map(async (q) => {
      const month = q.split(':');

      const startOfMonth = moment(
        `${currentYear} ${month[0]} 01`,
        'YYYY MMM DD'
      ).startOf('month');

      const endOfMonth = moment(
        `${currentYear} ${month[1]} 01`,
        'YYYY MMM DD'
      ).endOf('month');

      console.log(startOfMonth, endOfMonth);

      const active = await Subscription.count({
        where: {
          activatedAt: {
            [Op.lt]: startOfMonth,
          },
          status: {
            [Op.not]: 'cancelled',
          },
        },
      });

      const cancelled = await Subscription.count({
        where: {
          cancelledAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
          status: {
            [Op.eq]: 'cancelled',
          },
        },
      });

      const newSubs = await Subscription.count({
        where: {
          activatedAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
      });

      const totalActiveEnd = parseInt(active) + parseInt(newSubs);

      const churnRate = ((parseInt(cancelled) / totalActiveEnd) * 100).toFixed(
        2
      );

      return {
        month: `${month[0]} - ${month[1]}`,
        data: {
          active,
          new: newSubs,
          cancelled,
          churnRate,
          totalActiveEnd,
          activePercentage: 0,
        },
      };
    })
  );

  out.forEach((d, i) => {
    if (i > 0) {
      prevIdx = i - 1;
      out[prevIdx].data.activePercentage = parseFloat(
        ((d.data.totalActiveEnd - out[prevIdx].data.totalActiveEnd) /
          out[prevIdx].data.totalActiveEnd) *
          100
      ).toFixed(2);
    }
  });

  return {
    range: `Quarterly ${currentYear}`,
    currentQuarter,
    currentYear,
    getQuarters,
    out,
  };
};

const getActiveSubscriptions = async (range) => {
  return await Subscription.findAll({
    where: {
      activatedAt: {
        [Op.between]: range,
      },
      status: {
        [Op.not]: 'cancelled',
      },
    },
  });

  //   return await Subscription.findAll({
  //     where: {
  //       status: {
  //         [Op.or]: ['live', 'non_renewing'],
  //       },
  //     },
  //     attributes: [
  //       [fn('date_trunc', 'month', col('activatedAt')), 'month'],
  //       [fn('count', '*'), 'count'],
  //     ],
  //     group: 'month',
  //   });
  //   return await Subscription.count({
  //     where: {
  //       status: {
  //         [Op.or]: ['live', 'non_renewing'],
  //       },
  //     },
  //   });
};

const getChurnedSubscriptions = async (range) => {
  return await Subscription.findAll({
    where: {
      cancelledAt: {
        [Op.between]: range,
      },
      status: {
        [Op.eq]: 'cancelled',
      },
    },
  });
};

module.exports = {
  getChurnReport,
  getChurnReportQuarterly,
  getActiveSubscriptions,
  getChurnedSubscriptions,
};
