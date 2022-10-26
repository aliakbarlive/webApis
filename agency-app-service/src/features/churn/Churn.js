import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Terminations from './Terminations';
import PageHeader from 'components/PageHeader';
import { useSelector } from 'react-redux';
import usePermissions from 'hooks/usePermissions';

const Churn = ({ match }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const { currentPage } = useSelector((state) => state.churn);

  const tabs = [
    {
      name: 'Dashboard',
      href: `/churn`,
      exact: true,
      visible: userCan('churn.view'),
    },
    {
      name: 'Terminations',
      href: `/churn/terminations`,
      exact: true,
      visible: userCan('churn.terminations.view'),
    },
  ].filter((tab) => tab.visible);

  return (
    <>
      <PageHeader title={currentPage ?? 'Churn Dashboard'} tabs={tabs} />
      <Switch>
        <Route path={`${path}`} component={Dashboard} exact />
        <Route path={`${path}/terminations`} component={Terminations} />
      </Switch>
    </>
  );
};

export default Churn;
