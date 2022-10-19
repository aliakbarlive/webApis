import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
} from 'reactstrap';
import { fetchClientById } from './agencyClientsSlice';
import { useParams } from 'react-router';
import Details from 'components/agencyClient/profile/Details';
import Subscription from 'components/agencyClient/profile/Subscription';
import Invoices from 'components/agencyClient/profile/Invoices';
import RecentActivities from 'components/agencyClient/profile/RecentActivities';
import Commissions from 'components/agencyClient/profile/Commissions';

const AgencyClientProfile = ({ history }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { agencyClient, clientLoaded } = useSelector(
    (state) => state.agencyClients
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClientById(id));
  }, []);

  return (
    <Container fluid className="p-0">
      {clientLoaded ? (
        <div>
          <Card className="bg-primary">
            <CardBody>
              <Row>
                <Col xs={12}>
                  <h3 className={'text-capitalize text-white'}>
                    {agencyClient.client}
                  </h3>
                </Col>
              </Row>
              <Row className={'text-white'}>
                <Col lg={10}>
                  <Row>
                    <Col lg={2}>Contact Name:</Col>
                    <Col lg={9} className={'font-weight-bold pl-4 pl-lg-0'}>
                      {agencyClient.defaultContact.firstName}&nbsp;
                      {agencyClient.defaultContact.lastName}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={2}>Contact Email:</Col>
                    <Col lg={9} className={'font-weight-bold pl-4 pl-lg-0'}>
                      {agencyClient.defaultContact.email}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1' })}
                onClick={() => {
                  toggle('1');
                }}
              >
                Details
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2' })}
                onClick={() => {
                  toggle('2');
                }}
              >
                Subscription
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '5' })}
                onClick={() => {
                  toggle('5');
                }}
              >
                Commissions
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3' })}
                onClick={() => {
                  toggle('3');
                }}
              >
                Invoice History
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4' })}
                onClick={() => {
                  toggle('4');
                }}
              >
                Recent Activities
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col>
                  <Details agencyClient={agencyClient} />
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                <Col>
                  {agencyClient ? (
                    <Subscription
                      subscriptionId={agencyClient.Subscription.subscriptionId}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="3">
              <Row>
                <Col>
                  {agencyClient ? (
                    <Invoices
                      subscriptionId={agencyClient.Subscription.subscriptionId}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="4">
              <Row>
                <Col>
                  {agencyClient ? (
                    <RecentActivities
                      subscriptionId={agencyClient.Subscription.subscriptionId}
                    />
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </TabPane>
            <TabPane tabId="5">
              <Row>
                <Col>
                  {agencyClient && agencyClient.accountId ? (
                    <Commissions
                      subscriptionId={agencyClient.Subscription.subscriptionId}
                    />
                  ) : (
                    <Card>
                      <CardBody className={'text-warning p-auto p-lg-5'}>
                        Please authorize your Seller Central account to use this
                        module
                      </CardBody>
                    </Card>
                  )}
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </div>
      ) : (
        'loading...'
      )}
    </Container>
  );
};

export default AgencyClientProfile;
