import Header from 'layouts/components/Header';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const OnboardingLayout = ({ children }) => {
  const { t } = useTranslation();
  const [setMobileMenuOpen] = useState(false);
  const userNavigation = [{ name: t('Dashboard.SignOut'), type: 'button' }];

  return (
    <div className="h-screen bg-gray-50 flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <Header
          userNavigation={userNavigation}
          setMobileMenuOpen={setMobileMenuOpen}
          isOnboarding={true}
        />

        {/* Main content */}
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 flex-grow bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
