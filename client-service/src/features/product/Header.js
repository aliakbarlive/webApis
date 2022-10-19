import React from 'react';

import { Card, CardBody, Row, Col } from 'reactstrap';
import DatePicker from 'components/datePicker/DatePicker';

const Header = ({ title, fixDate }) => (
  <Card className="bg-gradient">
    <CardBody>
      <Row className="justify-content-end">
        <Col xs="auto">
          <DatePicker />
        </Col>
      </Row>
    </CardBody>
  </Card>
);

export default Header;
