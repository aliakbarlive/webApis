import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { selectCurrentAccount, updateAccount } from '../accounts/accountsSlice';
import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';
import Spinner from 'components/Spinner';
import { setAppNotification } from 'features/appNotifications/appNotificationSlice';

const Confirmation = ({ location }) => {
  const dispatch = useDispatch();
  const currentAccount = useSelector(selectCurrentAccount);

  // * Check if hostedpage_id is part of the query parameters
  useEffect(() => {
    const createSubscriptionAsync = async (hostedPageId) => {
      try {
        const res = await axios({
          method: 'POST',
          url: 'subscriptions',
          params: {
            accountId: currentAccount.accountId,
            hostedPageId,
          },
        });

        dispatch(updateAccount(res.data.data));
      } catch (error) {
        dispatch(
          setAppNotification(
            'error',
            'Unable to confirm subscription',
            error.response.data.message
          )
        );
      }
    };

    if (
      currentAccount &&
      !currentAccount.subscription &&
      location.search.includes('hostedpage_id')
    ) {
      const hostedPageId = qs.parse(location.search.slice(1)).hostedpage_id;

      createSubscriptionAsync(hostedPageId);
    }
  }, [location.search, currentAccount, dispatch]);

  // * Check if the current account is onboarding and has a subscription
  if (
    currentAccount &&
    currentAccount.isOnboarding &&
    currentAccount.subscription
  ) {
    return <Redirect to="/onboarding" />;
  }

  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
          {currentAccount && !currentAccount.subscription ? (
            <>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Confirming your subscription
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please wait while we confirm your subscription status
              </p>
              <div className="mt-5 flex justify-center">
                <Spinner width={80} height={80} />
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Your subscription is confirmed
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please click the button below to begin setting up your account{' '}
              </p>
              <div className="mt-6">
                <Link
                  to={`/onboarding`}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Proceed to Onboarding
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default withRouter(Confirmation);
