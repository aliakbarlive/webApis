import React, { useState } from 'react';
import Header from './components/Header';

const OnboardingLayout = ({ children }) => {
  const [setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <Header setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main content */}
        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8 flex-grow bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
