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
import MetricsChart from '../shared/MetricsChart';
import Statistics from '../shared/Statistics';
import Loader from 'components/Loader';

const CampaignDetails = (props) => {
  const { campaignId, campaignType } = props.match.params;
  const profile = useSelector(selectCurrentProfile);
  const loading = useSelector(selectLoading);
  const selectedDates = useSelector(selectCurrentDateRange);
  const dispatch = useDispatch();

  const [campaign, setCampaign] = useState({});

  useEffect(() => {
    axios.get(`ppc/${campaignType}/campaigns/${campaignId}`).then((res) => {
      setCampaign(res.data.data);
      dispatch(setLoading(false));
    });
  }, [campaignId]);

  return loading ? (
    <Loader height="50" />
  ) : (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Campaign: {campaign.name}</h3>
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
        url={`ppc/${campaignType}/campaigns/${campaignId}/statistics`}
      />

      <MetricsChart
        selectedDates={selectedDates}
        profileId={profile.advProfileId}
        url={`ppc/${campaignType}/campaigns/${campaignId}/records`}
      ></MetricsChart>

      <div className="tab">
        <Nav tabs>
          <NavItem>
            <NavLink className="active">Negative Keywords</NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab="1">
          <TabPane tabId="1">
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <NegativeKeywords
                      url={`ppc/${campaignType}/campaigns/${campaignId}/negativeKeywords`}
                      selectedDates={selectedDates}
                      keyField="advCampaignNegativeKeywordId"
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

export default CampaignDetails;
