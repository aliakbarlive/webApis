import axios from 'axios';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import DatePicker from 'features/datePicker/DatePicker';
import OverallPerformance from './analytics/OverallPerformance';
import CampaignTypePerformanceSummary from './analytics/CampaignTypePerformanceSummary';
import MetricsChart from './analytics/MetricsChart';
import ExportButton from './analytics/ExportButton';
import KeywordPerformance from './analytics/KeywordPerformance';
import ActiveCampaigns from './components/sections/ActiveCampaigns';
import CampaignTypeBreakdown from './components/sections/CampaignTypeBreakdown';
import TargetingTypeBreakdown from './components/sections/TargetingTypeBreakdown';
import ConverterVsNonConverter from './components/sections/ConverterVsNonConverter';
import CompareConverterVsNonConverter from './components/sections/CompareConverterVsNonConverter';
import KpiAnalysis from './analytics/KpiAnalysis';
import TargetingRanking from './components/sections/TargetingRanking';

const Analytics = ({ account, marketplace }) => {
  const selectedDates = useSelector(selectCurrentDateRange);
  const [targetings, setTargetings] = useState({ rows: [] });

  const [activeCampaignsData, setActiveCampaignsData] = useState({
    total: {},
    sp: {},
    sb: {},
    sd: {},
    auto: {},
    manual: {},
  });

  const [campaignTypesBreakdownLoading, setCampaignTypesBreakdownLoading] =
    useState(false);
  const [campaignTypesBreakdown, setCampaignTypesBreakdown] = useState([
    { title: 'Sponsored Products' },
    { title: 'Sponsored Brands' },
    { title: 'Sponsored Brands Video' },
    { title: 'Sponsored Display' },
    { title: 'Total' },
  ]);

  const [targetingTypesBreakdownLoading, setTargetingTypesBreakdownLoading] =
    useState(false);

  const [targetingTypesBreakdown, setTargetingTypesBreakdown] = useState([
    { title: 'Manual Keywords', subBreakdown: [] },
    { title: 'Automatic' },
    { title: 'Product Targeting (PT)' },
  ]);

  const [conversionSummaryLoading, setConversionSummaryLoading] =
    useState(false);
  const [conversionSummaryData, setConversionSummaryData] = useState([
    { key: 'converters' },
    { key: 'nonConverters' },
    { key: 'all' },
  ]);

  const attributes = [
    'cr',
    'cpc',
    'aov',
    'cost',
    'clicks',
    'profit',
    'orders',
    'acos',
    'sales',
  ];

  const [selectedMetrics, setSelectedMetrics] = useState([
    'sales',
    'acos',
    'clicks',
  ]);

  const onSelectMetric = (metric) => {
    setSelectedMetrics([selectedMetrics[1], selectedMetrics[2], metric]);
  };

  useEffect(() => {
    setConversionSummaryLoading(true);
    setCampaignTypesBreakdownLoading(true);
    setTargetingTypesBreakdownLoading(true);

    const attributes = [
      'cr',
      'cpc',
      'aov',
      'cost',
      'clicks',
      'profit',
      'orders',
      'acos',
      'sales',
    ];

    axios
      .get('/advertising/analytics/campaign-types/summary', {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
        },
      })
      .then((response) => setActiveCampaignsData(response.data.data));

    axios
      .get('/ppc/analytics/campaign-types/performance', {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
          attributes,
        },
      })
      .then((response) => {
        setCampaignTypesBreakdown(response.data.data);
      })
      .finally(() => setCampaignTypesBreakdownLoading(false));

    axios
      .get('/ppc/analytics/targeting-types/performance', {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
          attributes,
        },
      })
      .then((response) => {
        setTargetingTypesBreakdown(response.data.data);
      })
      .finally(() => setTargetingTypesBreakdownLoading(false));

    axios
      .get('/advertising/targetings/conversions-summary', {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
        },
      })
      .then((response) => setConversionSummaryData(response.data.data))
      .finally(() => setConversionSummaryLoading(false));

    axios
      .get(`/advertising/targetings`, {
        params: {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
          ...selectedDates,
          attributes:
            'advTargetingId,value,ctr,cr,unitsPerOrder,impressionsPerSpend,costPerConvertedUnit',
          sort: 'cr:desc',
          pageSize: 100,
          include: ['metricsRanking'],
        },
      })
      .then((response) => setTargetings(response.data.data));
  }, [account, marketplace, selectedDates]);

  return (
    <div>
      <div className="grid grid-cols-3">
        <div>
          <DatePicker position="left" />
        </div>
        <div className="col-start-3 items-baseline flex justify-end">
          <div className="flex">
            <ExportButton
              accountId={account.accountId}
              marketplace={marketplace.details.countryCode}
              startDate={selectedDates.startDate}
              endDate={selectedDates.endDate}
            />
          </div>
        </div>
      </div>

      <OverallPerformance
        accountId={account.accountId}
        marketplace={marketplace.details.countryCode}
        startDate={selectedDates.startDate}
        endDate={selectedDates.endDate}
        selectedMetrics={selectedMetrics}
        onSelectMetric={onSelectMetric}
      />

      <MetricsChart
        accountId={account.accountId}
        marketplace={marketplace.details.countryCode}
        selectedMetrics={selectedMetrics}
      />

      <ActiveCampaigns data={activeCampaignsData} className="mt-4" />

      <CampaignTypePerformanceSummary
        accountId={account.accountId}
        marketplace={marketplace.details.countryCode}
        startDate={selectedDates.startDate}
        endDate={selectedDates.endDate}
      />

      <CampaignTypeBreakdown
        showLoading={true}
        data={campaignTypesBreakdown}
        loading={campaignTypesBreakdownLoading}
      />

      <TargetingTypeBreakdown
        showLoading={true}
        data={targetingTypesBreakdown}
        loading={targetingTypesBreakdownLoading}
      />

      <div className="mt-8 grid grid-cols-2 gap-8">
        <ConverterVsNonConverter
          showLoading={true}
          data={conversionSummaryData}
          loading={conversionSummaryLoading}
        />

        <CompareConverterVsNonConverter data={conversionSummaryData} />
      </div>

      <KeywordPerformance
        accountId={account.accountId}
        marketplace={marketplace.details.countryCode}
        campaignType="sponsoredProducts"
        startDate={selectedDates.startDate}
        endDate={selectedDates.endDate}
      />

      <KpiAnalysis
        accountId={account.accountId}
        marketplace={marketplace.details.countryCode}
        startDate={selectedDates.startDate}
        endDate={selectedDates.endDate}
      />

      <TargetingRanking targetings={targetings} />
    </div>
  );
};

export default Analytics;
