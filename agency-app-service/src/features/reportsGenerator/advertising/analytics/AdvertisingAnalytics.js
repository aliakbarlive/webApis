import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import CoverPage from './components/CoverPage';
import OverallStats from './components/OverallStats';
import DailyStats from './components/DailyStats';
import CampaignSummary from './components/CampaignSummary';
import CampaignTypePerformanceBreakdown from './components/CampaignTypePerformanceBreakdown';

import './print.scss';
import TargetingTypePerformanceBreakdown from './components/TargetingTypePerformanceBreakdown';

const AdvertisingAnalytics = () => {
  const { reportId } = useParams();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({});

  useEffect(() => {
    setLoading(true);

    axios.get(`/advertising/reports/${reportId}`).then((response) => {
      setReport(response.data.data);
      setLoading(false);
    });
  }, [reportId]);

  return !loading ? (
    <div className="advertising-analytics w-full text-xs text-gray-800 font-body">
      <CoverPage />

      <OverallStats data={report.data.overallPerformance} />

      <DailyStats records={report.data.dailyPerformance} />

      <CampaignSummary data={report.data.campaignSummary} />

      <CampaignTypePerformanceBreakdown
        breakdowns={report.data.campaignTypesPerformance}
        showChart={true}
      />

      <TargetingTypePerformanceBreakdown
        breakdowns={report.data.targetingTypesPerformance}
        showChart={true}
      />

      <div className="pagebreak mx-10 font-body h-screen flex-col items-center justify-center mt-10">
        <div className="h-1/3">
          <p className="ml-5 font-extrabold mb-2" style={{ fontSize: '32px' }}>
            Past Action
          </p>
          <textarea
            disabled
            rows={5}
            className="w-full text-xs border-gray-300 rounded-md h-3/5"
            defaultValue={report.data.passAction}
          ></textarea>
        </div>
        <div className="h-1/3">
          <p className="ml-5 font-extrabold mb-2" style={{ fontSize: '32px' }}>
            Analysis
          </p>
          <textarea
            rows={5}
            disabled
            className="w-full text-xs border-gray-300 rounded-md h-2/3"
            defaultValue={report.data.analysis}
          ></textarea>
        </div>
        <div className="h-1/3 ">
          <p className="ml-5 font-extrabold mb-2" style={{ fontSize: '32px' }}>
            Future Plan of Action
          </p>
          <textarea
            rows={5}
            disabled
            className="w-full text-xs border-gray-300 rounded-md h-2/3 "
            defaultValue={report.data.futurePlanOfAction}
          ></textarea>
        </div>
      </div>
    </div>
  ) : (
    'loading'
  );
};

export default withRouter(AdvertisingAnalytics);
