import usePermissions from 'hooks/usePermissions';
import { stringify } from 'qs';
import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';

import { selectAuthenticatedUser } from 'features/auth/authSlice';
import Overview from './Overview';
import Profile from './Profile';
import Import from './Import';

const Leads = ({ match }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const { leadsPaginationParams } = useSelector((state) => state.leads);
  const me = useSelector(selectAuthenticatedUser);

  const tabs = [
    {
      name: 'Data',
      href: `/leads`,
      exact: true,
      visible: userCan('leads.list'),
      isTab: true,
      query: () => {
        return {
          page: leadsPaginationParams.page ?? 1,
          statuses: 'Unprocessed New Leads',
          status: leadsPaginationParams.status ?? '',
          pageSize: leadsPaginationParams.pageSize ?? 30,
          sort: leadsPaginationParams.sort ?? 'pitchDate:desc nulls last',
        };
      },
    },
    {
      name: 'Profile',
      href: `/leads/profile/:id`,
      exact: true,
      visible: userCan('leads.list'),
      isTab: false,
    },
  ]
    .filter((tab) => tab.visible)
    .map((item) => {
      let itemQuery = item.query ? item.query() : {};
      item.href = `${item.href}?${stringify(itemQuery)}`;

      return item;
    });

  return (
    <>
      <Switch>
        <Route
          path={`${path}`}
          render={(props) => (
            <Overview tabs={tabs} page="My Workplace" {...props} />
          )}
          exact
        />
        <Route path={`${path}/import`} component={Import} />
        <Route
          path={`${path}/profile/:id`}
          render={(props) => <Profile tabs={tabs} {...props} />}
          exact
        />
      </Switch>
    </>
  );
};

export default withRouter(Leads);
