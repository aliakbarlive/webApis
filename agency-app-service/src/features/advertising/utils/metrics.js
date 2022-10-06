import { METRICS } from './constants';

export const getMetrics = ({ sales, orders }) => {
  return METRICS.map((metric) => {
    if (metric.attribute === 'sales') metric.attribute = sales;
    if (metric.attribute === 'orders') metric.attribute = orders;
    return metric;
  });
};
