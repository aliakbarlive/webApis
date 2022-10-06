import usePermissions from 'hooks/usePermissions';
import { stringify } from 'qs';
import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
// import Overview from './Overview';
// import Profile from './Profile';
import LeadVariables from './components/LeadVariables';
import LiAccount from './components/LiAccount';

const LeadsSettings = ({ match }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const { leadsVariablesPaginationParams, liAccountsPaginationParams } =
    useSelector((state) => state.leads);

  const tabs = [
    {
      name: 'Variables',
      href: `/leads-settings`,
      exact: true,
      visible: userCan('leads.list'),
      query: () => {
        return {
          page: leadsVariablesPaginationParams.page ?? 1,
          pageSize: leadsVariablesPaginationParams.pageSize ?? 30,
          sort: leadsVariablesPaginationParams.sort ?? 'createdAt:desc',
        };
      },
    },
    {
      name: 'LI Accounts',
      href: `/leads-settings/liAccount`,
      exact: true,
      visible: userCan('leads.list'),
      query: () => {
        return {
          page: liAccountsPaginationParams.page ?? 1,
          pageSize: liAccountsPaginationParams.pageSize ?? 30,
          sort: liAccountsPaginationParams.sort ?? 'createdAt:desc',
        };
      },
    },
  ];

  return (
    <>
      <Switch>
        <Route
          path={`${path}`}
          render={(props) => <LeadVariables tabs={tabs} {...props} />}
          exact
        />
        <Route
          path={`${path}/liAccount`}
          render={(props) => <LiAccount tabs={tabs} {...props} />}
          exact
        />
      </Switch>
    </>
  );
};

export default withRouter(LeadsSettings);
