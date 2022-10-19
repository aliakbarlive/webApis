import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthorizing,
  authorizeSellerCentral,
  authorizeAdvAPI,
  getAgencySubscription,
  selectAgencyClient,
  createZohoSubscription,
  hasAgencySubscription,
} from 'features/onboarding/onboardingSlice';

import {
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
} from 'reactstrap';
import classnames from 'classnames';

import Logo from 'components/Logo';
import EmailVerify from './EmailVerify';
import SellingPartnerAuth from './SellingPartnerAuth';
import AdvertisingAuth from './AdvertisingAuth';
import Finish from './Finish';
import NewSubscription from './NewSubscription';
import { useInterval } from 'utils/useInterval';

const OnboardingAgency = ({ match }) => {
  const user = useSelector(selectUser);
  const isAuthorizing = useSelector(selectIsAuthorizing);
  const agencyClient = useSelector(selectAgencyClient);
  const { isSPAPIAuthorized, isAdvAPIAuthorized, userId } = user;
  const dispatch = useDispatch();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [delay, setDelay] = useState(3000);
  const { hasSubscription } = useSelector((state) => state.onboarding);
  let search = window.location.search;
  let params = new URLSearchParams(search);
  let isSubscribing = params.get('hostedpage_id') ? true : false;

  useEffect(() => {
    if (!agencyClient) {
      dispatch(getAgencySubscription());
    } else {
      setIsSubscribed(agencyClient.Subscription ? true : false);
    }
  }, [agencyClient]);

  useEffect(() => {
    if (isSubscribed && isSPAPIAuthorized && isAdvAPIAuthorized) {
      setActiveTab('4');
    } else if (isSubscribed && isSPAPIAuthorized) {
      setActiveTab('3');
    } else if (isSubscribed) {
      setActiveTab('2');
    } else {
    }
  }, [isSubscribed, isSPAPIAuthorized, isAdvAPIAuthorized]);

  useInterval(async () => {
    console.log(isSubscribing);
    if (isSubscribing) {
      console.log('checking subscription');
      if (!hasSubscription) {
        dispatch(hasAgencySubscription());
      } else {
        if (!hasSubscription.success) {
          dispatch(hasAgencySubscription());
        } else {
          setIsSubscribed(true);
          setDelay(null);
        }
      }
    } else {
      setDelay(null);
    }
  }, delay);

  const [activeTab, setActiveTab] = useState('1');

  return (
    <React.Fragment>
      <Logo />

      <Card>
        <CardBody>
          <div className="mb-4">
            <Nav tabs className="onboarding">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '1',
                    complete: isSubscribed,
                  })}
                  disabled={activeTab !== '1'}
                >
                  <h5>Step 1</h5>
                  <span>Subscribe</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '2',
                    complete: isSPAPIAuthorized,
                  })}
                  disabled={activeTab !== '2'}
                >
                  <h5>Step 2</h5>
                  <span>Sales</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '3',
                    complete: isAdvAPIAuthorized,
                  })}
                  disabled={activeTab !== '3'}
                >
                  <h5>Step 3</h5>
                  <span>Advertising</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: activeTab === '4',
                  })}
                  disabled={activeTab !== '4'}
                >
                  <h5>Step 4</h5>
                  <span>Finish</span>
                </NavLink>
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane tabId="1">
                <NewSubscription
                  agencyClient={agencyClient}
                  isAuthorizing={isAuthorizing}
                  isSubscribing={isSubscribing}
                  createZohoSubscription={createZohoSubscription}
                />
              </TabPane>

              <TabPane tabId="2">
                <SellingPartnerAuth
                  userId={userId}
                  isAuthorizing={isAuthorizing}
                  authorizeSellerCentral={authorizeSellerCentral}
                />
              </TabPane>
              <TabPane tabId="3">
                <AdvertisingAuth
                  userId={userId}
                  isAuthorizing={isAuthorizing}
                  authorizeSellerCentral={authorizeSellerCentral}
                  authorizeAdvAPI={authorizeAdvAPI}
                />
              </TabPane>
              <TabPane tabId="4">
                <Finish />
              </TabPane>
            </TabContent>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default OnboardingAgency;
