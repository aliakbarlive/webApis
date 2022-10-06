import React from 'react';
import { useTranslation } from 'react-i18next';
import { upperFirst } from 'lodash';

import { COMPARISONS, BETWEEN, LESS_THAN, CPC } from '../../utils/constants';
import Checkbox from 'components/Forms/Checkbox';

const SmartFilterItem = ({ index, filter, canCompareWithCPC, onChange }) => {
  const { t } = useTranslation();

  const onChangeComparison = (e) => {
    const comparison = e.target.value;
    const value = comparison === BETWEEN ? ['', ''] : '';
    onChange(index, { ...filter, comparison, value });
  };

  const onChangeValue = (e) => {
    onChange(index, { ...filter, value: e.target.value });
  };

  const onChangeBetweenValue = (e) => {
    const value = [...filter.value];
    value[e.target.name === 'min' ? 0 : 1] = e.target.value;
    onChange(index, { ...filter, value });
  };

  const onChangeUseCpc = (e) => {
    const { checked } = e.target;
    const comparison =
      filter.comparison === BETWEEN ? LESS_THAN : filter.comparison;
    onChange(index, { ...filter, comparison, value: checked ? CPC : '' });
  };

  const onChangeScopeValue = (e) => {
    const { name, checked } = e.target;
    const value = checked ? name : '';
    onChange(index, { ...filter, value });
  };

  if (filter.attribute === 'scope') {
    return (
      <li className="py-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
          {filter.display}
        </span>
        <div className="col-span-2">
          {filter.options.map((option) => {
            return (
              <div key={option.value}>
                <Checkbox
                  name={option.value}
                  checked={filter.value.includes(option.value)}
                  onChange={onChangeScopeValue}
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.display}
                </span>
              </div>
            );
          })}
        </div>
      </li>
    );
  }

  return filter.options ? (
    <li className="py-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
        {filter.display}
      </span>

      <div className="col-span-2">
        <select
          className="shadow-sm block pl-3 pr-10 py-2 w-full text-xs text-gray-700 border border-gray-300 rounded-md"
          value={filter.value}
          onChange={onChangeValue}
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option, index) => {
            return (
              <option key={index} value={option.value}>
                {option.display}
              </option>
            );
          })}
        </select>
      </div>
    </li>
  ) : (
    <li className="py-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <span className="align-middle text-sm font-medium text-gray-700 sm:col-span-3 md:col-span-1">
        {filter.display}
      </span>

      <div className="col-span-1 md:mr-2">
        <select
          className="shadow-sm block pl-3 pr-10 py-2 w-full text-xs text-gray-700 border border-gray-300 rounded-md"
          value={filter.comparison}
          onChange={onChangeComparison}
        >
          {COMPARISONS.map((comparison) => {
            return (
              <option value={comparison} key={comparison}>
                {t(`Advertising.Filters.Comparison.${upperFirst(comparison)}`)}
              </option>
            );
          })}
        </select>
      </div>

      <div className="col-span-1 flex">
        {filter.comparison === BETWEEN ? (
          <div className="flex">
            <input
              type="number"
              name="min"
              value={filter.value[0]}
              className="shadow-sm block px-2 py-2 w-full text-xs text-gray-700 border border-gray-300 focus:outline-none rounded-l-md"
              onChange={onChangeBetweenValue}
            />
            <input
              type="number"
              name="max"
              value={filter.value[1]}
              className="shadow-sm block px-2 py-2 w-full text-xs text-gray-700 border border-gray-300 focus:outline-none rounded-r-md"
              onChange={onChangeBetweenValue}
            />
          </div>
        ) : (
          <div>
            <input
              type={filter.value === CPC ? 'text' : 'number'}
              value={filter.value}
              disabled={filter.value === CPC}
              className="shadow-sm uppercase block px-2 py-2 w-full text-xs text-gray-700 border border-gray-300 focus:outline-none rounded-md"
              onChange={onChangeValue}
            />
            {canCompareWithCPC && (
              <div>
                <Checkbox
                  checked={filter.value === CPC}
                  onChange={onChangeUseCpc}
                />
                <span className="ml-2 text-xs text-gray-500">
                  {t('Advertising.Filters.SmartFilter.CompareWithCPC')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};
export default SmartFilterItem;
