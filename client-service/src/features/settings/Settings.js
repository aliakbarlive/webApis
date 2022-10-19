import React from 'react';
import { Card, Col, Container, ListGroup, Row } from 'reactstrap';

import { Switch, Route, Redirect, NavLink } from 'react-router-dom';

import Accounts from './Accounts';
import Profile from './Profile';

const Navigation = () => (
  <Card>
    <ListGroup flush>
      <NavLink
        to="/settings/profile"
        className="list-group-item-action list-group-item"
      >
        Profile
      </NavLink>
      <NavLink
        to="/settings/accounts"
        className="list-group-item-action list-group-item"
      >
        Amazon Accounts
      </NavLink>
    </ListGroup>
  </Card>
);

const Settings = () => (
  <Container fluid className="p-0">
    <h1 className="h3 mb-3">Settings</h1>

    <Row>
      <Col md="3" xl="2">
        <Navigation />
      </Col>
      <Col md="9" xl="10">
        <Switch>
          <Route
            exact
            path="/settings"
            render={() => <Redirect to="/settings/profile" />}
          />
          <Route exact path="/settings/profile" component={Profile} />
          <Route exact path="/settings/accounts" component={Accounts} />
        </Switch>
      </Col>
    </Row>
  </Container>
);

export default Settings;
