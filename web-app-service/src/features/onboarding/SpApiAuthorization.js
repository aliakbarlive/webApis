import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

import { ShoppingBagIcon } from '@heroicons/react/outline';

import { authorizeSpApiAsync } from './onboardingSlice';

const SpApiAuthorization = ({
  location,
  userId,
  isAuthorizing,
  accountId,
  setActiveStep,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.search.includes('spapi_oauth_code')) {
      dispatch(authorizeSpApiAsync(qs.parse(location.search.slice(1))));
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [dispatch, location.search]);

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Connect your Amazon Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          To get started, we'll fetch the past 18 months of product and sales
          data. We'll also sync new data throughout the day.
        </p>
      </div>

      <div className="mt-8 p-8 text-center border border-gray-200 border-dotted rounded-lg">
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 text-sm text-gray-500">
          Click the button below to authorize BetterSeller to access your data
          from Amazon.
        </p>
        <div className="mt-6">
          <a
            href={`https://sellercentral.amazon.com/apps/authorize/consent?application_id=${process.env.REACT_APP_SP_API_CLIENT_ID}&state=${accountId}&redirect_uri=${process.env.REACT_APP_SP_API_REDIRECT_URL}&version=beta`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isAuthorizing ? 'Authorizing..' : 'Login with Amazon'}
          </a>
        </div>
      </div>
    </>
  );
};

export default withRouter(SpApiAuthorization);
