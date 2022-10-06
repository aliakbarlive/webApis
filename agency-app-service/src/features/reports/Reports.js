import { Route, Switch, Redirect } from 'react-router';

import PageHeader from 'components/PageHeader';
import MonthlyRevenue from './MonthlyRevenue';
import MonthlyRevenueBreakdown from './MonthlyRevenueBreakdown';
import usePermissions from 'hooks/usePermissions';
import ClientsSummary from './ClientsSummary';

const Reports = () => {
  const { userCan } = usePermissions();

  const tabs = [
    {
      name: 'Clients Summary',
      href: '/reports/clients-summary',
      path: '/reports/clients-summary',
      component: ClientsSummary,
      exact: true,
      visible: userCan('reports.revenue.view'),
    },
    {
      name: 'Monthly Revenue',
      href: '/reports/montly-revenue',
      path: '/reports/montly-revenue',
      component: MonthlyRevenue,
      exact: true,
      visible: userCan('reports.revenue.view'),
    },
    {
      name: 'Monthly Revenue Breakdown',
      href: '/reports/montly-revenue-breakdown',
      path: '/reports/montly-revenue-breakdown',
      component: MonthlyRevenueBreakdown,
      exact: true,
      visible: userCan('reports.revenue.view'),
    },
  ].filter((tab) => tab.visible);

  return (
    <div>
      <PageHeader title="Reports" tabs={tabs} />
      <Switch>
        <Route
          path="/reports"
          exact
          render={() => <Redirect to="/reports/clients-summary" />}
        />
        <Route
          path="/reports/clients-summary"
          component={ClientsSummary}
          exact
        />

        <Route
          path="/reports/montly-revenue"
          component={MonthlyRevenue}
          exact
        />
        <Route
          path="/reports/montly-revenue-breakdown"
          component={MonthlyRevenueBreakdown}
          exact
        />
      </Switch>
    </div>
  );
};

export default Reports;
