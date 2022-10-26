import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Navigations from './components/Navigations';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

import { selectAuthenticatedUser } from 'features/auth/authSlice';
import Header from 'layouts/components/Header';

const AccountLayout = ({ children }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useSelector(selectAuthenticatedUser);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  const userNavigation = [
    { name: t('Dashboard.Settings'), href: '/settings', type: 'link' },
    { name: t('Dashboard.SignOut'), type: 'button' },
  ];

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
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountLayout;
