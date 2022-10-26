import React from 'react';
import { Route, Switch } from 'react-router';

import PageHeader from 'components/PageHeader';
import InitialSyncStatus from './components/InitialSyncStatus';
import SyncRecordIndex from './components/SyncRecordIndex';

const DataSyncManager = () => {
  const tabs = [
    {
      name: 'Initial Sync Status',
      href: '/data-sync',
      path: '/data-sync',
      component: InitialSyncStatus,
      exact: true,
    },
    {
      name: 'Sync Records',
      href: '/data-sync/records',
      path: '/data-sync/records',
      component: SyncRecordIndex,
      exact: false,
    },
  ];

  return (
    <div id="account-details">
      <div className="block">
        <div className="grid grid-cols-12 py-5">
          <h2 className="col-span-12 mb-4 lg:col-span-5 xl:mb-0 xl:col-span-7 text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate border-b-2 border-transparent capitalize">
            Data Sync
          </h2>
        </div>
      </div>

      <PageHeader tabs={tabs} />

      <Switch>
        {tabs.map((tab) => {
          const { component: Component } = tab;
          return (
            <Route
              exact={tab.exact}
              key={tab.name}
              path={tab.path}
              render={() => <Component key={tab.href} />}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default DataSyncManager;
