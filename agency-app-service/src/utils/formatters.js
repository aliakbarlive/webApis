import moment from 'moment-timezone';

import usFlag from 'assets/flags/us.png';
import mxFlag from 'assets/flags/mx.png';
import caFlag from 'assets/flags/ca.png';
import brFlag from 'assets/flags/br.png';

export const percentageFormatter = (number) =>
  parseFloat(number).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });

export const floatFormatter = (number) => parseFloat(number).toFixed(2);

export const numberFormatter = (number) =>
  number ? number.toLocaleString() : 0;

export const currencyFormatter = (number, currency_code = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_code,
  });

  return formatter.format(number);
};

export const strDashToSpace = (string) => {
  return string.replace(/-/g, ' ');
};

export const strUnderscoreToSpace = (string) => {
  return string.replace(/_/g, ' ');
};

export const dateFormatterUTC = (date, stringFormat = 'DD MMM YYYY') => {
  return moment.utc(date).format(stringFormat);
};

export const ago = (date) => {
  return moment(date).fromNow();
};

export const agoUTC = (date) => {
  return moment.utc(date).fromNow();
};

export const dateFormatter = (date, stringFormat = 'DD MMM YYYY') => {
  moment.tz.setDefault('America/Toronto');

  return moment(date).format(stringFormat);
};

export const countryCodeToFlag = (countryCode) => {
  switch (countryCode) {
    case 'US':
      return usFlag;
    case 'CA':
      return caFlag;
    case 'MX':
      return mxFlag;
    case 'BR':
      return brFlag;
    default:
      break;
  }
};

export const decimalFormatter = (number) => parseFloat(number).toFixed(2);

export const joiAlertErrorsStringify = (error) => {
  return error && error.response.data.errors
    ? Object.keys(error.response.data.errors)
        .map((key) => {
          return `- ${error.response.data.errors[key]}`;
        })
        .join('\n')
    : '';
};

export const nameFormatter = (user) => {
  return user
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : '';
};
