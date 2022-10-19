import {
  fetchSubscription,
  updateAutoCollect,
  updateCard,
} from 'features/admin/agencyClients/subscriptionsSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';
import classnames from 'classnames';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import { AlertTriangle, Trash2 } from 'react-feather';
import PlanAddons from './PlanAddons';
import Loading from 'components/Loading';

const Subscription = ({ subscriptionId }) => {
  const { subscription, scheduledChanges } = useSelector(
    (state) => state.subscriptions
  );
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  };

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSubscription(subscriptionId)).then(() => {
      setLoading(false);
    });
  }, [subscriptionId]);

  const changeAutoCollect = (e) => {
    e.preventDefault();
    dispatch(updateAutoCollect(subscriptionId, !subscription.auto_collect));
  };

  const updateCardDetails = (e) => {
    e.preventDefault();
    dispatch(updateCard(subscriptionId));
  };

  return (
    <Card>
      <CardBody className={'text-dark p-auto p-lg-5'}>
        {loading ? (
          <Loading />
        ) : subscription ? (
          <Row>
            <Col lg={4}>
              <Row className={'mb-2'}>
                <Col>
                  DETAILS
                  <hr className={'my-2'} />
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Subscription Number
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  #{subscription.subscription_number}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Status
                </Col>
                <Col lg={7} className={'pl-4 pl-lg-0'}>
                  <span
                    className={classnames('text-capitalize badge', {
                      'badge-success': subscription.status == 'live',
                      'badge-dark': subscription.status == 'expired',
                    })}
                  >
                    {subscription.status}
                  </span>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Activation Date
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {dateFormatter(subscription.activated_at)}
                </Col>
              </Row>
              <Row className={'mt-4 mb-2'}>
                <Col>
                  PAYMENT METHOD <hr className={'my-2'} />
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Card Number
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.card.last_four_digits}{' '}
                  <em className="text-muted">(last four digits)</em>
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  expires on
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.card.expiry_month}&nbsp;/&nbsp;
                  {subscription.card.expiry_year}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Gateway
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.card.payment_gateway}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Funding
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.card.funding}
                </Col>
              </Row>
              <Row className={'mb-3'}>
                <Col xs={12}>
                  <a href="#" onClick={changeAutoCollect}>
                    Change to {subscription.auto_collect ? 'Offline' : 'Online'}{' '}
                    Mode
                  </a>
                  &nbsp;|&nbsp;
                  <a href="#" onClick={updateCardDetails}>
                    Update Card
                  </a>
                </Col>
              </Row>

              <Row className={'mt-4 mb-2'}>
                <Col>
                  SUBSCRIPTION OPTIONS
                  <hr className={'my-2'} />
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Subscription ID
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.subscription_id}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Convert On Cycle
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {subscription.custom_field_hash.cf_convert_on_cycle}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Convert On Cycle Date
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {dateFormatter(
                    subscription.custom_field_hash
                      .cf_convert_on_cycle_date_unformatted
                  )}
                </Col>
              </Row>
              <Row className={'mb-2'}>
                <Col lg={5} className={'profile-form-label'}>
                  Retainer After Convert
                </Col>
                <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                  {currencyFormatter(
                    subscription.custom_field_hash
                      .cf_retainer_after_convert_unformatted
                  )}
                </Col>
              </Row>
            </Col>
            <Col lg={8} className={'border-left'}>
              <Row className={'pl-3 pb-3'}>
                <Col lg={3} className={'d-flex flex-column'}>
                  <span className={'profile-form-label'}>
                    Subscription Amount
                  </span>
                  <span className={'font-size-lg'}>
                    {currencyFormatter(subscription.amount)}
                  </span>
                </Col>
                <Col lg={3} className={'d-flex flex-column'}>
                  <span className={'profile-form-label'}>
                    Next Billing Date
                  </span>
                  {dateFormatter(subscription.next_billing_at)}
                </Col>
                <Col lg={3} className={'d-flex flex-column'}>
                  <span className={'profile-form-label'}>
                    Last Billing Date
                  </span>
                  {dateFormatter(subscription.last_billing_at)}
                </Col>
                <Col lg={3}>
                  {subscription.remaining_billing_cycles < 0 ? (
                    <div className={'d-flex flex-column'}>
                      <span className={'profile-form-label text-success'}>
                        renews forever
                      </span>
                      &infin;
                    </div>
                  ) : (
                    <div className={'d-flex flex-column'}>
                      <span className={'profile-form-label'}>
                        Renewals remaining
                      </span>
                      {subscription.remaining_billing_cycles}
                    </div>
                  )}
                </Col>
              </Row>
              {scheduledChanges && scheduledChanges.code == 0 ? (
                <Row className="mx-2">
                  <Col className="text-warning py-3 border-top">
                    <AlertTriangle size={20} /> There are some changes scheduled
                    on&nbsp;
                    {dateFormatter(
                      scheduledChanges.subscription.next_billing_at
                    )}
                    .&nbsp;
                    <a href="#" onClick={toggle}>
                      View Changes
                    </a>
                  </Col>
                  <Modal isOpen={modal} toggle={toggle} size={'lg'}>
                    <ModalHeader toggle={toggle} className="border-0">
                      <h4>
                        Changes will be effective from&nbsp;
                        {dateFormatter(
                          scheduledChanges.subscription.next_billing_at
                        )}
                        .
                      </h4>
                    </ModalHeader>
                    <ModalBody className={'py-0'}>
                      <PlanAddons
                        subscription={scheduledChanges.subscription}
                      />
                    </ModalBody>
                    <ModalFooter className="border-0 justify-content-between">
                      <a href="#">
                        <Trash2 size={18} />
                        &nbsp;&nbsp;drop the scheduled changes
                      </a>
                      <Button color="primary" onClick={toggle}>
                        Close
                      </Button>
                    </ModalFooter>
                  </Modal>
                </Row>
              ) : (
                ''
              )}
              <Row className={'p-3'}>
                <Col>
                  <PlanAddons subscription={subscription} />
                </Col>
              </Row>
            </Col>
          </Row>
        ) : (
          ''
        )}
      </CardBody>
    </Card>
  );
};
export default Subscription;
