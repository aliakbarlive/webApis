import React, { useState } from 'react';

import { Row, Col } from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import { ExternalLink } from 'react-feather';

const ProductTable = ({ rows }) => {
  const noImageAvailableUrl =
    'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  const asinFormatter = (cell, { asin }) => (
    <div>
      <span style={{ color: 'black' }}>{asin}</span>
      <a
        href={`https://www.amazon.com/gp/product/${asin}`}
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <ExternalLink
          size={16}
          className="mb-2 ml-2 align-middle"
          color="grey"
        />
      </a>
    </div>
  );

  const productFormatter = (cell, { Product }) =>
    Product.listingImages ? (
      <Row className="align-items-center">
        <Col xs="3">
          <img
            src={Product.listingImages[0].link}
            className="avatar-small rounded"
          />
        </Col>
        <Col xs="9">
          <div className="mb-1">
            <span style={{ color: 'black' }}>
              {Product.title.length > 55
                ? `${Product.title.substr(0, 55)}...`
                : Product.title}
            </span>
          </div>
        </Col>
      </Row>
    ) : (
      <img src={noImageAvailableUrl} className="avatar-small rounded" />
    );

  const tableColumns = [
    {
      dataField: 'Product',
      text: 'Product',
      // formatter: productFormatter,
    },
    {
      dataField: 'rankings',
      text: 'Ranking',
    },
    {
      dataField: 'asin',
      text: 'Asin',
      // formatter: asinFormatter,
    },
  ];

  return (
    <BootstrapTable
      remote
      bootstrap4
      hover
      striped
      bordered={false}
      keyField="asin"
      wrapperClasses="table-responsive"
      data={rows}
      columns={tableColumns}
    />
  );
};

export default ProductTable;
