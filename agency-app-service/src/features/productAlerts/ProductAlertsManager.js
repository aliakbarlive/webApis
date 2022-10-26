import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import AccountAndMarketplacePicker from 'components/AccountAndMarketplacePicker';
import PageHeader from 'components/PageHeader';

import Configurations from './components/Configurations';

const ProductAlertManager = () => {
  const { t } = useTranslation();

  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const tabs = [
    {
      name: t('ProductAlert.Configurations'),
      href: `/accounts/${account.accountId}/alerts/configurations`,
      path: `/accounts/${account.accountId}/alerts/configurations`,
      component: Configurations,
    },
  ];

  return (
    <div className="block">
      <div className="grid grid-cols-12 py-5">
        <h2 className="col-span-12 mb-4 lg:col-span-5 xl:mb-0 xl:col-span-7 text-lg font-bold leading-3 text-gray-900 sm:text-2xl sm:truncate border-b-2 border-transparent capitalize">
          {t('ProductAlert.Header')}
        </h2>
        <div className="col-span-12 lg:col-span-7 xl:col-span-5 grid grid-cols-5 gap-4">
          <AccountAndMarketplacePicker
            accountClass="col-span-5 sm:col-span-3"
            marketplaceClass="col-span-5 sm:col-start-4 col-span-2 sm:row-start-1"
          />
        </div>
      </div>

      <PageHeader tabs={tabs} />

      <Switch>
        {tabs.map((tab) => {
          const { component: Component } = tab;

          return (
            <Route
              key={tab.path}
              path={tab.path}
              render={() => (
                <Component
                  accountId={account.accountId}
                  marketplace={marketplace.details.countryCode}
                />
              )}
            />
          );
        })}
      </Switch>
    </div>
  );
};

export default ProductAlertManager;
