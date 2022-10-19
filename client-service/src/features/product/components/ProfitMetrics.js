import React from 'react';
import { Col, Card, CardBody, Media, Row, Spinner } from 'reactstrap';

import { ShoppingCart, Activity, DollarSign, ShoppingBag } from 'react-feather';
import { currencyFormatter, percentageFormatter } from 'utils/formatters';

const ProfitMetrics = ({ keyMetrics }) => {
  const { orders, units, ppcSpend, profitMargin } = keyMetrics;

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
              <Media body>
                <h3 className="mb-2">
                  {units ? units.toLocaleString() : <Spinner color="primary" />}
                </h3>
                <div className="mb-0">Units</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {profitMargin ? (
                    percentageFormatter(profitMargin)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Profit Margin</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col md="3" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {ppcSpend ? (
                    currencyFormatter(ppcSpend)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">PPC Spend</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfitMetrics;
