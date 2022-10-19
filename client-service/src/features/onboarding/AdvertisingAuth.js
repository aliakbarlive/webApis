import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import qs from 'qs';
import { Button } from 'reactstrap';

const AdvertisingAuth = ({
  history,
  location,
  userId,
  isAuthorizing,
  authorizeAdvAPI,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.search.includes('cpc_advertising')) {
      dispatch(authorizeAdvAPI(qs.parse(location.search.slice(1))));
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  return (
    <div className="text-center px-4">
      <div className="mb-3">
        <h3>Allow access to your advertising data</h3>
        <p>
          To continue the process of allowing BetterSeller to access your
          advertising data, click the button bellow to authorize your account.
        </p>
      </div>

      <div className="d-flex flex-column align-items-center">
        {/* <a href="https://sellercentral.amazon.com/apps/authorize/consent?application\_id=amzn1.sellerapps.app.7597f593-4b64-4b95-95ff-95fea5c406ac?version=beta"> */}
        <a
          href={`https://www.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.3dbfb141c24d487abe3521225a059220&scope=cpc_advertising:campaign_management&response_type=code&redirect_uri=https://local.stalliondirect.com/onboarding`}
        >
          <Button className="mb-3" color="primary" size="lg">
            {isAuthorizing ? 'Authorizing...' : 'Authorize Advertising API'}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default withRouter(AdvertisingAuth);
