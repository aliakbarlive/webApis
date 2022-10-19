import React, { useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../auth/accountSlice';

import {
  setCampaignType,
  setCurrentProfile,
  selectCurrentProfile,
} from './ppcSlice';

import Dashboard from './Dashboard';
import CampaignDetails from './campaigns/details';
import AdGroupDetails from './adGroups/details';

const PPC = (props) => {
  const { campaignType } = props.match.params;

  const currentMarketPlace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);
  const currentProfile = useSelector(selectCurrentProfile);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!['sp', 'sb', 'sd'].includes(campaignType)) {
      props.history.push('/ppc/sp');
      return;
    }

    dispatch(setCampaignType(campaignType));
  }, [campaignType]);

  useEffect(() => {
    if (currentMarketPlace && currentAccount.advProfiles.length) {
      const profile = currentAccount.advProfiles.find(
        (profile) => profile.marketplaceId == currentMarketPlace.marketplaceId
      );
      dispatch(setCurrentProfile(profile));
    }
  }, [currentMarketPlace, currentAccount]);

  return currentProfile ? (
    <Switch>
      <Route
        exact
        path="/ppc/:campaignType/campaigns/:campaignId"
        component={CampaignDetails}
      />
      <Route
        exact
        path="/ppc/:campaignType/ad-groups/:adGroupId"
        component={AdGroupDetails}
      />
      <Route path={`/ppc/:campaignType`} component={Dashboard} />
    </Switch>
  ) : (
    'No advertising profile found in this marketplace'
  );
};

export default withRouter(PPC);
