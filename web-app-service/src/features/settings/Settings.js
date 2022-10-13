import React from 'react';
import { Switch, Route } from 'react-router-dom';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import General from './general/General';
import Accounts from './accounts/Accounts';
import Users from './users/Users';

const Settings = ({ match }) => {
  const { path } = match;

  const tabs = [
    {
      name: 'General',
      href: `${path}`,
      exact: true,
    },
    {
      name: 'Amazon Accounts',
      href: `${path}/accounts`,
    },
    {
      name: 'Users',
      href: `${path}/users`,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Settings" tabs={tabs} />

      <Switch>
        {/* General Tab */}
        <Route path={`${path}`} exact component={General} />

        {/* Amazon Accounts Tab */}
        <Route path={`${path}/accounts`} component={Accounts} />

        {/* Users Tab */}
        <Route path={`${path}/users`} component={Users} />
      </Switch>
    </DashboardLayout>
  );
};

export default Settings;
