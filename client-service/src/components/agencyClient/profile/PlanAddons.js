import React from 'react';
import { Row, Col } from 'reactstrap';
import { currencyFormatter } from 'utils/formatters';

const PlanAddons = ({ subscription }) => {
  return (
    <div>
      <Row className={'bg-light border-top border-bottom mb-2 py-2 text-muted'}>
        <Col xs={4}>Plan &amp; Addon Details</Col>
        <Col xs={1} className={'text-right'}>
          Qty
        </Col>
        <Col xs={3} className={'text-right'}>
          Rate
        </Col>
        <Col xs={2} className={'text-right'}>
          Tax
        </Col>
        <Col xs={2} className={'text-right'}>
          Amount
        </Col>
      </Row>
      <Row className={'py-2'}>
        <Col xs={4}>
          {subscription.plan.name}
          <br />
          {subscription.plan.description}
        </Col>
        <Col xs={1} className={'text-right'}>
          {subscription.plan.quantity}
        </Col>
        <Col xs={3} className={'text-right'}>
          {currencyFormatter(
            subscription.plan.price,
            subscription.currency_code
          )}
        </Col>
        <Col xs={2} className={'text-right'}>
          {subscription.plan.tax_percentage
            ? subscription.plan.tax_percentage
            : '-'}
        </Col>
        <Col xs={2} className={'text-right'}>
          {currencyFormatter(subscription.plan.total)}
        </Col>
      </Row>
      {subscription.addons
        ? subscription.addons.map((addon, index) => {
            return (
              <Row className={'py-2'} key={index}>
                <Col xs={4}>
                  {addon.addon_code}
                  <br />
                  {addon.description}
                </Col>
                <Col xs={1} className={'text-right'}>
                  {addon.quantity}
                </Col>
                <Col xs={3} className={'text-right'}>
                  {currencyFormatter(addon.price)}
                </Col>
                <Col xs={2} className={'text-right'}>
                  {addon.tax_percentage ? addon.tax_percentage : '-'}
                </Col>
                <Col xs={2} className={'text-right'}>
                  {currencyFormatter(addon.total)}
                </Col>
              </Row>
            );
          })
        : ''}
      <Row className={'bg-light border-top border-bottom mt-4 py-2'}>
        <Col xs={10} className={'text-right font-weight-bold'}>
          TOTAL
        </Col>
        <Col xs={2} className={'text-right font-weight-bold'}>
          {currencyFormatter(subscription.amount)}
        </Col>
      </Row>
    </div>
  );
};

export default PlanAddons;
