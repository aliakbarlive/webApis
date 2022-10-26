import { useDispatch, useSelector } from 'react-redux';

import {
  selectReport,
  selectItemList,
  getReportItemsAsync,
  selectParams,
  setParams,
} from '../optimizationSlice';

import { Table } from 'components';
import Select from 'components/Forms/Select';

import {
  BROAD,
  EXACT,
  PHRASE,
  SEARCH_TERMS,
  DEFAULT_TARGETING,
  PRODUCT_TARGETING,
  KEYWORD_TARGETING,
} from 'features/advertising/utils/constants';
import SearchTermExandableRow from './SearchTermExpandableRow';

const OptimizationReportItems = ({ accountId, marketplace, columns }) => {
  const dispatch = useDispatch();
  const report = useSelector(selectReport);
  const params = useSelector(selectParams);
  const itemList = useSelector(selectItemList);

  const onChangeParams = (newParams) => {
    dispatch(setParams(newParams));

    if (report) {
      dispatch(
        getReportItemsAsync(report.advOptimizationReportId, {
          ...newParams,
          accountId,
          marketplace,
        })
      );
    }
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField.replace('values.', '')}:${sortOrder}`;
    }

    onChangeParams(newParams);
  };

  const onChangeTargetType = (e) => {
    const { value } = e.target;
    let newParams = { ...params, accountId, marketplace };
    delete newParams.target;

    if (value) newParams.target = value;
    if (newParams.target !== KEYWORD_TARGETING) delete newParams.matchType;

    dispatch(setParams(newParams));

    dispatch(getReportItemsAsync(report.advOptimizationReportId, newParams));
  };

  const onChangeMatchType = (e) => {
    const { name, checked } = e.target;
    const oldMatchType = params.matchType ?? [];

    const matchType = checked
      ? [...oldMatchType, name]
      : oldMatchType.filter((mt) => mt !== name);

    let newParams = { ...params, accountId, marketplace };
    delete newParams.matchType;

    if (matchType.length) newParams.matchType = matchType;

    dispatch(setParams(newParams));

    dispatch(getReportItemsAsync(report.advOptimizationReportId, newParams));
  };

  const expandRow = {
    renderer: (row) => (
      <SearchTermExandableRow
        searchTerm={row}
        accountId={accountId}
        marketplace={marketplace}
      />
    ),
    onlyOneExpanding: false,
    showExpandColumn: true,
    expandHeaderColumnRenderer: () => {
      return '';
    },
  };

  return (
    <div>
      {report && report.recordType === SEARCH_TERMS && (
        <div className="flex flex-row align-middle pt-3 pb-2 text-left text-xs font-medium text-gray-500 uppercase">
          <div className="grid place-items-center content-center pr-2">
            <span>filter by:</span>
          </div>
          <div className="pr-3">
            <Select
              attribute="target"
              value={params.target ?? ''}
              onChange={onChangeTargetType}
            >
              <option value={DEFAULT_TARGETING}>All Targeting Type</option>
              <option value={PRODUCT_TARGETING}>Product trageting</option>
              <option value={KEYWORD_TARGETING}>Keyword trageting</option>
            </Select>
          </div>

          {params.target === KEYWORD_TARGETING && (
            <div className="flex flex-row pl-2">
              <div className="grid place-items-center content-center pr-2">
                <span>Match Type:</span>
              </div>

              <ul className="flex flex-row self-center">
                {[BROAD, EXACT, PHRASE].map((name, index) => {
                  return (
                    <li key={index}>
                      <div>
                        <div className="pr-3">
                          <input
                            type="checkbox"
                            id={`custom-checkbox-${index}`}
                            name={name}
                            value={name}
                            checked={
                              params.matchType
                                ? params.matchType.includes(name)
                                : false
                            }
                            onChange={onChangeMatchType}
                          />
                          <label
                            className="align-middle pl-1"
                            htmlFor={`custom-checkbox-${index}`}
                          >
                            {name}
                          </label>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      <Table
        data={itemList}
        params={params}
        columns={columns}
        onTableChange={onTableChange}
        keyField="advOptimizationReportItemId"
        expandRow={
          report && report.recordType === SEARCH_TERMS ? expandRow : {}
        }
      />
    </div>
  );
};

export default OptimizationReportItems;
