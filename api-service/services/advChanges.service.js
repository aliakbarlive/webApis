const { currencyFormatter } = require('../utils/formatters');

const observers = {
  campaign: {
    info: (data) => data.name,
    attributes: [
      { attr: 'dailyBudget', formatter: (value) => currencyFormatter(value) },
      { attr: 'budget', formatter: (value) => currencyFormatter(value) },
      { attr: 'state' },
      { attr: 'name' },
    ],
  },
  adGroup: {
    info: (data) => data.name,
    attributes: [
      { attr: 'defaultBid', formatter: (value) => currencyFormatter(value) },
      { attr: 'state' },
      { attr: 'name' },
    ],
  },
  keyword: {
    info: (data) => `${data.keywordText} - ${data.matchType}`,
    attributes: [
      { attr: 'bid', formatter: (value) => currencyFormatter(value) },
      { attr: 'state' },
    ],
  },
  target: {
    info: (data) => data.targetingText,
    attributes: [
      { attr: 'bid', formatter: (value) => currencyFormatter(value) },
      { attr: 'targetingText' },
      { attr: 'state' },
    ],
  },
  negativeKeyword: {
    info: (data) => `${data.keywordText} - ${data.matchType}`,
    attributes: [{ attr: 'state' }],
  },
  campaignNegativeKeyword: {
    info: (data) => `${data.keywordText} - ${data.matchType}`,
    attributes: [{ attr: 'state' }],
  },
  negativeTarget: {
    info: (data) => data.targetingText,
    attributes: [{ attr: 'state' }],
  },
  productAd: {
    info: (data) => {
      if (data.asin && data.sku) return `${data.asin} - ${data.sku}`;
      if (data.asin) return data.asin;
      if (data.sku) return data.sku;
    },
    attributes: [{ attr: 'state' }],
  },
};

const getReadableDifference = (recordType, previousData, newData) => {
  const observer = observers[recordType];
  if (!previousData)
    return `Create new ${recordType}: "${observer.info(newData)}"`;

  const mainInfo = observer.info(previousData);
  let description = '';

  observer.attributes
    .filter(({ attr }) => previousData[attr] != newData[attr])
    .forEach(({ attr, formatter }) => {
      const prevValue = formatter
        ? formatter(previousData[attr])
        : previousData[attr];

      const newVal = formatter ? formatter(newData[attr]) : newData[attr];
      description = description
        ? `${description}, ${attr} from ${prevValue} to ${newVal}`
        : `Update "${mainInfo}" ${recordType} ${attr} from ${prevValue} to ${newVal}`;
    });

  return description;
};

module.exports = { getReadableDifference };
