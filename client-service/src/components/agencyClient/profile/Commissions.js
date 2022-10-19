import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteCommission,
  fetchCommissions,
} from 'features/admin/agencyClients/commissionsSlice';
import { dateFormatter } from 'utils/formatters';
import { Edit2, Trash2, Plus } from 'react-feather';
import CommissionForm from 'components/commissions/CommissionForm';

const Commissions = ({ subscriptionId }) => {
  const dispatch = useDispatch();
  const { commissions } = useSelector((state) => state.commissions);
  const [modal, setModal] = useState(false);
  const [modalOperation, setModalOperation] = useState('add');
  const [modalCommission, setModalCommission] = useState(null);

  useEffect(() => {
    if (subscriptionId > 0) {
      dispatch(fetchCommissions(subscriptionId));
    }
  }, [subscriptionId]);

  const addCommission = (e) => {
    e.preventDefault();
    setModalOperation('add');
    setModalCommission(null);
    setModal(!modal);
  };

  const editRecord = (e, commission) => {
    e.preventDefault();
    setModalOperation('edit');
    setModalCommission(commission);
    setModal(!modal);
    //dispatch(deleteCommission(commissionId, subscriptionId));
  };

  const deleteRecord = (e, commissionId) => {
    e.preventDefault();
    dispatch(deleteCommission(commissionId, subscriptionId));
  };

  const toggle = () => {
    //e.preventDefault();
    setModal(!modal);
  };

  return (
    <div>
      <Card>
        <CardBody className={'text-dark p-auto p-lg-5'}>
          <Row>
            <Col className="mb-4">
              <a
                href="#"
                className="btn btn-sm btn-outline-primary"
                onClick={addCommission}
              >
                <Plus size={14} />
                &nbsp;&nbsp;Add Commission
              </a>
            </Col>
          </Row>
          <Row>
            {commissions
              ? commissions.map((commission) => {
                  return (
                    <Col
                      lg={4}
                      md={6}
                      className="mb-4 px-4"
                      key={commission.commissionId}
                    >
                      <Row className={'mb-2'}>
                        <Col
                          className={'text-uppercase justify-content-between'}
                        >
                          <span>{commission.type}</span>
                          <span className="float-right">
                            <a
                              href="#"
                              className="mr-2"
                              onClick={(e) => editRecord(e, commission)}
                            >
                              <Edit2 size={16} />
                            </a>
                            <a
                              href="#"
                              className={'text-dark'}
                              onClick={(e) =>
                                deleteRecord(e, commission.commissionId)
                              }
                            >
                              <Trash2 size={16} />
                            </a>
                          </span>
                          <hr className={'my-2'} />
                        </Col>
                      </Row>
                      <Row className={'mb-2'}>
                        <Col lg={5} className={'profile-form-label'}>
                          Rate (%)
                        </Col>
                        <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                          {commission.rate}
                        </Col>
                      </Row>
                      {commission.type !== 'gross' ? (
                        <Row className={'mb-2'}>
                          <Col lg={5} className={'profile-form-label'}>
                            Month Threshold
                          </Col>
                          <Col
                            lg={7}
                            className={'font-weight-bold pl-4 pl-lg-0'}
                          >
                            {commission.monthThreshold}
                          </Col>
                        </Row>
                      ) : (
                        ''
                      )}

                      <Row className={'mb-2'}>
                        <Col lg={5} className={'profile-form-label'}>
                          MarketplaceId
                        </Col>
                        <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                          {commission.marketplaceId == 'ATVPDKIKX0DER'
                            ? 'US'
                            : commission.marketplaceId == 'A2EUQ1WTGCTBG2'
                            ? 'CA'
                            : ''}
                        </Col>
                      </Row>
                      <Row className={'mb-2'}>
                        <Col lg={5} className={'profile-form-label'}>
                          Auto-add to Invoice
                        </Col>
                        <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                          {commission.commencedAt ? 'True' : 'False'}
                        </Col>
                      </Row>
                      {/* <Row className={'mb-2'}>
                        <Col lg={5} className={'profile-form-label'}>
                          Added
                        </Col>
                        <Col lg={7} className={'font-weight-bold pl-4 pl-lg-0'}>
                          {dateFormatter(commission.createdAt)}
                        </Col>
                      </Row> */}
                    </Col>
                  );
                })
              : ''}
          </Row>
        </CardBody>
      </Card>
      <Modal isOpen={modal} toggle={toggle} size={'sm'}>
        <ModalHeader toggle={toggle} className="border-0">
          <h4 className="text-capitalize">{modalOperation} Commission</h4>
        </ModalHeader>
        <ModalBody className={'py-0'}>
          <CommissionForm
            operation={modalOperation}
            subscriptionId={subscriptionId}
            toggle={toggle}
            commission={modalCommission}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};
export default Commissions;
