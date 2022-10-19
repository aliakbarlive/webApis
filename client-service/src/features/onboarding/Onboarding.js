import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import {
  selectUser,
  selectIsAuthorizing,
  authorizeSellerCentral,
  authorizeAdvAPI,
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

const Onboarding = ({ match }) => {
  const user = useSelector(selectUser);
  const isAuthorizing = useSelector(selectIsAuthorizing);
  const {
    isEmailVerified,
    isSPAPIAuthorized,
    isAdvAPIAuthorized,
    email,
    userId,
  } = user;

  useEffect(() => {
    if (isEmailVerified && isSPAPIAuthorized && isAdvAPIAuthorized) {
      setActiveTab('4');
    } else if (isEmailVerified && isSPAPIAuthorized) {
      setActiveTab('3');
    } else if (isEmailVerified) {
      setActiveTab('2');
    }
  }, [isEmailVerified, isSPAPIAuthorized, isAdvAPIAuthorized]);

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
                    complete: isEmailVerified,
                  })}
                  disabled={activeTab !== '1'}
                >
                  <h5>Step 1</h5>
                  <span>Verify Email</span>
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
                <EmailVerify email={email} />
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

export default Onboarding;
