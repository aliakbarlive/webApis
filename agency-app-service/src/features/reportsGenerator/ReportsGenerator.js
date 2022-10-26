import { Route, Switch } from 'react-router-dom';
import MonthlyReport from './advertising/analytics/MonthlyReport';
import PPCperformance from './advertising/PPCperformance/PPCperformance';

const ReportsGenerator = () => {
  return (
    <Switch>
      <Route
        path="/reports-generator/advertising-analytics/:reportId"
        component={PPCperformance}
        exact
      />
      <Route
        path="/reports-generator/monthly-report/:reportId"
        component={MonthlyReport}
        exact
      />
    </Switch>
  );
};

export default ReportsGenerator;
