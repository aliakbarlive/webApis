import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import {
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  UncontrolledTooltip,
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import CogInput from './CogInput';
import {
  currencyFormatter,
  percentageFormatter,
  noteFormatter,
  floatFormatter,
  numberFormatter,
} from '../../../utils/formatters';

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

  const cogFormatter = (cell, row) => {
    return <CogInput cell={cell} row={row} />;
  };

  const statusFormatter = (cell, { afnListingExists, mfnListingExists }) =>
    !afnListingExists && !mfnListingExists ? (
      <Badge className="badge-soft-warning">Archived</Badge>
    ) : (
      <Badge className="badge-soft-success">Active</Badge>
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
      dataField: 'price',
      text: 'Price',
      headerStyle: {
        width: '100px',
      },
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'estCogValue',
      text: 'COG Value',
      sort: true,
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'estTotalSales',
      text: 'Est. Sales',
      sort: true,
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'estProfit',
      text: 'Est. Profit',
      sort: true,
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => currencyFormatter(cell),
    },
    {
      dataField: 'defaultCog',
      text: 'COG',
      headerStyle: {
        width: '150px',
      },
      sort: true,
      formatter: cogFormatter,
    },
    {
      dataField: 'roi',
      text: 'ROI',
      sort: true,
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => percentageFormatter(cell),
    },
    {
      dataField: 'Notes',
      text: 'Notes',
      headerStyle: {
        width: '100px',
      },
      formatter: (cell) => noteFormatter(cell),
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
