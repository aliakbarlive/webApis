const moment = require('moment-timezone');

const currencyFormatter = (number, currency_code = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_code,
  });

  return formatter.format(number);
};

const dateFormatterUTC = (date, stringFormat = 'DD MMM YYYY') => {
  return moment.utc(date).format(stringFormat);
};

const dateFormatter = (date, stringFormat = 'DD MMM YYYY') => {
  moment.tz.setDefault('America/Toronto');

  return moment(date).format(stringFormat);
};

module.exports = { currencyFormatter, dateFormatterUTC, dateFormatter };
