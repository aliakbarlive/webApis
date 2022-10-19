import moment from 'moment';
import React from 'react';
import { Badge } from 'reactstrap';
import { MessageCircle } from 'react-feather';

export const percentageFormatter = (number) =>
  parseFloat(number).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 2,
  });

export const floatFormatter = (number) => parseFloat(number).toFixed(2);

export const numberFormatter = (number) => number.toLocaleString();

export const currencyFormatter = (number, currency_code = 'USD') => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency_code,
  });

  return formatter.format(number);
};

export const noteFormatter = (notes) => {
  return notes.length > 0 ? (
    <div>
      {/*create dialog for notes*/}
      <MessageCircle size={20} className="ml-3 align-middle" color="grey" />(
      {notes.length})
    </div>
  ) : (
    ''
  );
};

export const cpcFormatter = (cell, row) => {
  const { cost, clicks } = row;

  const cpc = cost / clicks;
  return cpc.toFixed(2);
};

export const acosFormatter = (cell, row) => {
  const { cost, attributedSales30d } = row;

  const acos = cost / attributedSales30d;

  if (attributedSales30d > 0) {
    return percentageFormatter(acos);
  } else {
    return 0;
  }
};

export const stateFormatter = (cell) => {
  let className;
  if (cell == 'enabled') {
    className = 'badge-soft-success';
  } else if (cell == 'archived') {
    className = 'badge-soft-warning';
  } else if (cell == 'paused') {
    className = 'badge-soft-secondary';
  }

  return <Badge className={className}>{cell}</Badge>;
};

export const dateFormatter = (date, stringFormat = 'DD MMM YYYY') => {
  return moment(date).format(stringFormat);
}
