const moment = require('moment');

const getPreviousDateRange = ({ startDate, endDate }) => {
  const startDateRef = moment(startDate).utc();
  const endDateRef = moment(endDate).utc();
  const diff = moment.duration(endDateRef.diff(startDateRef));

  return {
    startDate: startDateRef
      .subtract(diff.asDays(), 'days')
      .startOf('D')
      .format(),
    endDate: moment(startDate).subtract(1, 'd').utc().endOf('D').format(),
  };
};

const getPreviousDateRangeWithFormat = (
  { startDate, endDate },
  format = 'YYYY-MM-DD'
) => {
  const startDateRef = moment(startDate).utc();
  const endDateRef = moment(endDate).utc();
  const diff = moment.duration(endDateRef.diff(startDateRef));

  return {
    startDate: startDateRef
      .subtract(diff.asDays(), 'days')
      .startOf('D')
      .format(format),
    endDate: moment(startDate).subtract(1, 'd').utc().endOf('D').format(format),
  };
};

const getPreviousMonthDateRange = ({ startDate }, format = 'YYYY-MM-DD') => {
  const startDateRef = moment(startDate).utc();

  return {
    startDate: startDateRef.subtract(1, 'month').startOf('M').format(format),
    endDate: moment(startDate)
      .subtract(1, 'month')
      .utc()
      .endOf('M')
      .format(format),
  };
};

const getWeeksBetweenDateRange = (startDate) => {
  let dateRanges = [];

  for (let index = 0; index < 4; index++) {
    dateRanges.push({
      startDate: moment(startDate)
        .utc()
        .startOf('M')
        .add(index * 7, 'days')
        .format('YYYY-MM-DD'),
      endDate: moment(startDate)
        .utc()
        .startOf('M')
        .add((index + 1) * 7 - 1, 'days')
        .format('YYYY-MM-DD'),
    });
  }

  return dateRanges;
};

const getDateRangeSummary = ({ startDate, endDate }) => {
  if (startDate === endDate) {
    return [{ startDate, endDate }];
  }

  let ranges = [];

  const dayDifference = moment(endDate).diff(moment(startDate), 'days');
  const weekDifference = moment(endDate).diff(moment(startDate), 'weeks', true);

  if (dayDifference <= 14) {
    let ref = moment(startDate);

    while (ref.isSameOrBefore(moment(endDate).format('YYYY-MM-DD'))) {
      ranges.push({
        startDate: ref.format('YYYY-MM-DD'),
        endDate: ref.format('YYYY-MM-DD'),
      });

      ref.add(1, 'd');
    }

    return ranges;
  }

  if (weekDifference <= 8) {
    let ref = moment(startDate);

    while (ref.isBefore(moment(endDate).format('YYYY-MM-DD'))) {
      const startDateRef = ref.format('YYYY-MM-DD');
      const endDateRef = ref.add(6, 'd');

      ranges.push({
        startDate: startDateRef,
        endDate: endDateRef.isAfter(moment(endDate))
          ? endDate
          : endDateRef.format('YYYY-MM-DD'),
      });

      ref.add(1, 'd');
    }

    return ranges;
  }

  let ref = moment(startDate);

  while (ref.isBefore(moment(endDate).format('YYYY-MM-DD'))) {
    const startDateRef = ref.format('YYYY-MM-DD');
    const endDateRef = ref.add(1, 'month').subtract(1, 'day');

    ranges.push({
      startDate: startDateRef,
      endDate: endDateRef.isAfter(moment(endDate))
        ? endDate
        : endDateRef.format('YYYY-MM-DD'),
    });

    ref.add(1, 'd');
  }

  return ranges;
};

module.exports = {
  getDateRangeSummary,
  getPreviousDateRange,
  getPreviousDateRangeWithFormat,
  getPreviousMonthDateRange,
  getWeeksBetweenDateRange,
};
