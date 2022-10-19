import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getStatsAsync, selectStats, selectCampaignType } from '../ppcSlice';

import { Col, Card, CardBody, Media, Row, Spinner } from 'reactstrap';

import {
  currencyFormatter,
  percentageFormatter,
  numberFormatter,
} from 'utils/formatters';

const Statistics = ({ profileId, url, selectedDates }) => {
  const campaignType = useSelector(selectCampaignType);
  const stats = useSelector(selectStats);
  const dispatch = useDispatch();

  const { cost, clicks, acos, cpc, ctr, cr } = stats;
  const sales = stats[campaignType.salesAttr];

  useEffect(() => {
    dispatch(getStatsAsync(url, selectedDates));
  }, [profileId, url, selectedDates]);

  return (
    <Row>
      <Col xl="4">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {sales != null ? (
                    currencyFormatter(sales)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">PPC Sales</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col xl="4">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {cost != null ? (
                    currencyFormatter(cost)
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

      <Col xl="4">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {acos != null ? (
                    percentageFormatter(acos)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Advertising Cost of Sales (ACoS)</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>

      <Col xl="3">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {cpc != null ? (
                    currencyFormatter(cpc)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Cost-Per-Click (CPC)</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
      <Col xl="3">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {ctr != null ? (
                    percentageFormatter(ctr)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Click-Through Rate (CTR)</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
      <Col xl="3">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {clicks != null ? (
                    numberFormatter(clicks)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Clicks</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
      <Col xl="3">
        <Card className="flex-fill">
          <CardBody className="py-4">
            <Media>
              <Media body>
                <h3 className="mb-2">
                  {cr != null ? (
                    percentageFormatter(cr)
                  ) : (
                    <Spinner color="primary" />
                  )}
                </h3>
                <div className="mb-0">Conversion Rate (CR)</div>
              </Media>
            </Media>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
