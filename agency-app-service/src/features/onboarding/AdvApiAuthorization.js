import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import qs from 'qs';

import { CursorClickIcon } from '@heroicons/react/solid';

import { authorizeAdvApiAsync } from './onboardingSlice';

const AdvApiAuthorization = ({ location, isAuthorizing, setActiveStep }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const redirectUrl = window.location.hostname + window.location.pathname;

    if (
      location.search.includes('campaign_management') &&
      location.search.includes('code')
    ) {
      dispatch(
        authorizeAdvApiAsync(qs.parse(location.search.slice(1)), redirectUrl)
      ).then((response) => {
        if (response) setActiveStep(2);
      });

      window.history.replaceState(null, null, window.location.pathname);
    }
  }, [dispatch, location.search]);

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Connect your Advertising Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          To get started, we'll fetch the past 18 months of product and sales
          data. We'll also sync new data throughout the day.
        </p>
      </div>

      <div className="mt-8 p-8 text-center border border-gray-200 border-dotted rounded-lg">
        <CursorClickIcon className="mx-auto h-12 w-12 text-red-500" />
        <p className="mt-4 text-sm text-gray-500">
          Click the button below to authorize BetterSeller to access your
          advertising data from Amazon.
        </p>
        <div className="mt-6">
          <a
            href={`https://www.amazon.com/ap/oa?client_id=${process.env.REACT_APP_ADV_API_CLIENT_ID}&scope=advertising::campaign_management&response_type=code&redirect_uri=${process.env.REACT_APP_CLIENT_ADV_API_REDIRECT_URL}`}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isAuthorizing ? 'Authorizing..' : 'Login with Amazon'}
          </a>
        </div>
      </div>
    </>
  );
};

export default withRouter(AdvApiAuthorization);
