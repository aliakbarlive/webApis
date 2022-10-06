import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  PRODUCT_TARGETING,
  KEYWORD_TARGETING,
  SORT_BY_COST,
  SEARCH_TERMS,
  EQUAL_TO,
} from '../utils/constants';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import {
  getCampaignListAsync,
  setList as setCampaignList,
  selectList as selectCampaignList,
} from '../campaigns/campaignSlice';

import {
  getAdGroupListAsync,
  setList as setAdGroupList,
  selectList as selectAdGroupList,
} from '../adGroups/adGroupSlice';

import AdvertisingTable from '../components/AdvertisingTable';
import { metricColumns } from '../utils/columns';
import KeywordPreview from '../keywords/components/KeywordPreview';
import TargetPreview from '../targets/components/TargetPreview';

const SearchTerms = ({ accountId, marketplace, campaignType }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchTerms, setSearchTerms] = useState({ rows: [] });

  const selectedDates = useSelector(selectCurrentDateRange);
  const campaignOptions = useSelector(selectCampaignList).rows.map((el) => {
    return { value: el.advCampaignId, display: el.name };
  });
  const adGroupOptions = useSelector(selectAdGroupList).rows.map((el) => {
    return { value: el.advAdGroupId, display: el.name };
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState(
    localStorage.getItem('search-terms-list-column') ??
      'advSearchTermId,query,target,state,cost,sales,orders'
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    campaignType,
    search: '',
    attributes:
      'advSearchTermId,advAdGroupId,advCampaignId,query,target,impressions,clicks,ctr,cost,cpc,orders,sales,acos,attributedOrdersNewToBrandPercentage14d,attributedSalesNewToBrand14d,attributedSalesNewToBrandPercentage14d,cpm,cr,profit,roas',
    include: ['previousData', 'campaign', 'adGroup', 'keyword', 'target'],
    sort: SORT_BY_COST,
  });

  useEffect(() => {
    axios
      .get('/advertising/search-terms', {
        params: { ...params, ...selectedDates, accountId, marketplace },
      })
      .then((response) => setSearchTerms(response.data.data));
  }, [accountId, marketplace, selectedDates, params]);

  useEffect(() => {
    return () => {
      dispatch(setCampaignList({ rows: [] }));
      dispatch(setAdGroupList({ rows: [] }));
    };
  }, []);

  useEffect(() => {
    dispatch(
      getCampaignListAsync({
        pageSize: 1000,
        accountId,
        marketplace,
        campaignType,
      })
    );

    dispatch(
      getAdGroupListAsync({
        pageSize: 10000,
        accountId,
        marketplace,
        campaignType,
      })
    );
  }, [dispatch, accountId, campaignType, marketplace]);

  const onUpdateParams = (params) => {
    setParams(params);
  };

  const onChangeVisibleColumns = (newColumns) => {
    localStorage.setItem('search-terms-list-column', newColumns);
    setVisibleColumns(newColumns);
  };

  const columns = [
    ...[
      {
        auto: true,
        default: true,
        category: 'settings',
        dataField: 'query',
        text: t('Advertising.SearchTerm.Query'),
        sort: true,
        headerStyle: { minWidth: '200px' },
        classes: 'px-6 pl-0 py-4 text-sm text-gray-500',
        headerClasses:
          'px-6 pl-0 py-3 text-left text-xs font-medium text-gray-500 uppercase',
        formatter: (cell) => {
          const isAsin = /^(B\d{2}[A-Z\d]{7}|\d{9}[X\d])$/.test(
            cell.toUpperCase()
          );
          return isAsin ? (
            <a
              className="hover:text-red-500"
              href={`https://www.amazon.com/gp/product/${cell}`}
              target="_blank"
              rel="noreferrer"
            >
              {cell}
            </a>
          ) : (
            cell
          );
        },
      },
      {
        auto: true,
        default: true,
        category: 'settings',
        dataField: 'target',
        text: 'Target',
        hideable: true,
        sort: false,
        headerStyle: { minWidth: '250px' },
        classes: 'px-6 py-4 text-sm text-gray-500',
        headerClasses:
          'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
        formatter: (cell, row) => {
          return cell === KEYWORD_TARGETING ? (
            <KeywordPreview
              accountId={accountId}
              marketplace={marketplace}
              campaignType={campaignType}
              adGroupId={row.advAdGroupId}
              adGroupName={row.AdvAdGroup.name}
              campaignName={row.AdvCampaign.name}
              keywordId={row.AdvKeyword.advKeywordId}
              keywordText={row.AdvKeyword.keywordText}
              matchType={row.AdvKeyword.matchType}
            />
          ) : (
            <TargetPreview
              adGroupName={row.AdvAdGroup.name}
              campaignName={row.AdvCampaign.name}
              targetingText={row.AdvTarget.targetingText}
            />
          );
        },
      },
    ],
    ...metricColumns(),
  ];

  return (
    <div id={SEARCH_TERMS}>
      <AdvertisingTable
        params={params}
        list={searchTerms}
        columns={columns}
        accountId={accountId}
        recordType={SEARCH_TERMS}
        keyField="advSearchTermId"
        marketplace={marketplace}
        campaignType={campaignType}
        selectedIds={selectedIds}
        onChangeParams={onUpdateParams}
        onChangeSelectedIds={setSelectedIds}
        onChangeVisibleColumns={onChangeVisibleColumns}
        visibleColumns={visibleColumns}
        additionalFilters={[
          {
            attribute: 'target',
            display: t('Advertising.SearchTerm.Target'),
            placeholder: t('Advertising.SearchTerm.Filter.Target'),
            comparison: EQUAL_TO,
            value: '',
            options: [
              {
                display: t('Advertising.SearchTerm.Target.Product'),
                value: PRODUCT_TARGETING,
              },
              {
                display: t('Advertising.SearchTerm.Target.Keyword'),
                value: KEYWORD_TARGETING,
              },
            ],
          },
        ]}
        searchClassName="lg:col-span-2"
        filterCampaignClassName="lg:col-span-2"
        filterAdGroupClassName="lg:col-span-2"
        filterCampaignPlaceholder={t('Advertising.AdGroup.Filter.Campaign')}
        filterAdGroupPlaceholder={t('Advertising.AdGroup.Filter.AdGroup')}
        campaignOptions={campaignOptions}
        adGroupOptions={adGroupOptions}
        filtersClassName="lg:col-span-4"
        exportClassName="lg:col-span-2"
        searchPlaceholder={t('Advertising.SearchTerm.Filter.Query')}
      />
    </div>
  );
};

export default SearchTerms;
