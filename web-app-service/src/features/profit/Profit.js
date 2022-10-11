import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch, Route } from 'react-router-dom';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import Overview from './overview/Overview';
import Snapshots from './Snapshots/Snapshots';
import CostManager from './CostManager/CostManager';

const Profit = ({ match }) => {
  const { t } = useTranslation();
  const { path } = match;

  const tabs = [
    {
      name: 'Overview',
      href: `${path}`,
      exact: true,
    },
    {
      name: 'Snapshots',
      href: `${path}/snapshots`,
    },
    {
      name: 'Cost Manager',
      href: `${path}/cost-manager`,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Profit.ProfitManager")} tabs={tabs} />

      <Switch>
        {/* Overview Tab */}
        <Route path={`${path}`} component={Overview} exact />

        {/* Snapshots Tab */}
        <Route path={`${path}/snapshots`} component={Snapshots} />

        {/* Cost Manager Tab */}
        <Route path={`${path}/cost-manager`} component={CostManager} />
      </Switch>
    </DashboardLayout>
  );
};

export default Profit;
