import KeywordPreview from '../keywords/components/KeywordPreview';
import TargetPreview from '../targets/components/TargetPreview';
import MetricDisplay from '../components/MetricDisplay';
import {
  CAMPAIGNS,
  KEYWORDS,
  KEYWORD_TARGETING,
  SEARCH_TERMS,
} from './constants';

import { stateFormatter } from './formatters';
import {
  numberFormatter,
  currencyFormatter,
  percentageFormatter,
} from 'utils/formatters';

export const listBaseColumns = (
  accountId,
  marketplace,
  campaignType,
  recordType,
  t
) => {
  switch (recordType) {
    case CAMPAIGNS:
      return [
        {
          sort: true,
          auto: true,
          default: true,
          dataField: 'values.name',
          category: 'settings',
          text: 'Campaign',
          headerStyle: { minWidth: '275px' },
          classes: 'px-6 py-4 text-sm text-gray-500',
          headerClasses:
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
        },
        {
          sort: true,
          default: true,
          hideable: true,
          dataField: 'values.startDate',
          category: 'settings',
          text: 'Start Date',
          headerStyle: { minWidth: '150px' },
        },
        {
          sort: true,
          default: true,
          hideable: true,
          dataField: 'values.endDate',
          category: 'settings',
          text: 'End Date',
          headerStyle: { minWidth: '150px' },
          formatter: (cell) => cell ?? 'No end date',
        },
        {
          sort: false,
          hideable: true,
          text: 'Bidding',
          category: 'settings',
          dataField: 'values.bidding',
          headerStyle: { minWidth: '150px' },
          formatter: (bidding) => {
            if (!bidding) return '';
            switch (bidding.strategy) {
              case 'legacyForSales':
                return 'Dynamic bids - down only';
              case 'autoForSales':
                return 'Dynamic bids - up and down';
              case 'manual':
                return 'Fixed bid';
              default:
                return '-';
            }
          },
        },
        {
          dataField: 'values.budget',
          text: t('Advertising.Campaign.Budget'),
          sort: true,
          headerStyle: { minWidth: '150px' },
          classes: 'px-6 py-4 text-sm text-gray-500',
          headerClasses:
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
          hideable: true,
          category: 'settings',
        },
      ];
    case KEYWORDS:
      return [
        {
          auto: true,
          default: true,
          category: 'settings',
          dataField: 'values.keywordText',
          text: t('Advertising.Keyword.Text'),
          sort: true,
          headerStyle: { minWidth: '200px' },
          formatter: (cell, row) => {
            return (
              <KeywordPreview
                adGroupName={row.values.AdvAdGroup.name}
                campaignName={row.values.AdvAdGroup.AdvCampaign.name}
                keywordId={row.values.advKeywordId}
                keywordText={cell}
                matchType={row.values.matchType}
                showProducts={false}
              />
            );
          },
          classes: 'px-6 py-4 text-sm text-gray-500',
          headerClasses:
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
        },
        {
          hideable: true,
          category: 'settings',
          dataField: 'values.bid',
          text: t('Advertising.Keyword.Bid'),
          sort: true,
          headerStyle: { minWidth: '120px' },
          classes: 'px-6 py-4 text-sm text-gray-500',
          headerClasses:
            'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase',
          formatter: (cell) => currencyFormatter(cell),
        },
      ];
    case SEARCH_TERMS:
      return [
        {
          auto: true,
          default: true,
          category: 'settings',
          dataField: 'values.query',
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
          dataField: 'values.target',
          text: 'Source',
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
                adGroupId={row.values.advAdGroupId}
                adGroupName={row.values.AdvAdGroup.name}
                campaignName={row.values.AdvCampaign.name}
                keywordId={row.values.AdvKeyword.advKeywordId}
                keywordText={row.values.AdvKeyword.keywordText}
                matchType={row.values.AdvKeyword.matchType}
              />
            ) : (
              <TargetPreview
                adGroupName={row.values.AdvAdGroup.name}
                campaignName={row.values.AdvCampaign.name}
                targetingText={row.values.AdvTarget.targetingText}
              />
            );
          },
        },
      ];
    default:
      return [];
  }
};

export const statusColumn = () => {
  return {
    sort: true,
    default: true,
    hideable: true,
    text: 'Status',
    dataField: 'state',
    headerStyle: { minWidth: '120px' },
    formatter: (cell) => stateFormatter(cell),
    category: 'settings',
  };
};

export const metricColumns = () => {
  return [
    {
      sort: true,
      default: true,
      text: 'Spend',
      hideable: true,
      dataField: 'cost',
      category: 'performance',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="cost"
          currentData={cell}
          previousData={row.previousData ? row.previousData.cost : 0}
          formatter={currencyFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'Sales',
      default: true,
      hideable: true,
      dataField: 'sales',
      category: 'conversions',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'sales'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['sales'] : 0}
          formatter={currencyFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'Profit',
      hideable: true,
      dataField: 'profit',
      category: 'conversions',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="profit"
          currentData={cell}
          previousData={row.previousData ? row.previousData.profit : 0}
          formatter={currencyFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'ACOS',
      hideable: true,
      dataField: 'acos',
      category: 'performance',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="acos"
          currentData={cell}
          previousData={row.previousData ? row.previousData.acos : 0}
          formatter={percentageFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'ROAS',
      display: 'Return on ad spend (ROAS)',
      hideable: true,
      dataField: 'roas',
      category: 'conversions',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="roas"
          currentData={cell}
          previousData={row.previousData ? row.previousData.roas : 0}
          formatter={percentageFormatter}
        />
      ),
    },
    {
      sort: true,
      hideable: true,
      text: 'Impressions',
      category: 'performance',
      dataField: 'impressions',
      headerStyle: { minWidth: '155px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="impressions"
          currentData={cell}
          previousData={row.previousData ? row.previousData.impressions : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      text: 'CPM',
      sort: true,
      hideable: true,
      dataField: 'cpm',
      category: 'performance',
      display: 'Cost per 1,000 viewable impressions (VCPM)',
      headerStyle: { minWidth: '155px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="cpm"
          currentData={cell}
          previousData={row.previousData ? row.previousData.cpm : 0}
          formatter={currencyFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'Clicks',
      hideable: true,
      dataField: 'clicks',
      category: 'performance',
      headerStyle: { minWidth: '120px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="clicks"
          currentData={cell}
          previousData={row.previousData ? row.previousData.clicks : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'CPC',
      hideable: true,
      dataField: 'cpc',
      category: 'performance',
      display: 'Cost-per-click (CPC)',
      headerStyle: { minWidth: '100px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="cpc"
          currentData={cell}
          previousData={row.previousData ? row.previousData.cpc : 0}
          formatter={currencyFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'CTR',
      hideable: true,
      dataField: 'ctr',
      category: 'performance',
      display: 'Clickthrough rate (CTR)',
      headerStyle: { minWidth: '100px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="ctr"
          currentData={cell}
          previousData={row.previousData ? row.previousData.ctr : 0}
          formatter={percentageFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'CR',
      hideable: true,
      dataField: 'cr',
      category: 'conversions',
      headerStyle: { minWidth: '90px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute="cr"
          currentData={cell}
          previousData={row.previousData ? row.previousData.cr : 0}
          formatter={percentageFormatter}
        />
      ),
    },
    {
      sort: true,
      default: true,
      text: 'Orders',
      hideable: true,
      dataField: 'orders',
      category: 'conversions',
      headerStyle: { minWidth: '125px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'orders'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['orders'] : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      sort: true,
      text: 'NTB Orders',
      hideable: true,
      dataField: 'attributedOrdersNewToBrand14d',
      display: 'New-to-brand (NTB) orders',
      category: 'conversions',
      headerStyle: { minWidth: '125px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'orders'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['orders'] : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      sort: true,
      hideable: true,
      text: '% of orders NTB',
      category: 'conversions',
      display: '% of orders new-to-brand (NTB)',
      dataField: 'attributedOrdersNewToBrandPercentage14d',
      headerStyle: { minWidth: '125px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'orders'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['orders'] : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      sort: true,
      hideable: true,
      text: 'NTB Sales',
      display: 'New-to-brand (NTB) sales',
      dataField: 'attributedSalesNewToBrand14d',
      category: 'conversions',
      headerStyle: { minWidth: '125px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'orders'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['orders'] : 0}
          formatter={numberFormatter}
        />
      ),
    },
    {
      sort: true,
      hideable: true,
      text: '% of Sales NTB',
      display: '% of sales new-to-brand (NTB)',
      dataField: 'attributedSalesNewToBrandPercentage14d',
      category: 'conversions',
      headerStyle: { minWidth: '125px' },
      formatter: (cell, row) => (
        <MetricDisplay
          attribute={'orders'}
          currentData={cell}
          previousData={row.previousData ? row.previousData['orders'] : 0}
          formatter={numberFormatter}
        />
      ),
    },
  ];
};
