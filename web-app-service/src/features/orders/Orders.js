import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch, Route } from 'react-router-dom';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import OrderManager from './OrderManager';
import Heatmap from './Heatmap';

const Orders = ({ match }) => {
  const { t } = useTranslation();
  const { path } = match;

  const tabs = [
    {
      name: 'Overview',
      href: `${path}`,
      exact: true,
    },
    {
      name: 'Heat Map',
      href: `${path}/heat-map`,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Order.OrderManager")} tabs={tabs} />

      <Switch>
        {/* Overview Tab */}
        <Route path={`${path}`} exact component={OrderManager} />

        {/* Heat Map Tab */}
        <Route path={`${path}/heat-map`} component={Heatmap} />
      </Switch>
    </DashboardLayout>
  );
};

export default Orders;
