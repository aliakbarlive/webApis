import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectRefunds, getRefundsAsync } from './refundsSlice';
import { selectCurrentDateRange } from '../../components/datePicker/dateSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../auth/accountSlice';

import { Container, Card, CardBody, Row, Col, Spinner } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Moment from 'react-moment';

import DatePicker from 'components/datePicker/DatePicker';
import RefundModal from './RefundModal';
import { currencyFormatter } from 'utils/formatters';

const Refunds = () => {
  const dispatch = useDispatch();

  const refunds = useSelector(selectRefunds);
  const selectedDates = useSelector(selectCurrentDateRange);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);

  const [order, setOrder] = useState({});
  const [orderModal, setOrderModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    dispatch(
      getRefundsAsync({
        pageSize,
        page,
        sortField,
        sortOrder,
        selectedDates,
      })
    );
  }, [
    pageSize,
    page,
    sortField,
    sortOrder,
    selectedDates,
    currentAccount,
    currentMarketplace,
  ]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setSortField(sortField);
    setSortOrder(sortOrder);
    setPageSize(sizePerPage);
    setPage(page);
  };

  const onOrderModalToggle = () => {
    setOrderModal(!orderModal);
  };

  const onProductSelect = (row) => {
    console.log('Product selected');
    setOrder(row);
    onOrderModalToggle();
  };

  const tableColumns = [
    {
      dataField: 'amazonOrderId',
      text: 'Order',
      sort: true,
      headerStyle: {
        width: '275px',
      },
    },
    {
      dataField: 'totalItemChargeAdjustments',
      text: 'Item Fees',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'totalItemFeeAdjustments',
      text: 'Amazon Fees',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'totalRefund',
      text: 'Total Refund',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },

    {
      dataField: 'postedDate',
      text: 'Posted Date',
      sort: true,
      formatter: (cell, row) => <Moment format="lll">{cell}</Moment>,
    },
  ];

  return (
    <Container fluid className="p-0">
      {/* <OrderModal
        isOpen={orderModal}
        toggle={onOrderModalToggle}
        order={order}
      /> */}

      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Refunds</h3>
            </Col>
            <Col xs="auto">
              <DatePicker />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          {refunds ? (
            <BootstrapTable
              hover
              striped
              remote
              bootstrap4
              bordered={false}
              keyField="amazonOrderId"
              data={refunds.rows}
              columns={tableColumns}
              pagination={paginationFactory({
                page,
                sizePerPage: pageSize,
                totalSize: refunds.count,
              })}
              wrapperClasses="table-responsive"
              onTableChange={onTableChange}
            />
          ) : (
            <strong>
              <Spinner color="primary" className="d-flex mx-auto" />
            </strong>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default Refunds;
