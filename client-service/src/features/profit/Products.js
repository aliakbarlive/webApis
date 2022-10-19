import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  CardBody,
  Row,
  Col,
  UncontrolledTooltip,
  Badge,
  CardHeader,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import moment from 'moment';

import {
  currencyFormatter,
  percentageFormatter,
  floatFormatter,
  numberFormatter,
} from '../../utils/formatters';

const Products = ({ products, page, sizePerPage, onTableChange }) => {
  const dispatch = useDispatch();

  const [selectedDates, setSelectedDates] = useState({
    startDate: new Date(moment().subtract(7, 'd').startOf('day').utc()),
    endDate: new Date(moment().endOf('day').utc()),
  });

  const onDateRangeSelect = (dateRange) => {
    setSelectedDates(dateRange);
  };

  const noImageAvailableUrl =
    'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  const productNameFormatter = (cell, { asin, sellerSku, listingImages }) => (
    <Row className="align-items-center">
      <Col xs="2">
        <img
          src={listingImages ? listingImages[0].link : noImageAvailableUrl}
          className="avatar-small rounded"
        />
      </Col>
      <Col xs="10" classname="ml-2">
        <div id={`product-title-tooltip-${asin}`} className="mb-1">
          <a href={`/products/${asin}`}>{`${cell.substr(0, 35)}...`}</a>
        </div>

        <div>
          <UncontrolledTooltip
            placement="top"
            target={`product-title-tooltip-${asin}`}
          >
            {cell}
          </UncontrolledTooltip>
          <Badge className="badge-soft-secondary mr-2">
            <a
              className="text-muted"
              target="_blank"
              href={`https://www.amazon.com/gp/product/${asin}`}
            >
              {asin}
            </a>
          </Badge>

          <Badge className="badge-soft-secondary">{sellerSku}</Badge>
        </div>
      </Col>
    </Row>
  );

  const tableColumns = [
    {
      dataField: 'productName',
      text: 'Product',
      sort: true,
      headerStyle: {
        width: '350px',
      },
      formatter: productNameFormatter,
    },
    {
      dataField: 'totalSales',
      text: 'Sales',
      sort: true,
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'totalCosts',
      text: 'Fees',
      sort: true,
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'cogs',
      text: 'COGS',
      sort: true,
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'totalProfit',
      text: 'Profit',
      sort: true,
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'orders',
      text: 'Orders',
      sort: true,
      headerStyle: {
        width: '100px',
      },
    },
    {
      dataField: 'units',
      text: 'Units',
      sort: true,
      headerStyle: {
        width: '90px',
      },
    },
    {
      dataField: 'ppcSpend',
      text: 'PPC Spend',
      sort: true,
      headerStyle: {
        width: '130px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'ppcSales',
      text: 'PPC Sales',
      sort: true,
      headerStyle: {
        width: '120px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'returns',
      text: 'Returns',
      sort: true,
      headerStyle: {
        width: '100px',
      },
    },
    {
      dataField: 'promotions',
      text: 'Promos',
      sort: true,
      headerStyle: {
        width: '100px',
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: 'productName',
      order: 'asc',
    },
  ];

  return (
    <Card>
      <CardHeader>Products</CardHeader>
      <CardBody>
        {products.rows ? (
          <BootstrapTable
            remote
            bootstrap4
            hover
            striped
            bordered={false}
            keyField="listingId"
            wrapperClasses="table-responsive"
            data={products.rows}
            columns={tableColumns}
            pagination={paginationFactory({
              page,
              sizePerPage,
              totalSize: products.count,
            })}
            defaultSorted={defaultSorted}
            onTableChange={onTableChange}
          />
        ) : (
          <h1>Loading</h1>
        )}
      </CardBody>
    </Card>
  );
};

export default Products;
