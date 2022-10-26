import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';

import logo from 'assets/images/siLogo.png';
import './funnel.scss';
import './print.scss';

import MonthlyReportCharts from './components/MonthlyReportCharts';
import OverallMonthlyStats from './components/OverallMonthlyStats';
import TotalMonthlyOrders from './components/TotalMonthlyOrders';
import TopCampaigns from './components/TopCampaigns';
import MonthlyKPIs from './components/MonthlyKPIs';

const MonthlyReport = () => {
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

  return loading ? (
    'loding'
  ) : (
    <div
      style={{ width: '210mm', height: '297mm' }}
      className="bg-gray-50 pb-4 max-w-screen-lg mx-auto"
    >
      <div className="bg-custom-pink h-48 w-full flex flex-col items-center">
        <div className="flex justify-between w-full px-8 mt-6">
          <div className="mt-1">
            <p className="text-gray-200 text-sm mb-2">
              {moment(report.startDate).format('MMMM DD, YYYY')} -{' '}
              {moment(report.endDate).format('MMMM DD, YYYY')}
            </p>
            <p className="text-2xl font-bold text-white font-body">
              Monthly Cost and Revenue
            </p>
          </div>
          <div className="flex justify-between items-center mt-1">
            <img src={logo} className="h-13 w-13" />
            <p className="text-xl text-white ml-4 font-bold leading-5 font-body">
              Seller <br /> Interactive.
            </p>
          </div>
        </div>
      </div>

      <MonthlyKPIs data={report.data.overallPerformance} />

      <MonthlyReportCharts data={report.data.monthlyRecords} />

      <OverallMonthlyStats data={report.data.overallPerformance} />

      <div className="bg-custom-pink h-36 w-full flex pagebreak flex-col justify-center items-center">
        <div className="flex justify-between w-full px-8 mt-6">
          <div className="mt-1">
            <p className="text-gray-200 text-sm mb-2">
              {moment(report.startDate).format('MMMM DD, YYYY')} -{' '}
              {moment(report.endDate).format('MMMM DD, YYYY')}
            </p>
            <p className="text-2xl font-bold text-white font-body">
              Monthly Cost and Revenue
            </p>
          </div>
          <div className="flex justify-between items-center mt-1">
            <img src={logo} className="h-13 w-13" />
            <p className="text-xl text-white ml-4 font-bold leading-5 font-body">
              Seller <br /> Interactive.
            </p>
          </div>
        </div>
      </div>

      <TotalMonthlyOrders
        data={report.data.monthlyRecords}
        performance={report.data.overallPerformance}
      />

      <TopCampaigns campaigns={report.data.topCampaigns} />
    </div>
  );
};

export default withRouter(MonthlyReport);
