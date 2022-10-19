import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Row, Col, CustomInput, UncontrolledTooltip, Badge } from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { TrendingUp } from 'react-feather';
const Table = ({ rows, onSwitch, count, sizePerPage, page, onTableChange }) => {
  const noImageAvailableUrl =
    'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif';

  const keywordFormatter = (cell, { keywordText, keywordId }) => (
    <div className="mb-1">
      <a
        href={`/rankings/keyword/${keywordId}`}
        target="_blank"
        style={{ textDecoration: 'none' }}
      >
        <TrendingUp size={16} className="mr-2 align-middle" color="grey" />
        <span style={{ color: 'black' }}>{keywordText}</span>
      </a>
    </div>
  );

  const statusFormatter = (cell, { status, keywordText }, index) => (
    <CustomInput
      type="switch"
      id={keywordText}
      onChange={() => onSwitch(status, index)}
      defaultChecked={status == 'ACTIVE' ? true : false}
      name="customSwitch"
    />
  );

  const imageFormatter = (cell, { listingImages, title, asin }) =>
    listingImages.length > 0 ? (
      <Row className="align-items-center">
        <Col xs="2">
          <img src={listingImages[0].link} className="avatar-small rounded" />
        </Col>
        <Col xs="10">
          <div id={`product-title-tooltip-${asin}`} className="mb-1">
            <a href={`/products/${asin}`}>
              {title !== null && title.length > 55
                ? `${title.substr(0, 55)}...`
                : title}
            </a>
          </div>
          <div>
            <UncontrolledTooltip
              placement="top"
              target={`product-title-tooltip-${asin}`}
            >
              {title}
            </UncontrolledTooltip>
            <Badge className="badge-soft-secondary">
              <a
                className="text-muted"
                target="_blank"
                href={`https://www.amazon.com/gp/product/${asin}`}
              >
                {asin}
              </a>
            </Badge>
          </div>
        </Col>
      </Row>
    ) : (
      <img src={noImageAvailableUrl} className="avatar-small rounded" />
    );

  const tableColumns = [
    {
      dataField: 'keywordText',
      text: 'Keyword',
      sort: true,
      formatter: keywordFormatter,
      headerStyle: {
        width: '250px',
      },
    },
    {
      dataField: 'listingImages',
      text: 'Ranked Product',
      formatter: imageFormatter,
      headerStyle: {
        width: '700px',
      },
    },
    {
      dataField: 'KeywordRankingRecords[0].rankings',
      text: 'Ranking',
      headerStyle: {
        width: '135px',
      },
    },
    {
      dataField: 'KeywordRankingRecords[0].current_page',
      text: 'Page',
      headerStyle: {
        width: '135px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      formatter: statusFormatter,
    },
  ];

  return (
    <BootstrapTable
      remote
      bootstrap4
      hover
      striped
      bordered={false}
      keyField="keywordText"
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
