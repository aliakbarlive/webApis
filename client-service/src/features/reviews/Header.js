import React from 'react';

import { Card, CardBody, Row, Col } from 'reactstrap';

const Header = ({ title }) => (
  <Card className="bg-gradient">
    <CardBody>
      <Row className="align-items-center">
        <Col>
          <h3 className="mb-0 text-white">{title}</h3>
        </Col>
      </Row>
    </CardBody>
  </Card>
);

export default Header;
