import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import General from './general/General';

const Settings = ({ match }) => {
  const { path } = match;

  const tabs = [
    {
      name: 'General',
      href: `${path}`,
      exact: true,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Settings" tabs={tabs} />

      <Switch>
        {/* General Tab */}
        <Route path={`${path}`} exact component={General} />
      </Switch>
    </DashboardLayout>
  );
};

export default Settings;
