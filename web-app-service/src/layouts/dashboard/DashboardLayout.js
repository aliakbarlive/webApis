import React, { useEffect, useState } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  // HomeIcon,
  ShoppingCartIcon,
  ChatAlt2Icon,
  CubeIcon,
  CurrencyDollarIcon,
  CursorClickIcon,
  MailIcon,
} from '@heroicons/react/outline';

import { selectAuth } from 'features/auth/authSlice';

import {
  selectAccounts,
  setCurrentAccount,
  selectCurrentAccount,
  selectCurrentMarketplace,
  setCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import Header from './components/Header';
import SyncProgress from './SyncProgress';
import PageLoader from 'components/PageLoader';

const DashboardLayout = ({ children, location, history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);
  const accounts = useSelector(selectAccounts);
  const currentAccount = useSelector(selectCurrentAccount);
  const currentMarketplace = useSelector(selectCurrentMarketplace);

  useEffect(() => {
    if (!currentAccount) return;
    const { pathname, search } = location;
    const searchParams = new URLSearchParams(search);
    const currentUrl = `${pathname}?${searchParams.toString()}`;

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
        accounts.find((account) => account.accountId === searchParamsAccount) ??
        currentAccount;

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
      history.push('/subscription');
    }

    const updatedUrl = `${pathname}?${searchParams.toString()}`;
    if (currentUrl !== updatedUrl) {
      history.push(updatedUrl);
    }
  }, [
    dispatch,
    accounts,
    currentAccount,
    currentMarketplace,
    history,
    location,
  ]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarNavigation = [
    {
      name: 'Profit',
      href: '/profit',
      icon: CurrencyDollarIcon,
      module: 'profit',
    },
    {
      name: 'Plan',
      href: '/plan',
      icon: CurrencyDollarIcon,
      module: 'plan',
    },
    {
      name: 'Products',
      href: '/products',
      icon: ShoppingCartIcon,
      module: 'products',
    },
    {
      name: 'Orders',
      href: '/orders',
      icon: CubeIcon,
      module: 'orders',
    },
    {
      name: 'Reviews',
      href: '/reviews',
      icon: ChatAlt2Icon,
      module: 'reviews',
    },
    {
      name: 'Advertising',
      href: '/advertising',
      icon: CursorClickIcon,
      module: 'advertising',
    },
    {
      name: 'Alerts',
      href: '/alerts',
      icon: MailIcon,
      module: 'alerts',
    },
  ];

  const userNavigation = [
    { name: 'Settings', href: '/settings', type: 'link' },
    { name: 'Sign Out', type: 'button' },
  ];

  // * Check if user is email verified
  if (!user.isEmailVerified) {
    return <Redirect to="/email-verification" />;
  }

  // * Check if the current account is selected
  if (!currentAccount) {
    return <PageLoader />;
  }

  // * Check if the current account is onboarding and has a subscription
  if (
    currentAccount &&
    currentAccount.isOnboarding &&
    !currentAccount.subscription
  ) {
    return <Redirect to="/subscription" />;
  }

  // * Check if the current account is onboarding and has a subscription
  if (
    currentAccount &&
    currentAccount.isOnboarding &&
    currentAccount.subscription
  ) {
    return <Redirect to="/onboarding" />;
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarNavigation={sidebarNavigation} />

      {/* Mobile Menu */}
      <MobileMenu
        sidebarNavigation={sidebarNavigation}
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
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              <SyncProgress />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default withRouter(DashboardLayout);
