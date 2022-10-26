import { keys } from 'lodash';

import {
  LIST_BASE_PARAMS,
  LIST_DEFAULT_SORT,
  CUSTOM_ATTRIBUTES,
} from '../utils/constants';

import SmartFilters from './filters/SmartFilters';
import SearchBar from './filters/SearchBar';
import FilterByName from './filters/FilterByName';
import ExportButton from './ExportButton';
import Table from 'components/Table';
import ColumnPicker from './common/ColumnPicker';

const AdvertisingTable = ({
  list,
  params,
  columns,
  keyField,
  accountId,
  marketplace,
  recordType,
  campaignType,
  onChangeParams,
  additionalFilters,
  searchPlaceholder,
  searchClassName,
  filterCampaignClassName,
  filterAdGroupClassName,
  filterCampaignPlaceholder,
  filterAdGroupPlaceholder,
  filtersClassName,
  exportClassName,
  attributesKey,
  campaignOptions,
  adGroupOptions,
  visibleColumns,
  onChangeVisibleColumns,
  children,
  ...rest
}) => {
  console.log(visibleColumns);
  const customAttributes = CUSTOM_ATTRIBUTES[campaignType];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    if (type === 'sort' && params.sort === `${sortField}:${sortOrder}`) return;

    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }

    onChangeParams(newParams);
  };

  const onApplySmartFilters = (filters) => {
    const newParams = { ...params, page: 1 };

    keys(newParams)
      .filter((key) => !LIST_BASE_PARAMS.includes(key))
      .forEach((key) => delete newParams[key]);

    onChangeParams({ ...newParams, ...filters });
  };

  return (
    <div className="my-4">
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <SearchBar
          params={params}
          className={searchClassName}
          onApplyFilter={onChangeParams}
          placeholder={searchPlaceholder}
        />

        {filterCampaignClassName && (
          <FilterByName
            params={params}
            className={filterCampaignClassName}
            onApplyFilter={onChangeParams}
            placeholder={filterCampaignPlaceholder}
            options={campaignOptions}
            name="advCampaignId"
          />
        )}

        {filterAdGroupClassName && (
          <FilterByName
            params={params}
            className={filterAdGroupClassName}
            onApplyFilter={onChangeParams}
            placeholder={filterAdGroupPlaceholder}
            options={adGroupOptions}
            name="advAdGroupId"
          />
        )}

        <SmartFilters
          accountId={accountId}
          recordType={recordType}
          campaignType={campaignType}
          className={filtersClassName}
          customAttributes={customAttributes}
          additionalFilters={additionalFilters}
          onApplyFilters={onApplySmartFilters}
        />

        {children}

        <div className={`flex ${exportClassName}`}>
          <ColumnPicker
            className="mr-2"
            options={columns.map((col) => {
              return {
                key: col.dataField,
                hideable: !!col.hideable,
                display: col.display ?? col.text,
                category: col.category,
                default: !!col.default,
              };
            })}
            values={visibleColumns}
            onChange={onChangeVisibleColumns}
          />

          <ExportButton
            params={params}
            accountId={accountId}
            marketplace={marketplace}
            recordType={recordType}
          />
        </div>
      </div>

      <Table
        keyField={keyField}
        columns={columns.filter((col) =>
          visibleColumns.includes(col.dataField)
        )}
        data={list}
        onTableChange={onTableChange}
        params={params}
        defaultSorted={LIST_DEFAULT_SORT}
        {...rest}
      />
    </div>
  );
};

export default AdvertisingTable;
