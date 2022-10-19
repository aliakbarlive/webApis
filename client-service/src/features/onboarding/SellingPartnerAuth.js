import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import qs from 'qs';
import { Button } from 'reactstrap';

const Authorize = ({
  history,
  location,
  userId,
  isAuthorizing,
  authorizeSellerCentral,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.search.includes('spapi_oauth_code')) {
      dispatch(authorizeSellerCentral(qs.parse(location.search.slice(1))));
      window.history.replaceState(null, null, window.location.pathname);
    }
  }, []);

  return (
    <div className="text-center px-4">
      <div className="mb-3">
        <h3>Allow access to your sales data</h3>
        <p>
          To continue the process of allowing BetterSeller to access your sales
          data, click the button bellow to authorize your account.
        </p>
      </div>

      <div className="d-flex flex-column align-items-center">
        {/* <a href="https://sellercentral.amazon.com/apps/authorize/consent?application\_id=amzn1.sellerapps.app.7597f593-4b64-4b95-95ff-95fea5c406ac?version=beta"> */}
        <a
          href={`https://sellercentral.amazon.com/apps/authorize/consent?application_id=amzn1.sellerapps.app.495a349d-7cf4-4cca-bdeb-10583162edea&state=${userId}&version=beta`}
        >
          <Button className="mb-3" color="primary" size="lg">
            {isAuthorizing ? 'Authorizing...' : 'Authorize Selling Partner API'}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default withRouter(Authorize);
