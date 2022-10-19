import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Container, Card, CardBody, Badge, Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';
import moment from 'moment';

import {
  getPrepDataAsync,
  getSubscriptionsAsync,
  selectSubscriptions,
} from './subscriptionsSlice';
import { currencyFormatter } from 'utils/formatters';
import SubscriptionModal from './SubscriptionModal';

const Subscriptions = () => {
  const subscriptions = useSelector(selectSubscriptions);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSubscriptionsAsync());
    dispatch(getPrepDataAsync());
  }, []);

  const statusFormatter = (cell, row) => {
    let className = 'text-capitalize ';
    className += cell === 'live' ? 'badge-soft-success' : 'badge-soft-warning';
    const status = cell;

    return <Badge className={className}>{status}</Badge>;
  };

  const amountFormatter = (cell, row) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: row.currency_code,
    });

    return formatter.format(cell);
  };

  const dateFormatter = (cell, row) => {
    return <Moment format="L">{cell}</Moment>;
  };

  const tableColumns = [
    {
      dataField: 'customer_name',
      text: 'Customer',
      sort: true,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'subscription_id',
      text: 'Subscription Id',
      sort: true,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'amount',
      text: 'Monthly Retainer',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: amountFormatter,
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'activated_at',
      text: 'Activated At',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: dateFormatter,
    },
  ];

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Subscriptions</h3>
            </Col>
            <Col xs="auto">
              <SubscriptionModal buttonLabel="Add New" />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <BootstrapTable
            bootstrap4
            hover
            striped
            bordered={false}
            keyField="customer_id"
            wrapperClasses="table-responsive"
            data={subscriptions}
            columns={tableColumns}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default Subscriptions;
