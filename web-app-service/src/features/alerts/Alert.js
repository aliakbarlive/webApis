import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch, Route } from 'react-router-dom';

import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import Configuration from './Configuration';
import History from './History';

const Alerts = () => {
  const { t } = useTranslation();
  const tabs = [
    {
      name: 'History',
      href: `/alerts`,
      exact: true,
    },
    {
      name: 'Configurations',
      href: '/alerts/configurations',
      exact: true,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Alerts.Alerts")} tabs={tabs} />

      <Switch>
        <Route path="/alerts" component={History} exact />
        <Route path="/alerts/configurations" component={Configuration} />
      </Switch>
    </DashboardLayout>
  );
};

export default Alerts;
