import React from 'react';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import { Route, Switch } from 'react-router-dom';
import InvoiceDetails from './InvoiceDetails';
import Overview from './Overview';
import Payments from './transactions/Payments';
import Events from './transactions/Events';
import { useSelector } from 'react-redux';
import CommissionErrors from './commissions/errors';
import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';

const Invoices = ({ match, location, history }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const { paginationParams: ipp, currentPage } = useSelector(
    (state) => state.invoices
  );

  const tabs = [
    {
      name: 'Invoices',
      href: `/invoices?status=${ipp.status}&page=${ipp.page}&sizePerPage=${ipp.sizePerPage}`,
      exact: true,
      visible: userCan('invoices.view'),
    },
    {
      name: 'Commission Errors',
      href: `/invoices/errors/commissions`,
      exact: true,
      visible: userCan('invoices.commissionerror.view'),
    },
    {
      name: 'Payments',
      href: `/invoices/payments`,
      exact: true,
      visible: userCan('invoices.payments.view'),
    },
    {
      name: 'Events',
      href: `/invoices/events`,
      exact: true,
      visible: userCan('invoices.events.view'),
    },
  ].filter((tab) => tab.visible);

  return (
    <DashboardLayout>
      <PageHeader
        title={currentPage ?? 'Invoices'}
        tabs={tabs}
        containerClasses={''}
      />
      <Switch>
        <Route path={`${path}`} component={Overview} exact />
        <Route
          path={`${path}/errors/commissions`}
          component={CommissionErrors}
          exact
        />
        <Route path={`${path}/payments`} component={Payments} exact />
        <Route path={`${path}/events`} component={Events} exact />
        <Route path={`${path}/:invoiceId`} component={InvoiceDetails} />
      </Switch>
    </DashboardLayout>
  );
};
export default Invoices;
