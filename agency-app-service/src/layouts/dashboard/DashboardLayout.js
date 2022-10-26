import React, { useState, useEffect } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import {
  selectAccountList,
  setCurrentAccount,
  selectCurrentAccount,
  selectCurrentMarketplace,
  setCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import PageLoader from 'components/PageLoader';
import Navigations from 'layouts/agency/components/Navigations';
import usePermissions from 'hooks/usePermissions';
import Header from 'layouts/components/Header';

const DashboardLayout = ({ children, location, history }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { isApplicationLevel } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector(selectAuthenticatedUser);
  const accounts = useSelector(selectAccountList);
  const currentAccount = useSelector(selectCurrentAccount);
  const currentMarketplace = useSelector(selectCurrentMarketplace);

  useEffect(() => {
    if (!currentAccount) return;
    const { search } = location;
    const searchParams = new URLSearchParams(search);
    const currentQuery = searchParams.toString();

    const searchParamsAccount = searchParams.get('account');
    const searchParamsMarketplace = searchParams.get('marketplace');

    // If there is no account in the query.
    if (!searchParams.has('account') && currentAccount) {
      searchParams.set('account', currentAccount.accountId);
    }

    // If there is no marketplace in the query.
    if (!searchParams.has('marketplace') && currentMarketplace) {
      searchParams.set('marketplace', currentMarketplace.details.countryCode);
    }

    // If there is account in the query but different from the current account.
    if (
      searchParamsAccount &&
      searchParamsAccount !== currentAccount.accountId
    ) {
      const account =
        accounts.rows.find(
          (account) => account.accountId === searchParamsAccount
        ) ?? currentAccount;

      searchParams.set('account', account.accountId);
      dispatch(setCurrentAccount(account));
    }

    // If there is marketplace in the query.
    if (searchParamsMarketplace) {
      const marketplace =
        currentAccount.marketplaces.find(
          (marketplace) =>
            marketplace.details.countryCode === searchParamsMarketplace
        ) ?? currentMarketplace;

      searchParams.set('marketplace', marketplace.details.countryCode);
      if (marketplace !== currentMarketplace) {
        dispatch(setCurrentMarketplace(marketplace));
      }
    }

    if (
      currentAccount &&
      currentAccount.isOnboarding &&
      !currentAccount.subscription
    ) {
      console.log('to subscription');
      history.push('/subscription');
    }

    if (currentQuery !== searchParams.toString()) {
      history.replace({ search: searchParams.toString() });
    }
  }, [dispatch, accounts, currentAccount, currentMarketplace]);

  const userNavigation = [
    { name: t('Dashboard.Settings'), href: '/settings', type: 'link' },
    { name: t('Dashboard.SignOut'), type: 'button' },
  ];

  // * Check if the current account is selected
  if (isApplicationLevel() && !currentAccount) {
    return <PageLoader />;
  }

  // * Check if the current account is onboarding and has a subscription
  if (
    isApplicationLevel() &&
    currentAccount.isOnboarding &&
    !currentAccount.subscription
  ) {
    return <Redirect to="/subscription" />;
  }

  // * Check if the current account is onboarding and has a subscription
  if (
    isApplicationLevel() &&
    currentAccount.isOnboarding &&
    currentAccount.subscription
  ) {
    if (
      currentAccount.AgencyClient.draftMarketplace === null ||
      currentAccount.AgencyClient.draftMarketplace === 'A2EUQ1WTGCTBG2' ||
      currentAccount.AgencyClient.draftMarketplace === 'ATVPDKIKX0DER'
    ) {
      history.push('/onboarding');
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Navigations
        user={user}
        account={currentAccount}
        marketplace={currentMarketplace}
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
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(DashboardLayout);
