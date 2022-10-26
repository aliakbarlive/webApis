import { useTranslation } from 'react-i18next';

import ConditionItem from './ConditionItem';
import classNames from 'utils/classNames';
import { ExclamationIcon } from '@heroicons/react/outline';

const ConditionsPicker = ({
  filters,
  recordType,
  updateFilterItem,
  errors,
}) => {
  const { t } = useTranslation();

  const onSelectFilterItem = (filter, index) => {
    if (filter.selected) return;
    updateFilterItem({ ...filter, selected: true }, index);
  };

  const onRemoveFilterItem = (filter, index) => {
    if (!filter.selected) return;
    updateFilterItem({ ...filter, selected: false }, index);
  };

  const onChangeFilterItem = (filter, index) => {
    updateFilterItem(filter, index);
  };

  return (
    <div className="mt-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {t('Advertising.Rule.Conditions')}
        </label>
        {errors.filters && (
          <p className="text-xs text-red-600">{errors.filters}</p>
        )}
      </div>

      {filters
        .map((filter, idx) => {
          return { ...filter, idx };
        })
        .filter((filter) => filter.selected)
        .filter((filter) => {
          return filter.recordTypes
            ? filter.recordTypes.includes(recordType)
            : true;
        }).length ? (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-2 border-gray-300 border-dashed rounded-lg p-4 bg-white">
          {filters
            .map((filter, idx) => {
              return { ...filter, idx };
            })
            .filter((filter) => filter.selected)
            .filter((filter) => {
              return filter.recordTypes
                ? filter.recordTypes.includes(recordType)
                : true;
            })
            .map((filter, id) => {
              const hasError = !!Object.keys(errors).filter((key) =>
                key.includes(`filters.${id}`)
              ).length;
              return (
                <ConditionItem
                  id={id}
                  hasError={hasError}
                  filter={filter}
                  index={filter.idx}
                  onRemove={onRemoveFilterItem}
                  onChange={onChangeFilterItem}
                  key={`${filter.attribute}-${filter.idx}`}
                />
              );
            })}
        </div>
      ) : (
        <div className="mb-6 border-2 border-gray-300 border-dashed rounded-lg p-4 bg-white flex justify-center">
          <div className="flex flex-col items-center">
            <ExclamationIcon className="text-red-400 w-8 h-8" />

            <p className="mt-1 text-sm text-gray-500">
              You haven’t added any conditions to your rule yet.
            </p>
          </div>
        </div>
      )}

      <div className="border-2 border-gray-300 border-dashed rounded-lg p-4 bg-white">
        {filters
          .map((filter, idx) => {
            return { ...filter, idx };
          })
          .filter((filter) => {
            return filter.recordTypes
              ? filter.recordTypes.includes(recordType)
              : true;
          })
          .map((filter) => {
            return (
              <button
                key={`${filter.attribute}-${filter.idx}`}
                className={classNames(
                  filter.selected
                    ? 'text-white bg-red-600 hover:bg-red-700 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-red-600 hover:text-white',
                  'text-xs mb-2 font-medium border border-gray-300 px-3 py-2 shadow rounded mr-2 '
                )}
                onClick={() => onSelectFilterItem(filter, filter.idx)}
              >
                {t(filter.translationKey)}
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default ConditionsPicker;
