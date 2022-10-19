import React from 'react';
import { Col, Card, CardBody, Media, Row, Spinner } from 'reactstrap';

import { ShoppingCart, Activity, DollarSign, ShoppingBag } from 'react-feather';
import { currencyFormatter } from 'utils/formatters';

const Statistics = ({ stats, refunds }) => {
  const { orders, units, sales } = stats;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Row>
      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
              <ShoppingCart className="feather-lg" />
            </div> */}
              <Media body>
                <h3 className="mb-2">
                  {sales ? (
                    formatter.format(sales.amount)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Sales</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
                <ShoppingBag className="feather-lg text-danger" />
              </div> */}
              <Media body>
                <h3 className="mb-2">
                  {orders ? (
                    orders.toLocaleString()
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Orders</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
              <DollarSign className="feather-lg text-success" />
            </div> */}
              <Media body>
                <h3 className="mb-2">
                  {units ? units.toLocaleString() : <Spinner color="primary" />}
                </h3>
                <div className="mb-0">Units Sold</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
              <DollarSign className="feather-lg text-success" />
            </div> */}
              <Media body>
                <h3 className="mb-2">
                  {refunds ? (
                    currencyFormatter(refunds.total)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Refunds</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
