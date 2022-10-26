import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import { Route, Switch } from 'react-router-dom';
import Subscription from './Subscription';
import InvoiceHistory from './InvoiceHistory';
import InvoiceDetails from './InvoiceDetails';

const Plan = ({ match }) => {
  const { path } = match;

  const tabs = [
    {
      name: 'Subscription',
      href: `${path}`,
      exact: true,
    },
    { name: 'Invoice History', href: `${path}/invoicehistory`, exact: true },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Plan" tabs={tabs} />
      <Switch>
        {/* Subscription Tab */}
        <Route path={`${path}`} exact component={Subscription} />

        {/* Invoice History Tab */}
        <Route
          path={`${path}/invoicehistory`}
          component={InvoiceHistory}
          exact
        />

        {/* Invoice Details Page */}
        <Route
          path={`${path}/invoices/:invoiceId`}
          component={InvoiceDetails}
        />
      </Switch>
    </DashboardLayout>
  );
};

export default Plan;
