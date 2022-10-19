import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { startCase } from 'lodash';

import { selectCampaignType, selectCurrentProfile } from './ppcSlice';
import { selectCurrentDateRange } from 'components/datePicker/dateSlice';

import { Container, Row, Col, Card, CardBody, Nav, NavItem } from 'reactstrap';

import DatePicker from 'components/datePicker/DatePicker';
import MetricsChart from './shared/MetricsChart';
import Statistics from './shared/Statistics';

import Campaigns from './campaigns/list';
import AdGroups from './adGroups/list';
import SearchTerms from './SearchTerms';
import Keywords from './Keywords';
import Products from './Products';
import Targets from './Targets';

const SUB_ROUTES = [
  {
    url: 'campaigns',
    component: Campaigns,
  },
  {
    url: 'ad-groups',
    component: AdGroups,
  },
  {
    url: 'search-terms',
    component: SearchTerms,
    visibility: ['sp'],
  },
  {
    url: 'keywords',
    component: Keywords,
    visibility: ['sp', 'sb'],
  },
  {
    url: 'products',
    component: Products,
    visibility: ['sp', 'sd'],
  },
  {
    url: 'targets',
    component: Targets,
    visibility: ['sp', 'sd'],
  },
];

const Dashboard = () => {
  const profile = useSelector(selectCurrentProfile);
  const campaignType = useSelector(selectCampaignType);
  const selectedDates = useSelector(selectCurrentDateRange);

  const [subRoutes, setSubRoutes] = useState([]);

  useEffect(() => {
    const routes = SUB_ROUTES.filter((route) =>
      'visibility' in route ? route.visibility.includes(campaignType.key) : true
    );

    setSubRoutes(routes);
  }, [campaignType]);

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">{campaignType.display}</h3>
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
        url={`/ppc/${campaignType.key}/statistics`}
      />

      <MetricsChart
        selectedDates={selectedDates}
        profileId={profile.advProfileId}
        url={`ppc/${campaignType.key}/campaigns/records`}
      ></MetricsChart>

      <div className="tab">
        <Nav tabs>
          {subRoutes.map((route) => (
            <NavItem key={route.url}>
              <NavLink
                className="nav-link"
                to={`/ppc/${campaignType.key}/${route.url}`}
              >
                {startCase(route.url)}
              </NavLink>
            </NavItem>
          ))}
        </Nav>

        <div className="tab-content">
          <Card>
            <CardBody>
              <Switch>
                <Route
                  exact
                  path={`/ppc/${campaignType.key}`}
                  render={() => (
                    <Redirect to={`/ppc/${campaignType.key}/campaigns`} />
                  )}
                />
                {subRoutes.map((route) => (
                  <Route
                    key={route.url}
                    path={`/ppc/${campaignType.key}/${route.url}`}
                    component={route.component}
                  />
                ))}
              </Switch>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
