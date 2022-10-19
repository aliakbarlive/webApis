import React from 'react';

import { Col, Card, CardBody, Media, Row, Spinner } from 'reactstrap';
import Chart from 'react-apexcharts';

import { ShoppingCart, Activity, DollarSign, ShoppingBag } from 'react-feather';
import { currencyFormatter } from 'utils/formatters';

const ProfitBreakdown = ({ profitBreakdown }) => {
  const { profit, sales, costs } = profitBreakdown;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Row>
      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {sales ? (
                    formatter.format(sales.sum.total)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Total Sales</div>
              </Media>
            </Media>

            {sales && (
              <Chart
                series={sales.sum.breakdown.map(({ amount }) =>
                  parseFloat(Math.abs(amount))
                )}
                type="donut"
                options={{
                  labels: sales.sum.breakdown.map(({ type }) =>
                    type.match(/[A-Z][a-z]+|[0-9]+/g).join(' ')
                  ),
                  dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                      return val.toFixed(2) + '%';
                    },
                  },
                  legend: {
                    position: 'bottom',
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,
                        },
                      },
                      size: 200,
                    },
                  },
                }}
              />
            )}
          </CardBody>
        </Card>
      </Col>

      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
                <ShoppingBag className="feather-lg text-danger" />
              </div> */}
              <Media body>
                <h3 className="mb-2">
                  {costs ? (
                    formatter.format(Math.abs(costs.sum.total))
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Total Costs</div>
              </Media>
            </Media>

            {costs && (
              <Chart
                series={costs.sum.breakdown.map(
                  ({ amount }) => parseFloat(amount) * -1
                )}
                type="donut"
                options={{
                  labels: costs.sum.breakdown.map(({ type }) =>
                    type.match(/[A-Z][a-z]+|[0-9]+/g).join(' ')
                  ),
                  dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                      return val.toFixed(2) + '%';
                    },
                  },
                  legend: {
                    position: 'bottom',
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,
                        },
                      },
                      size: 200,
                    },
                  },
                }}
              />
            )}
          </CardBody>
        </Card>
      </Col>

      <Col md="4" xl>
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              {/* <div className="d-inline-block mt-2 mr-3">
              <DollarSign className="feather-lg text-success" />
            </div> */}
              <Media body>
                <h3 className="mb-2">
                  {profit ? (
                    formatter.format(profit.sum.total)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Profit</div>
              </Media>
            </Media>

            {profit && (
              <Chart
                series={[
                  parseFloat(Math.abs(costs.sum.total)),
                  parseFloat(profit.sum.total),
                ]}
                type="donut"
                options={{
                  labels: ['Costs', 'Profit'],
                  dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                      return val.toFixed(2) + '%';
                    },
                  },
                  legend: {
                    position: 'bottom',
                  },
                  plotOptions: {
                    pie: {
                      donut: {
                        labels: {
                          show: true,
                        },
                      },
                      size: 200,
                    },
                  },
                }}
              />
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfitBreakdown;
