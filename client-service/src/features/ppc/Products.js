import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getProductsAsync,
  selectList,
  selectCampaignType,
  selectCurrentProfile,
} from './ppcSlice';

import { selectCurrentDateRange } from 'components/datePicker/dateSlice';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {
  currencyFormatter,
  percentageFormatter,
  numberFormatter,
} from 'utils/formatters';

import MetricsFilter from './shared/MetricsFilter';
import SearchBar from '../../components/filters/SearchBar';

import { Container, Row, Col } from 'reactstrap';
import ExportButton from '../../components/ExportButton';

const Products = () => {
  const profile = useSelector(selectCurrentProfile);
  const campaignType = useSelector(selectCampaignType);
  const products = useSelector(selectList);
  const selectedDates = useSelector(selectCurrentDateRange);
  const dispatch = useDispatch();
  const { startDate, endDate } = selectedDates;

  const [params, setParams] = useState({
    page: 1,
    endDate,
    startDate,
    pageSize: 10,
    attributes: `asin,sku,clicks,impressions,cost,${campaignType.salesAttr},${campaignType.ordersAttr},cr,acos,cpc,ctr`,
  });

  useEffect(() => {
    dispatch(getProductsAsync(params));
  }, [profile, params]);

  useEffect(() => {
    if (startDate != params.startDate || endDate != params.endDate)
      setParams({ ...params, startDate, endDate });
  }, [selectedDates]);

  const tableColumns = [
    {
      dataField: 'image',
      text: 'IMAGE',
      sort: false,
      headerStyle: {
        width: '120px',
      },
      formatter: (cell, row) => listingImagesFormatter(cell),
    },
    {
      dataField: 'sku',
      text: 'SKU',
      sort: true,
      headerStyle: {
        width: '180px',
      },
    },
    {
      dataField: 'asin',
      text: 'ASIN',
      sort: true,
      headerStyle: {
        width: '140px',
      },
    },
    {
      dataField: 'cost',
      text: 'Spend',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: campaignType.salesAttr,
      text: 'Sales',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      text: 'ACoS',
      dataField: 'acos',
      sort: true,
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      dataField: 'impressions',
      text: 'Impr.',
      sort: true,
      headerStyle: {
        width: '80px',
      },
      formatter: (cell, row) => numberFormatter(cell),
    },
    {
      dataField: 'clicks',
      text: 'Clicks',
      sort: true,
      headerStyle: {
        width: '80px',
      },
      formatter: (cell, row) => numberFormatter(cell),
    },
    {
      text: 'CPC',
      dataField: 'cpc',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },

    {
      text: 'CTR',
      dataField: 'ctr',
      sort: true,
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      text: 'CR',
      dataField: 'cr',
      sort: true,
      formatter: (cell, row) => percentageFormatter(cell),
    },
    {
      dataField: campaignType.ordersAttr,
      text: 'Orders',
      sort: true,
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };

    Object.keys(newParams)
      .filter((key) => key.includes('sort'))
      .forEach((key) => {
        delete newParams[key];
      });

    if (sortField) {
      newParams[`sort[${sortField}]`] = sortOrder;
    }

    setParams(newParams);
  };

  const listingImagesFormatter = (cell) => (
    <img
      src={
        cell ??
        'https://images-na.ssl-images-amazon.com/images/I/01RmK%2BJ4pJL.gif'
      }
      className="avatar-small rounded"
    />
  );

  return (
    <Container fluid className="p-0">
      <Row className="mb-2">
        <Col md="7">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search asin or sku"
            name="asin,sku"
          />
        </Col>
        <Col md="3">
          <MetricsFilter
            onApplyFilter={setParams}
            params={params}
          ></MetricsFilter>
        </Col>
        <Col md="2" className="mb-sm-2" key={`${campaignType.key}Export`}>
          <ExportButton
            url={`ppc/${campaignType.key}/productAds/export`}
            params={params}
          />
        </Col>
      </Row>

      <Row>
        <Container fluid>
          <BootstrapTable
            remote
            bootstrap4
            bordered={false}
            keyField="sku"
            data={products.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: 10,
              sizePerPage: products.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: products.count ?? 0,
            })}
            wrapperClasses="table-responsive"
            hover
            striped
            onTableChange={onTableChange}
          />
        </Container>
      </Row>
    </Container>
  );
};

export default Products;
