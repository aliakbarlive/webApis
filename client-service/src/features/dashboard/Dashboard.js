import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectStats,
  getStatsAsync,
  getRefundsAsync,
  selectRefunds,
} from './dashboardSlice';
import { selectAuthenticatedUser } from '../auth/authSlice';
import { selectCurrentDateRange } from '../../components/datePicker/dateSlice';

import authorize from '../../utils/authorize';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment';

// import Appointments from './Appointments';
import LineChart from './LineChart';
import Statistics from './Statistics';
// import Orders from './Orders';

const Dashboard = () => {
  const stats = useSelector(selectStats);
  const authenticatedUser = useSelector(selectAuthenticatedUser);
  const selectedDates = useSelector(selectCurrentDateRange);
  const refunds = useSelector(selectRefunds);
  const dispatch = useDispatch();

  const isClient = authorize(authenticatedUser, ['client', 'client-premium']);

  useEffect(() => {
    if (isClient) {
      dispatch(getStatsAsync(selectedDates));
      dispatch(getRefundsAsync(selectedDates));
    }
  }, [selectedDates]);

  return isClient ? (
    <Container fluid className="p-0">
      {/* <Header /> */}
      <LineChart />
      <Row>
        <Col>
          <Statistics stats={stats} refunds={refunds} />
        </Col>
      </Row>
      <Row>
        <Col>{/* <Orders dateRange={selectedDates} /> */}</Col>
      </Row>
    </Container>
  ) : (
    'Admin Dashboard here'
  );
};

export default Dashboard;
