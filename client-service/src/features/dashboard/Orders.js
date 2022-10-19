import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectOrders,
  selectOrdersLoading,
  getOrdersAsync,
} from '../orders/ordersSlice';

import {
  Container,
  Card,
  CardBody,
  Badge,
  Button,
  Row,
  Col,
  Spinner,
  CardHeader,
  CardTitle,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Moment from 'react-moment';
import moment from 'moment';

import DatePicker from 'components/datePicker/DatePicker';
import { setElSeg } from '@fullcalendar/react';
import OrderModal from './OrderModal';

const Orders = ({ dateRange }) => {
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();

  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(moment().subtract(7, 'd').startOf('day').utc()),
    endDate: new Date(moment().endOf('day').utc()),
  });

  const [order, setOrder] = useState({});
  const [orderModal, setOrderModal] = useState(false);

  useEffect(() => {
    setSelectedDates(dateRange);
  }, [dateRange]);

  useEffect(() => {
    dispatch(getOrdersAsync(selectedDates));
  }, [selectedDates]);

  const onDateRangeSelect = (dateRange) => {
    setSelectedDates(dateRange);
  };

  const onOrderModalToggle = () => {
    setOrderModal(!orderModal);
  };

  const onProductSelect = (row) => {
    console.log('Product selected');
    setOrder(row);
    onOrderModalToggle();
  };

  const orderFormatter = (cell, row) => {
    return (
      <Button color="link" onClick={() => onProductSelect(row)}>
        {cell}
      </Button>
    );
  };

  const statusFormatter = (cell, row) => {
    let className;
    if (cell === 'Shipped') {
      className = 'badge-soft-success';
    } else if (cell === 'Pending') {
      className = 'badge-soft-warning';
    } else if (cell === 'Canceled') {
      className = 'badge-soft-secondary';
    }

    return <Badge className={className}>{cell}</Badge>;
  };

  const totalFormatter = (cell, row) => {
    if (cell === null) {
      return '$0.00';
    } else {
      return `$${cell.Amount}`;
    }
  };

  const qtyFormatter = (cell, row) => {
    return cell;
  };

  const dateFormatter = (cell, row) => {
    return <Moment format="lll">{cell}</Moment>;
  };

  const tableColumns = [
    {
      dataField: 'amazonOrderId',
      text: 'Order',
      sort: true,
      headerStyle: {
        width: '275px',
      },
      formatter: orderFormatter,
    },
    {
      dataField: 'quantity',
      text: 'Qty',
      sort: true,
      headerStyle: {
        width: '80px',
      },
      formatter: qtyFormatter,
    },
    // {
    //   dataField: 'orderTotal',
    //   text: 'Total',
    //   sort: true,
    //   formatter: totalFormatter,
    // },
    {
      dataField: 'orderStatus',
      text: 'Status',
      sort: true,
      formatter: statusFormatter,
    },
    {
      dataField: 'purchaseDate',
      text: 'Purchase Date',
      sort: true,
      formatter: dateFormatter,
    },
    {
      dataField: 'lastUpdateDate',
      text: 'Last Update Date',
      sort: true,
      formatter: dateFormatter,
    },
  ];

  return (
    <Container fluid className="p-0">
      <OrderModal
        isOpen={orderModal}
        toggle={onOrderModalToggle}
        order={order}
      />

      <Card>
        <CardHeader className="d-flex justify-content-between align-items-center">
          <CardTitle tag="h5" className="mb-0">
            Latest Orders
          </CardTitle>

          <Link className="text-white" to="/sales-metrics/orders">
            <Button color="primary">View All Orders</Button>
          </Link>
        </CardHeader>
        <CardBody>
          {orders.length === 0 ? (
            <strong>
              <Spinner color="primary" className="d-flex mx-auto" />
            </strong>
          ) : (
            <BootstrapTable
              bootstrap4
              bordered={false}
              keyField="amazonOrderId"
              data={orders.slice(0, 5)}
              columns={tableColumns}
              // pagination={paginationFactory({
              //   sizePerPage: 10,
              //   sizePerPageList: [10, 25, 50, 100],
              // })}
              wrapperClasses="table-responsive"
              hover
              striped
            />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Orders;
