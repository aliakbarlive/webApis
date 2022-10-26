import axios from 'axios';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import logo from 'assets/images/siLogo.png';
import SalesSummaryChart from './charts/SalesSummaryChart';
import BestWorstKeywordsTable from './charts/BestWorstKeywordsTable';
import ConverterShareChart from './charts/ConverterShareChart';
import NonConvertersKPIsChart from './charts/NonConvertersKPIsChart';
import Funnel from './charts/Funnel';
import CostConvertAndKPI from './charts/CostConvertAndKPI';
import KeywordsPerformaceTable from './charts/KeywordsPerformaceTable';
import CampaignTypePerformanceSummary from './components/CampaignTypePerformanceSummary';
import TargetingTypeBreakdown from 'features/advertising/components/sections/TargetingTypeBreakdown';
import CampaignTypeBreakdown from 'features/advertising/components/sections/CampaignTypeBreakdown';
import KpiAnalysis from 'features/advertising/components/sections/KpiAnalysis';
import TargetingRanking from 'features/advertising/components/sections/TargetingRanking';
import PageLoader from 'components/PageLoader';
import ActiveCampaigns from 'features/advertising/components/sections/ActiveCampaigns';
import ConverterVsNonConverter from 'features/advertising/components/sections/ConverterVsNonConverter';

const PPCperformance = () => {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({});
  const [targetings, setTargetings] = useState({ rows: [] });

  useEffect(() => {
    setLoading(true);

    axios.get(`/advertising/reports/${reportId}`).then((response) => {
      setReport(response.data.data);
      setLoading(false);
    });

    axios
      .get(`/advertising/reports/${reportId}/targetings`, {
        params: {
          attributes:
            'advTargetingId,value,ctr,cr,unitsPerOrder,impressionsPerSpend,costPerConvertedUnit',
          sort: 'cr:desc',
          pageSize: 100,
          include: ['metricsRanking'],
        },
      })
      .then((response) => setTargetings(response.data.data));
  }, [reportId]);

  return !loading ? (
    <div className="pb-8" style={{ backgroundColor: '#F9F9F9' }}>
      <div
        className="w-full flex flex-row justify-between px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-28"
        style={{ backgroundColor: '#FB3767' }}
      >
        <div className="flex flex-col justify-center py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-16">
          <p className="font-normal text-xs md:text-sm lg:text-base xl:lg 2xl:text-xl text-white">
            {moment(report.startDate).format('MMMM DD, YYYY')} -{' '}
            {moment(report.endDate).format('MMMM DD, YYYY')}
          </p>
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-white">
            Amazon PPC Performance
          </p>
        </div>
        <div className="flex flex-row justify-center pr-4">
          <div className="flex flex-col justify-center pr-2">
            <img
              src={logo}
              className="h-4 md:h-6 lg:h-8 xl:h-12 2xl:h-16 w-4 md:w-6 lg:w-8 xl:w-12 2xl:w-16"
              alt="logo"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-normal text-xs md:text-sm lg:text-base xl:lg 2xl:text-xl text-white ml-2 font-bold leading-5">
              Seller <br /> Interactive.
            </p>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-28 mt-4 md:mt-6 lg:mt-8 xl:mt-12 2xl:mt-16">
        <ActiveCampaigns data={report.data.campaignSummary} />

        <CampaignTypePerformanceSummary
          data={report.data.campaignTypesBreakdown}
        />

        <CampaignTypeBreakdown data={report.data.campaignTypeSummary} />

        <TargetingTypeBreakdown data={report.data.targetingTypeSummary} />

        <div className="grid grid-cols-2 gap-8 mt-12">
          <SalesSummaryChart data={report.data.salesSummary} />

          <BestWorstKeywordsTable data={report.data.importantKeywords} />
        </div>

        <div className="grid grid-cols-2 gap-8 mt-12">
          <ConverterShareChart data={report.data.convertersSummary} />

          <ConverterVsNonConverter data={report.data.convertersSummary} />
        </div>

        <div className="grid xl:grid-cols-2 gap-8 mt-12">
          <NonConvertersKPIsChart data={report.data.convertersSummary} />

          <Funnel data={report.data.performance.current.data} />
        </div>

        <CostConvertAndKPI data={report.data.performance} />

        <KpiAnalysis
          url={`/advertising/reports/${reportId}/targetings-distribution`}
          listUrl={`/advertising/reports/${reportId}/targetings`}
        />

        <KeywordsPerformaceTable reportId={reportId} />

        <TargetingRanking targetings={targetings} />
      </div>
    </div>
  ) : (
    <PageLoader />
  );
};

export default withRouter(PPCperformance);
