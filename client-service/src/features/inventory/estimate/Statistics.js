import React from 'react';
import { Col, Card, CardBody, Media, Row, Spinner } from 'reactstrap';

import { ShoppingCart, Activity, DollarSign, ShoppingBag } from 'react-feather';
import { currencyFormatter } from 'utils/formatters';

const Statistics = ({ summary }) => {
  return (
    <Row>
      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {summary ? (
                    currencyFormatter(summary.estTotalSales)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Total Estimated Sales</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {summary ? (
                    currencyFormatter(summary.estTotalCogs)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Total Estimated COG Value</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {summary ? (
                    currencyFormatter(summary.estTotalProfit)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Total Estimated Profit</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
