import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Overview from './Overview';
import ClientForm from './ClientForm';
import Profile from './Profile';
import ClientMigrationForm from './ClientMigrationForm';
import CycleDate from './CycleDate';
import ManageEmails from './Profile/components/url/ManageEmails';
import AccountRedirect from './AccountRedirect';
import Assignments from './Assignments';

const Clients = ({ match }) => {
  const { path } = match;

  return (
    <Switch>
      {/* Overview Tab */}
      <Route path={`${path}`} component={Overview} exact />
      <Route path={`${path}/profile/:id`} component={Profile} />
      <Route path={`${path}/account/:id`} component={AccountRedirect} />
      <Route path={`${path}/store-cycle-date`} component={CycleDate} />
      <Route path={`${path}/migration/:id`} component={ClientMigrationForm} />
      <Route
        path={`${path}/manage-checklist-url-email-templates`}
        component={ManageEmails}
      />
      <Route path={`${path}/:operation/:id?`} component={ClientForm} />
    </Switch>
  );
};

export default Clients;
