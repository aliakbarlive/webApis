import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';

import { LESS_THAN, EQUAL_TO, BETWEEN } from '../../utils/constants';

import { getMetrics } from '../../utils/metrics';

import SmartFilterModal from './SmartFilterModal';
import SmartFilterButton from './SmartFilterButton';

const SmartFilters = ({
  customAttributes,
  onApplyFilters,
  additionalFilters = [],
  className,
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const [filter, setFilter] = useState({
    values: [
      ...additionalFilters,
      ...getMetrics(customAttributes).map((metric) => {
        return {
          ...metric,
          display: t(`Advertising.Metrics.${metric.display}`),
          comparison: LESS_THAN,
          value: '',
        };
      }),
    ],
  });

  const getValidValues = (values) => {
    return values.filter((filter) => {
      return filter.comparison === BETWEEN
        ? filter.value.every((val) => val)
        : filter.value;
    });
  };

  const applyFormattedFilters = () => {
    const formattedFilters = {};

    getValidValues(filter.values).forEach((filterItem) => {
      const { attribute, comparison, value } = filterItem;
      const key =
        comparison === EQUAL_TO
          ? attribute
          : `${attribute}${upperFirst(comparison)}`;

      formattedFilters[key] = value;
    });

    onApplyFilters(formattedFilters);
    setOpen(false);
  };

  const onClearFilters = () => {
    const values = [...filter.values].map((filter) => {
      filter.value = '';
      filter.comparison = LESS_THAN;
      return filter;
    });

    setFilter({ ...filter, values });
    applyFormattedFilters();
  };

  const onChangeFilterItem = (index, filterItem) => {
    let values = [...filter.values];
    values[index] = filterItem;
    setFilter({ ...filter, values });
  };

  return (
    <div className={`filters flex w-full ${className}`}>
      <SmartFilterButton
        display={t('Advertising.Filters.SmartFilter')}
        count={getValidValues(filter.values).length}
        onClick={() => setOpen(!open)}
      />

      <SmartFilterModal
        open={open}
        filter={filter}
        setOpen={setOpen}
        onClearFilters={onClearFilters}
        onApplyFilters={applyFormattedFilters}
        onChangeFilterItem={onChangeFilterItem}
      />
    </div>
  );
};

export default SmartFilters;
