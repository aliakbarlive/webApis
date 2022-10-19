import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Badge,
  UncontrolledTooltip,
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import { AlertCircle, Edit } from 'react-feather';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {
  currencyFormatter,
  percentageFormatter,
  noteFormatter,
  floatFormatter,
  numberFormatter,
} from '../../../utils/formatters';
import LeadTimeInput from './LeadTimeInput';

const Table = ({ rows, count, page, sizePerPage, onTableChange }) => {
  const dispatch = useDispatch();

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
      <Col xs="10">
        <div id={`product-title-tooltip-${asin}`} className="mb-1">
          <a href={`/products/${asin}`} target="_blank">
            {cell.length > 45 ? `${cell.substr(0, 45)}...` : cell}
          </a>
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
          <Badge className="badge-soft-secondary">{sellerSku} </Badge>
        </div>
      </Col>
    </Row>
  );

  const leadTimeFormatter = (cell, row) => (
    <LeadTimeInput cell={cell} row={row} />
  );

  const statusFormatter = (cell, { afnListingExists, mfnListingExists }) =>
    !afnListingExists && !mfnListingExists ? (
      <Badge className="badge-soft-warning">Archived</Badge>
    ) : (
      <Badge className="badge-soft-success">Active</Badge>
    );

  const currentStockFormatter = (
    cell,
    {
      asin,
      afnFulfillableQty,
      afnUnsellableQty,
      afnReservedQty,
      afnWarehouseQty,
    }
  ) => (
    <div className="d-flex align-items-center">
      <span className="mr-1">{cell}</span>{' '}
      <AlertCircle id={`inventory-trigger-${asin}`} size="14px" />
      <UncontrolledTooltip placement="top" target={`inventory-trigger-${asin}`}>
        Detailed Inventory
      </UncontrolledTooltip>
      <UncontrolledPopover
        trigger="legacy"
        placement="right"
        target={`inventory-trigger-${asin}`}
        className="w-25"
      >
        <PopoverHeader>Inventory Details</PopoverHeader>
        <PopoverBody>
          <ListGroup flush>
            <ListGroupItem className="d-flex justify-content-between align-items-center px-2">
              <span className="mr-5">Fulfillable Qty</span>
              <span>{afnFulfillableQty}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center px-2">
              <span className="mr-5">Unsellable Qty</span>
              <span>{afnUnsellableQty}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center px-2">
              <span className="mr-5">Reserved Qty</span>
              <span>{afnReservedQty}</span>
            </ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between align-items-center px-2">
              <span className="mr-5">
                <strong>Total</strong>
              </span>
              <span>
                <strong>{afnWarehouseQty}</strong>
              </span>
            </ListGroupItem>
          </ListGroup>
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  );

  const tableColumns = [
    {
      dataField: 'productName',
      text: 'Product Name',
      sort: true,
      headerStyle: {
        width: '400px',
      },
      formatter: productNameFormatter,
    },
    {
      text: 'Status',
      headerStyle: {
        width: '100px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'afnFulfillableQty',
      text: 'Stock',
      headerStyle: {
        width: '100px',
      },
      sort: true,
      formatter: currentStockFormatter,
    },
    {
      dataField: 'salesVelocity',
      text: 'Sales Velocity (28 days)',
      headerStyle: {
        width: '115px',
      },
      sort: true,
      formatter: (cell, row) => floatFormatter(cell),
    },
    {
      dataField: 'leadTime',
      text: 'Lead Time',
      sort: true,
      headerStyle: {
        width: '100px',
      },
      formatter: leadTimeFormatter,
    },
    {
      dataField: 'outOfStock',
      text: 'Out of Stock (days)',
      headerStyle: {
        width: '115px',
      },
      sort: true,
      formatter: (cell, row) => parseFloat(cell).toFixed(0),
    },
    {
      dataField: 'reorder',
      text: 'Re-Order (days)',
      headerStyle: {
        width: '115px',
      },
      sort: true,
      formatter: (cell, row) => parseFloat(cell).toFixed(0),
    },
    {
      dataField: 'Notes',
      text: 'Notes',
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => noteFormatter(cell),
    },
    // {
    //   dataField: 'price',
    //   text: 'Price',
    //   headerStyle: {
    //     width: '100px',
    //   },
    //   sort: true,
    //   formatter: (cell, row) => currencyFormatter(cell),
    // },
    // {
    //   dataField: 'defaultCog',
    //   text: 'COG',
    //   headerStyle: {
    //     width: '150px',
    //   },
    //   sort: true,
    //   formatter: cogFormatter,
    // },
    // {
    //   dataField: 'inventory.estCogValue',
    //   text: 'COG Value',
    //   sort: true,
    //   headerStyle: {
    //     width: '100px',
    //   },
    //   formatter: (cell) => currencyFormatter(cell),
    // },
    // {
    //   dataField: 'inventory.estTotalSales',
    //   text: 'Est. Sales',
    //   sort: true,
    //   headerStyle: {
    //     width: '100px',
    //   },
    //   formatter: (cell) => currencyFormatter(cell),
    // },
    // {
    //   dataField: 'estProfit',
    //   text: 'Est. Profit',
    //   sort: true,
    //   headerStyle: {
    //     width: '100px',
    //   },
    //   formatter: (cell) => currencyFormatter(cell),
    // },
    // {
    //   dataField: 'roi',
    //   text: 'ROI',
    //   sort: true,
    //   headerStyle: {
    //     width: '100px',
    //   },
    //   formatter: (cell) => percentageFormatter(cell),
    // },
  ];

  const defaultSorted = [
    {
      dataField: 'productName',
      order: 'asc',
    },
  ];

  return (
    <Card>
      <CardBody>
        <BootstrapTable
          remote
          bootstrap4
          hover
          striped
          bordered={false}
          keyField="sellerSku"
          wrapperClasses="table-responsive"
          data={rows}
          columns={tableColumns}
          pagination={paginationFactory({
            page,
            sizePerPage,
            totalSize: count,
          })}
          defaultSorted={defaultSorted}
          onTableChange={onTableChange}
        />
      </CardBody>
    </Card>
  );
};

export default Table;
