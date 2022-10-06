import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, useParams } from 'react-router-dom';

import Loader from 'react-loader-spinner';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
  setCurrentAccount,
  setCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { selectAuthenticatedUser } from 'features/auth/authSlice';

import Navigations from '../agency/components/Navigations';
import AccountError from './components/AccountError';
import Header from 'layouts/components/Header';

const AccountLayout = ({ children, history }) => {
  const dispatch = useDispatch();
  const { accountId } = useParams();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useSelector(selectAuthenticatedUser);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const userNavigation = [
    { name: t('Dashboard.Settings'), href: '/settings', type: 'link' },
    { name: t('Dashboard.SignOut'), type: 'button' },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);

    const fetchAccount = async () => {
      setLoading(true);
      const accountNeedsRefresh =
        !account || (account && account.accountId !== accountId);

      const marketplaceNeedRefresh =
        !searchParams.has('marketplace') ||
        !marketplace ||
        (marketplace &&
          searchParams.has('marketplace') &&
          marketplace.details.countryCode !== searchParams.get('marketplace'));

      let accountReference = account;

      if (accountNeedsRefresh) {
        const response = await axios.get(`/accounts/${accountId}`);
        accountReference = response.data.data;

        if (accountReference.marketplaces.length === 0) {
          throw new Error('No Marketplace found on this account.');
        }

        dispatch(setCurrentAccount(accountReference));
      }

      if (marketplaceNeedRefresh) {
        if (
          !searchParams.has('marketplace') ||
          (searchParams.has('marketplace') &&
            !accountReference.marketplaces.some(
              (marketplace) =>
                marketplace.details.countryCode ===
                searchParams.get('marketplace')
            ))
        ) {
          searchParams.set(
            'marketplace',
            accountReference.marketplaces[0].details.countryCode
          );
        }

        const marketplace = accountReference.marketplaces.find(
          (marketplace) =>
            marketplace.details.countryCode === searchParams.get('marketplace')
        );

        dispatch(setCurrentMarketplace(marketplace));

        history.replace({ search: searchParams.toString() });
      }

      setLoading(false);
    };

    fetchAccount().catch((err) => {
      setLoading(false);
      if (err.response) {
        setError(
          err.response.status < 500
            ? err.response.data.message
            : 'Whoops! Something went wrong'
        );
        return;
      }
      setError(err.message);
    });
  }, [dispatch, accountId, account, marketplace, history]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Navigations
        user={user}
        account={account}
        marketplace={marketplace}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          setMobileMenuOpen={setMobileMenuOpen}
          userNavigation={userNavigation}
        />

        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {loading ? (
            <div className="h-full flex justify-center items-center">
              <Loader type="Oval" color="#EF4444" height={80} width={80} />
            </div>
          ) : (
            <div className="py-6">
              <div className="mx-auto px-4 sm:px-6 md:px-8">
                {error ? <AccountError message={error} /> : children}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default withRouter(AccountLayout);
