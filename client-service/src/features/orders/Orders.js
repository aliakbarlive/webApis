import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { selectOrders, getOrdersAsync } from './ordersSlice';
import { selectCurrentDateRange } from '../../components/datePicker/dateSlice';

import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from '../auth/accountSlice';

import {
  Container,
  Card,
  CardBody,
  Badge,
  Button,
  Row,
  Col,
  Spinner,
  Input,
  NavLink,
  Media,
} from 'reactstrap';

import { Eye as EyeIcon, Calendar as CalendarIcon } from 'react-feather';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { MessageCircle } from 'react-feather';
import Moment from 'react-moment';
import moment from 'moment';

import DatePicker from 'components/datePicker/DatePicker';
import OrderModal from './OrderModal';
import NoteModal from './NoteModal';

const Orders = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const selectedDates = useSelector(selectCurrentDateRange);
  const currentMarketplace = useSelector(selectCurrentMarketplace);
  const currentAccount = useSelector(selectCurrentAccount);

  const [order, setOrder] = useState({});
  const [orderModal, setOrderModal] = useState(false);
  const [noteModal, setNoteModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    dispatch(
      getOrdersAsync({
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
    console.log(page);
    setSortField(sortField);
    setSortOrder(sortOrder);
    setPageSize(sizePerPage);
    setPage(page);
  };

  const onOrderModalToggle = () => {
    setOrderModal(!orderModal);
  };

  const onNoteModalToggle = () => {
    setNoteModal(!noteModal);
  };

  const onProductSelect = (row) => {
    console.log('Product selected');
    setOrder(row);
    onOrderModalToggle();
  };

  const onNoteSelect = (row) => {
    console.log(row);
    setOrder(row);
    onNoteModalToggle();
  };

  const orderFormatter = (cell, row) => {
    return (
      <Button color="link" onClick={() => onProductSelect(row)}>
        {cell}
      </Button>
    );
  };

  const noteFormatter = (notes, row) => {
    return notes.length > 0 ? (
      <div>
        <MessageCircle
          onClick={() => onNoteSelect(row)}
          size={20}
          className="ml-3 align-middle"
          color="grey"
        />
        ({notes.length})
      </div>
    ) : (
      ''
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

  const dateFormatter = (cell, row) => {
    return <Moment format="lll">{cell}</Moment>;
  };

  const tableColumns = [
    {
      text: 'CheckBox',
      sort: false,
      formatter: (cell, row, rowIndex) => {
        return (
          <Input
            type="checkbox"
            style={{ marginLeft: 50, width: 20 }}
            onChange={() => {}}
          />
        );
      },
    },
    {
      dataField: 'fulfillmentChannel',
      text: 'Type',
      sort: true,
      formatter: (cell, row) => {
        return cell === 'Amazon' ? 'FBA' : 'FBM';
      },
    },
    {
      dataField: 'purchaseDate',
      text: 'Order Date',
      sort: true,
      headerStyle: {
        width: '200px',
      },
      formatter: dateFormatter,
    },
    {
      dataField: 'amazonOrderId',
      text: 'Order #',
      sort: true,
      headerStyle: {
        width: '275px',
      },
      formatter: orderFormatter,
    },
    {
      text: 'Image',
      sort: true,
    },
    {
      dataField: 'product',
      text: 'Product',
      sort: true,
      formatter: (cell, row) => {
        return cell.productName + cell.asin + cell.sku;
      },
    },
    {
      dataField: 'quantity',
      text: 'Qty',
      sort: true,
      headerStyle: {
        width: '80px',
      },
    },
    {
      dataField: 'orderStatus',
      text: 'Status',
      sort: true,
      formatter: statusFormatter,
    },
    {
      text: 'Notes',
      sort: true,
      formatter: (cell, row) => {
        return 0;
      },
    },
    {
      dataField: 'TagRecords',
      text: 'Tags',
      sort: true,
      formatter: (cell, row) => {
        const tags = cell;
        const aryTags = tags.map((tag) => {
          const { name } = tag.Tag;
          const tagLink = `orders/filter/tags/${name}`;
          return (
            <NavLink href={tagLink}>
              <Badge color="primary" size="sm">
                {name}
              </Badge>
            </NavLink>
          );
        });
        return aryTags;
      },
    },
    {
      text: 'Action',
      sort: false,
      formatter: (cell, row) => {
        return (
          <NavLink href="#">
            <EyeIcon />
          </NavLink>
        );
      },
    },
    {
      dataField: 'Notes',
      text: 'Notes',
      headerStyle: {
        width: '100px',
      },
      formatter: noteFormatter,
    },
  ];

  return (
    <Container fluid className="p-0">
      <OrderModal
        isOpen={orderModal}
        toggle={onOrderModalToggle}
        order={order}
      />
      <NoteModal isOpen={noteModal} toggle={onNoteModalToggle} order={order} />

      <Card>
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">Order Manager</h3>
            </Col>
            <Col xs="auto">
              {/* <DatePicker /> */}
              <a href="/orders">Orders</a> | <a href="/orders/#">Heat Map</a>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="bg-gradient">
        <CardBody>
          <Row>
            <Col xs="1">
              <label for="filterProduct">Product</label>
              <br />
              <select
                name="filterProduct"
                id="filterProduct"
                className="d-flex align-items-center bg-white shadow-lg btn btn-light"
              >
                <option value="">All Products</option>
              </select>
            </Col>
            <Col xs="2">
              <label for="filterSearch">Search</label>
              <br />
              <input
                name="filterSearch"
                id="filterSearch"
                className="d-flex bg-white shadow-lg btn btn-light text-left w-100"
                placeholder="Order #"
              />
            </Col>
            <Col xs="2">
              <label for="filterProduct">Sort By</label>
              <br />
              <select
                name="filterSortBy"
                id="filterSortBy"
                className="align-items-center bg-white shadow-lg btn btn-light mr-2"
              >
                <option value="">Order Date</option>
              </select>
              <select
                name="filterDirection"
                id="filterDirection"
                className="align-items-center bg-white shadow-lg btn btn-light"
              >
                <option value="">ASC</option>
                <option value="">DESC</option>
              </select>
            </Col>
            <Col xs="2">
              <label for="filterProduct">Filters</label>
              <br />
              <select
                name="filters"
                id="filters"
                className="d-flex align-items-center bg-white shadow-lg btn btn-light w-100"
              >
                <option value="">0 filters selected</option>
              </select>
            </Col>
            <Col xs="3">
              <label for="filterSearch">Date Range</label>
              <br />
              <DatePicker />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Pending</div>
                  <h3 className="mb-2">48</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Unshipped</div>
                  <h3 className="mb-2">2</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Shipped</div>
                  <h3 className="mb-2">23</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Delivered</div>
                  <h3 className="mb-2">179</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Returned</div>
                  <h3 className="mb-2">48</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
        <Col md="3" xl>
          <Card className="flex-fill text-center">
            <CardBody className="py-4">
              <Media>
                <Media body>
                  <div className="mb-0">Cancelled</div>
                  <h3 className="mb-2">6</h3>
                </Media>
              </Media>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Card>
        <CardBody>
          {orders ? (
            <BootstrapTable
              remote
              hover
              striped
              bootstrap4
              bordered={false}
              keyField="amazonOrderId"
              data={orders.rows}
              columns={tableColumns}
              pagination={paginationFactory({
                page,
                sizePerPage: pageSize,
                totalSize: orders.count,
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

export default Orders;
