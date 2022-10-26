import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import { selectIsAuthorizing } from './onboardingSlice';

import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import SpApiAuthorization from './SpApiAuthorization';
import AdvApiAuthorization from './AdvApiAuthorization';
import DefaultMarketplace from './DefaultMarketplace';

import AccountName from './AccountName';
import Steps from './Steps';
import Complete from './Complete';
import { Redirect } from 'react-router';
import PageLoader from 'components/PageLoader';

const Onboarding = () => {
  const user = useSelector(selectAuthenticatedUser);
  const account = useSelector(selectCurrentAccount);
  const isAuthorizing = useSelector(selectIsAuthorizing);
  const [activeStep, setActiveStep] = useState(3);

  useEffect(() => {
    const hasSPAPICredentials =
      account && account.credentials.some(({ service }) => service === 'spApi');
    const hasAdvAPICredentials =
      account &&
      account.credentials.some(({ service }) => service === 'advApi');
    const hasDefaultMarketplace =
      account && account.marketplaces.some(({ isDefault }) => isDefault);

    if (!account || !hasSPAPICredentials) {
      setActiveStep(0);
    } else if (hasDefaultMarketplace) {
      setActiveStep(3);
    } else if (
      hasSPAPICredentials &&
      hasAdvAPICredentials &&
      account.name !== 'Unnamed Account'
    ) {
      setActiveStep(2);
      // } else if (hasSPAPICredentials && hasAdvAPICredentials) {
      //   setActiveStep(1);
    } else if (hasSPAPICredentials || !hasAdvAPICredentials) {
      setActiveStep(1);
    }
  }, [account]);

  // * Comment
  // * Check if the current account is onboarding and doesn't have a subscription
  if (
    account &&
    account.name !== 'free' &&
    account.isOnboarding &&
    !account.subscription
  ) {
    return <Redirect to="/subscription" />;
  }

  // * Check if the current account is finished with onboarding
  if (account && !account.isOnboarding) {
    return <Redirect to="/plan" />;
  }

  return (
    <OnboardingLayout>
      {!account ? (
        <PageLoader />
      ) : (
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <Steps activeStep={activeStep} setActiveStep={setActiveStep} />
          <div className="mt-8 bg-white py-12 px-12 shadow sm:rounded-lg">
            {activeStep === 0 && (
              <SpApiAuthorization
                accountId={account.accountId}
                userId={user.userId}
                isAuthorizing={isAuthorizing}
                setActiveStep={setActiveStep}
              />
            )}

            {activeStep === 1 && (
              <AdvApiAuthorization
                isAuthorizing={isAuthorizing}
                setActiveStep={setActiveStep}
              />
            )}

            {/* {activeStep === 2 && (
              <AccountName account={account} setActiveStep={setActiveStep} />
            )} */}

            {activeStep === 2 && (
              <DefaultMarketplace
                account={account}
                marketplaces={account ? account.marketplaces : []}
              />
            )}

            {activeStep === 3 && <Complete />}
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
};

export default Onboarding;
