import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import Agency from './Agency';

const PermissionsManager = () => {
  const { t } = useTranslation();

  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const tabs = [
    {
      name: 'Agency',
      href: `/permissions/agency`,
      path: `/permissions/agency`,
      component: Agency,
    },
  ];

  return (
    <div>
      <Switch>
        {tabs.map((tab) => {
          const { component: Component } = tab;

          return (
            <Route
              key={tab.path}
              path={tab.path}
              render={() => (
                <Component
                // accountId={account.accountId}
                // marketplace={marketplace.details.countryCode}
                />
              )}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default PermissionsManager;
