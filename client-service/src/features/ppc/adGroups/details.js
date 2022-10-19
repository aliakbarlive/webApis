import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { selectLoading, setLoading, selectCurrentProfile } from '../ppcSlice';
import { selectCurrentDateRange } from 'components/datePicker/dateSlice';

import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import DatePicker from 'components/datePicker/DatePicker';
import NegativeKeywords from '../shared/NegativeKeywords';
import NegativeTargets from '../shared/NegativeTargets';
import MetricsChart from '../shared/MetricsChart';
import Statistics from '../shared/Statistics';
import Loader from 'components/Loader';

const AdGroupDetails = (props) => {
  const { adGroupId, campaignType } = props.match.params;
  const profile = useSelector(selectCurrentProfile);
  const loading = useSelector(selectLoading);
  const selectedDates = useSelector(selectCurrentDateRange);
  const dispatch = useDispatch();

  const [adGroup, setAdGroup] = useState({});
  const [activeTab, setActiveTab] = useState('negativeKeywords');
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    axios.get(`ppc/${campaignType}/adGroups/${adGroupId}`).then((res) => {
      setAdGroup(res.data.data);
      dispatch(setLoading(false));
    });
  }, [adGroupId]);

  return loading ? (
    <Loader height="50" />
  ) : (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Ad Group: {adGroup.name}</h3>
            </Col>
            <Col xs="auto">
              <DatePicker />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Statistics
        profileId={profile.advProfileId}
        selectedDates={selectedDates}
        url={`ppc/${campaignType}/adGroups/${adGroupId}/statistics`}
      />

      <MetricsChart
        selectedDates={selectedDates}
        profileId={profile.advProfileId}
        url={`ppc/${campaignType}/adGroups/${adGroupId}/records`}
      ></MetricsChart>

      <div className="tab">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab == 'negativeKeywords' ? 'active' : ''}
              onClick={() => {
                toggle('negativeKeywords');
              }}
            >
              Negative Keywords
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab == 'negativeTargets' ? 'active' : ''}
              onClick={() => {
                toggle('negativeTargets');
              }}
            >
              Negative Targets
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="negativeKeywords">
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <NegativeKeywords
                      url={`ppc/${campaignType}/adGroups/${adGroupId}/negativeKeywords`}
                      selectedDates={selectedDates}
                      keyField="advNegativeKeywordId"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="negativeTargets">
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <NegativeTargets
                      url={`ppc/${campaignType}/adGroups/${adGroupId}/negativeTargets`}
                      selectedDates={selectedDates}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    </Container>
  );
};

export default AdGroupDetails;
