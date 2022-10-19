import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

import qs from 'qs';
import { Button } from 'reactstrap';
import { selectHostedPageUrl } from './onboardingSlice';

const NewSubscription = ({
  history,
  location,
  agencyClient,
  isAuthorizing,
  isSubscribing,
  createZohoSubscription,
}) => {
  const { hostedPage, hasNewHostedPage } = useSelector(
    (state) => state.onboarding
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (agencyClient && !agencyClient.Subscription) {
      dispatch(createZohoSubscription(agencyClient.hostedpageDetails));
    }
  }, [agencyClient]);

  useEffect(() => {
    // if (hasNewHostedPage) {
    //   console.log(hasNewHostedPage, 'yaep');
    //   console.log(hostedPage);
    // }
  }, [hostedPage, hasNewHostedPage]);

  return (
    <div className="text-center px-4">
      <div className="mb-3">
        <h3>New Subscription</h3>
        <p>
          To continue logging into BetterSeller, click the button below to
          create a new subscription. You will need to input your payment details
        </p>
      </div>

      <div className="d-flex flex-column align-items-center">
        <a href={isSubscribing ? '' : hostedPage.url}>
          <Button className="mb-3" color="primary" size="lg">
            {isAuthorizing
              ? 'Initializing...'
              : isSubscribing
              ? 'Verifying Subscription...'
              : 'Start My Subscription'}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default withRouter(NewSubscription);
