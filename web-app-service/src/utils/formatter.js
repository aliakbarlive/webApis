import moment from 'moment';

export const stateFormatter = (state) => {
  let color = 'gray';

  switch (state) {
    case 'enabled':
      color = 'green';
      break;
    case 'paused':
      color = 'yellow';
      break;
    case 'archived':
      color = 'red';
      break;
    default:
      color = 'gray';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${color}-100 text-${color}-800`}
    >
      {state}
    </span>
  );
};

export const numberFormatter = (number) =>
  number ? number.toLocaleString() : 0;

export const floatFormatter = (number) => {
  return Math.round(number * 100 + Number.EPSILON) / 100;
};

export const decimalFormatter = (number) => parseFloat(number).toFixed(2);

export const currencyFormatter = (number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(number);
};

export const percentageFormatter = (number) =>
  parseFloat(number).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });

export const dateFormatter = (date, stringFormat = 'DD MMM YYYY') => {
  return moment(date).format(stringFormat);
};

export const strDashToSpace = (string) => {
  return string.replace(/-/g, ' ');
};

export const strUnderscoreToSpace = (string) => {
  return string.replace(/_/g, ' ');
};
