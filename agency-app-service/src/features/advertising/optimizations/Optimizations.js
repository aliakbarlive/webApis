import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { InformationCircleIcon } from '@heroicons/react/outline';

import { setItemList, setReport } from './optimizationSlice';
import { getRulesAsync, selectRules } from '../advertisingSlice';
import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import MultipleFilter from 'components/Forms/MultipleFilter';
import ColumnPicker from '../components/common/ColumnPicker';
import Select from 'components/Forms/Select';

import OptimizationReportItemOptions from './components/OptimizationReportItemOptions';
import OptimizationReportItems from './components/OptimizationReportItems';
import GenerateReportButton from './components/GenerateReportButton';
import PreviousOptimization from './components/PreviousOptimization';
import ProceedButton from './components/ProceedButton';

import { listBaseColumns, metricColumns } from '../utils/columns';
import { CAMPAIGNS, KEYWORDS, SEARCH_TERMS } from '../utils/constants';

const Optimizations = ({
  accountId,
  marketplace,
  campaignType,
  customAttributes,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const rules = useSelector(selectRules);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [recordType, setRecordType] = useState(SEARCH_TERMS);
  const [selectedId, setSelectedId] = useState('');
  const [showPrevOptimization, setShowPrevOptimization] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState(
    localStorage.getItem('optimizations-list-column') ??
      'advCampaignId,values.name,values.keywordText,values.bid,values.query,values.source,advSearchTermId,cost,sales,orders'
  );

  const [selectedRules, setSelectedRules] = useState({ rules: [] });

  const columns = [
    {
      dataField: 'advOptimizationReportItemId',
      text: '',
      classes: 'pl-2 pr-1 text-sm text-gray-500',
      headerClasses: 'text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell) => {
        const viewPreviousOptimization = () => {
          setSelectedId(cell);
          setShowPrevOptimization(true);
        };
        return (
          <InformationCircleIcon
            className="h-5 w-5 cursor-pointer"
            onClick={viewPreviousOptimization}
          />
        );
      },
    },
    ...listBaseColumns(accountId, marketplace, campaignType, recordType, t),
    ...metricColumns(customAttributes, t),
    {
      dataField: 'options',
      auto: true,
      default: true,
      text: 'Options',
      headerStyle: { minWidth: '300px' },
      classes: 'px-6 py-4 text-sm text-gray-500',
      headerClasses:
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
      formatter: (cell, row) => (
        <OptimizationReportItemOptions
          accountId={accountId}
          marketplace={marketplace}
          options={cell}
          item={row}
        />
      ),
    },
  ];

  const onChangeRecordType = (e) => {
    dispatch(setReport(null));
    dispatch(setItemList({ rows: [] }));
    setRecordType(e.target.value);
  };

  useEffect(() => {
    dispatch(setReport(null));
    dispatch(setItemList({ rows: [] }));

    return function cleanUp() {
      dispatch(setReport(null));
      dispatch(setItemList({ rows: [] }));
    };
  }, [dispatch]);

  useEffect(() => {
    setSelectedRules({ rules: [] });
    dispatch(setReport(null));
    dispatch(setItemList({ rows: [] }));

    dispatch(
      getRulesAsync({
        recordType,
        campaignType,
        accountId,
        marketplace,
        pageSize: 1000,
      })
    );
  }, [dispatch, recordType, campaignType, accountId, marketplace]);

  useEffect(() => {
    dispatch(setReport(null));
    dispatch(setItemList({ rows: [] }));
  }, [dispatch, selectedRules, selectedDates]);

  const onChangeVisibleColumns = (newColumns) => {
    localStorage.setItem('optimizations-list-column', newColumns);
    setVisibleColumns(newColumns);
  };

  return (
    <div className="my-4">
      <PreviousOptimization
        accountId={accountId}
        marketplace={marketplace}
        campaignType={campaignType}
        open={showPrevOptimization}
        setOpen={setShowPrevOptimization}
        recordType={recordType}
        optimizableId={selectedId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        <Select value={recordType} onChange={onChangeRecordType}>
          <option value={CAMPAIGNS}>Campaigns</option>
          <option value={KEYWORDS}>Keywords</option>
          <option value={SEARCH_TERMS}>Search Terms</option>
        </Select>

        <MultipleFilter
          selected={selectedRules}
          setSelected={(filters) => setSelectedRules(filters)}
          showLabel={false}
          menuClass="overflow-y-scroll max-h-64 break-all overflow-x-hidden"
          noSelectedPreview={t('Advertising.Optimization.NoSelected')}
          hasSelectedPreview={t('Advertising.Optimization.HasSelected')}
          options={{
            rules:
              'rows' in rules
                ? rules.rows.map((rule) => {
                    return { value: rule.advRuleId, display: rule.name };
                  })
                : [],
          }}
        />

        <ColumnPicker
          options={columns
            .map((col) => {
              return {
                key: col.dataField,
                hideable: !!col.hideable,
                display: col.display ?? col.text,
                category: col.category,
                default: !!col.default,
              };
            })
            .filter(
              (col) =>
                col.key !== 'advOptimizationReportItemId' &&
                col.key !== 'options'
            )}
          values={visibleColumns}
          onChange={onChangeVisibleColumns}
        />

        <GenerateReportButton
          accountId={accountId}
          marketplace={marketplace}
          campaignType={campaignType}
          recordType={recordType}
          ruleIds={selectedRules.rules}
        />

        <ProceedButton accountId={accountId} marketplace={marketplace} />
      </div>

      <OptimizationReportItems
        accountId={accountId}
        marketplace={marketplace}
        columns={columns.filter(
          (col) => visibleColumns.includes(col.dataField) || col.default
        )}
      />
    </div>
  );
};

export default Optimizations;
