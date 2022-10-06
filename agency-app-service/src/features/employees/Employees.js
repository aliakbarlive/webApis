import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import Overview from './Overview';
import Org from './Org';
import Invites from './Invites';
import usePermissions from 'hooks/usePermissions';

const Employees = ({ match }) => {
  const { userCan } = usePermissions();
  const { path } = match;
  const tabs = [
    {
      name: 'Overview',
      href: `/employees`,
      exact: true,
      visible: userCan('employees.list'),
    },
    {
      name: 'Organization Chart',
      href: `/employees/org`,
      exact: true,
      visible: userCan('employees.orgChart.view'),
    },
    {
      name: 'Invites',
      href: `/employees/invites`,
      exact: true,
      visible: userCan('employees.invites.resend'),
    },
  ].filter((tab) => tab.visible);

  return (
    <Switch>
      <Route
        path={`${path}`}
        render={(props) => <Overview tabs={tabs} {...props} />}
        exact
      />
      <Route
        path={`${path}/org`}
        render={(props) => <Org tabs={tabs} {...props} />}
        exact
      />
      <Route
        path={`${path}/invites`}
        render={(props) => <Invites tabs={tabs} {...props} />}
        exact
      />
    </Switch>
  );
};
export default withRouter(Employees);
