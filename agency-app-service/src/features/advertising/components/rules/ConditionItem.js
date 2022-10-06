import { BETWEEN, COMPARISONS } from 'features/advertising/utils/constants';
import { upperFirst } from 'lodash';
import { useTranslation } from 'react-i18next';

import { XIcon } from '@heroicons/react/outline';

const ConditionItem = ({ index, filter, hasError, onRemove, onChange }) => {
  const { t } = useTranslation();

  const onChangeComparison = (e) => {
    const comparison = e.target.value;
    const value = comparison === BETWEEN ? ['', ''] : filter.value;
    onChange({ ...filter, comparison, value }, index);
  };

  const onChangeValue = (e) => {
    let newValue = e.target.value === '' ? '' : parseFloat(e.target.value);
    onChange({ ...filter, value: newValue }, index);
  };

  const onChangeBetweenValue = (e) => {
    const value = [...filter.value];
    let newValue = e.target.value === '' ? '' : parseFloat(e.target.value);
    value[e.target.name === 'min' ? 0 : 1] = newValue;
    onChange({ ...filter, value }, index);
  };

  return (
    <div className="border p-2 rounded-md shadow bg-gray-50 relative">
      <div
        className="flex items-center justify-center h-6 w-6 absolute text-white rounded-full border-2 border-white -right-2 -top-2 bg-red-500 hover:bg-red-700"
        onClick={() => onRemove(filter, index)}
      >
        <XIcon className="h-4 w-4 cursor-pointer" />
      </div>

      <span className="text-gray-700 sm:text-sm font-medium">
        {t(filter.translationKey)}
      </span>

      <div className="mt-1 flex rounded-md shadow-sm">
        <select
          value={filter.comparison}
          onChange={onChangeComparison}
          className={`w-${
            filter.comparison === BETWEEN ? 24 : 44
          } pl-1 pr-6 py-2 rounded-none rounded-l-md text-xs border-gray-300 text-gray-700 focus:outline-none focus:ring-0 focus:border-gray-300`}
        >
          {COMPARISONS.filter((comparison) =>
            filter.comparisons ? filter.comparisons.includes(comparison) : true
          ).map((comparison) => {
            return (
              <option
                key={`${filter.attribute}-${comparison}-${index}`}
                value={comparison}
              >
                {t(`Advertising.Filters.Comparison.${upperFirst(comparison)}`)}
              </option>
            );
          })}
        </select>

        {filter.comparison === BETWEEN ? (
          <div className="flex w-full">
            <input
              type="number"
              name="min"
              value={filter.value[0]}
              onChange={onChangeBetweenValue}
              className="w-full px-2 py-2 text-xs text-gray-700 border-l-0 border-r-0 border-gray-300 rounded-none focus:outline-none focus:ring-0 focus:border-gray-300"
            />
            <input
              type="number"
              name="max"
              value={filter.value[1]}
              onChange={onChangeBetweenValue}
              className="w-full px-2 py-2 text-xs text-gray-700 border border-gray-300 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300"
            />
          </div>
        ) : (
          <input
            type={
              filter.value === 'cpc' || filter.attribute === 'servingStatus'
                ? 'text'
                : 'number'
            }
            value={filter.value}
            disabled={
              filter.value === 'cpc' || filter.attribute === 'servingStatus'
            }
            onChange={onChangeValue}
            className="w-full px-1 py-2 text-xs text-gray-700 border border-gray-300 border-l-0 rounded-none rounded-r-md focus:outline-none focus:ring-0 focus:border-gray-300"
          />
        )}
      </div>
      {hasError && (
        <p className="text-xs text-red-600">
          {t('Advertising.Rule.Conditions.Invalid')}
        </p>
      )}
    </div>
  );
};

export default ConditionItem;
