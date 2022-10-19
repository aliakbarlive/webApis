import React, { useState, useEffect } from 'react';

import { Row, Col } from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Info } from 'react-feather';
const Table = ({ rows, count, sizePerPage, page, onTableChange }) => {
  const noImageAvailableUrl =
    'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  const productFormatter = (cell, { title, listingImages, asin }) => (
    <Row className="align-items-center">
      <Col sm="auto">
        <img
          src={listingImages ? listingImages[0].link : noImageAvailableUrl}
          className="avatar-small rounded"
        />
      </Col>
      <Col sm="auto">
        <Row>
          <Col>
            <span style={{ color: 'black' }}>
              {title.length > 65 ? `${title.substr(0, 65)}...` : title}
            </span>
          </Col>
        </Row>
        <Row>
          <Col>
            <a
              href={`https://www.amazon.com/gp/product/${asin}`}
              target="_blank"
              style={{ textDecoration: 'none' }}
            >
              <span style={{ color: 'grey', fontSize: '10px' }}>{asin}</span>
            </a>
          </Col>
        </Row>
      </Col>
    </Row>
  );

  // const keywordFormatter = (cell, { ProductKeywords, asin }) => (
  //   <div className="mb-1 ml-3">
  //     <span style={{ color: 'black' }}>{ProductKeywords.length}</span>
  //   </div>
  // );

  const productRankingFormatter = (cell, { CategoryRankings }) => (
    <div>
      {CategoryRankings.length > 0 ? (
        <>
          <Row>
            <Col>{CategoryRankings[0].rank}</Col>
          </Row>
          <Row>
            <Col>
              <span style={{ color: 'grey' }}>
                {CategoryRankings[0].category}
              </span>
            </Col>
          </Row>{' '}
        </>
      ) : (
        <></>
      )}
    </div>
  );

  const detailsFormatter = (cell, { asin }) => (
    <div className="mb-1">
      <a
        href={`/products/${asin}`}
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <Info size={20} className="ml-3 align-middle" color="grey" />
      </a>
    </div>
  );
  const tableColumns = [
    {
      dataField: 'title',
      text: 'Product',
      sort: true,
      formatter: productFormatter,
      headerStyle: {
        width: '600px',
      },
    },
    {
      dataField: 'CategoryRankings',
      text: 'Category Rank',
      formatter: productRankingFormatter,
      headerStyle: {
        width: '300px',
      },
    },
    {
      dataField: 'asin',
      text: 'Details',
      formatter: detailsFormatter,
      headerStyle: {
        width: '200px',
      },
    },
  ];

  return (
    <BootstrapTable
      remote
      bootstrap4
      hover
      striped
      bordered={false}
      keyField="listingId"
      wrapperClasses="table-responsive"
      pagination={paginationFactory({
        page,
        sizePerPage,
        totalSize: count,
      })}
      data={rows}
      columns={tableColumns}
      onTableChange={onTableChange}
    />
  );
};

export default Table;
