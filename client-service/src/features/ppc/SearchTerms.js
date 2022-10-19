import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getSearchTermsAsync,
  selectList,
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
import ExportButton from '../../components/ExportButton';

import { Container, Row, Col } from 'reactstrap';

const SearchTerms = () => {
  const profile = useSelector(selectCurrentProfile);
  const selectedDates = useSelector(selectCurrentDateRange);
  const { startDate, endDate } = selectedDates;

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    startDate,
    endDate,
    attributes:
      'advSearchTermId,query,clicks,impressions,cost,attributedConversions30d,attributedSales30d,cr,acos,cpc,ctr',
  });

  const searchTerms = useSelector(selectList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSearchTermsAsync(params));
  }, [profile, params]);

  useEffect(() => {
    if (startDate != params.startDate || endDate != params.endDate)
      setParams({ ...params, startDate, endDate });
  }, [selectedDates]);

  const tableColumns = [
    {
      dataField: 'query',
      text: 'Query',
      sort: true,
      headerStyle: {
        width: '275px',
      },
    },
    {
      dataField: 'cost',
      text: 'Spend',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'attributedSales30d',
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
      text: 'Impressions',
      sort: true,
      headerStyle: {
        width: '115px',
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
      dataField: 'attributedConversions30d',
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

  return (
    <Container fluid className="p-0">
      <Row className="mb-2">
        <Col md="7">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search query"
            name="query"
          />
        </Col>
        <Col md="3">
          <MetricsFilter
            onApplyFilter={setParams}
            params={params}
          ></MetricsFilter>
        </Col>
        <Col md="2" className="mb-sm-2" key={`spExport`}>
          <ExportButton url="ppc/sp/searchTerms/export" params={params} />
        </Col>
      </Row>

      <Row>
        <Container fluid>
          <BootstrapTable
            remote
            bootstrap4
            bordered={false}
            keyField="advSearchTermId"
            data={searchTerms.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: searchTerms.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: searchTerms.count ?? 0,
            })}
            onTableChange={onTableChange}
            wrapperClasses="table-responsive"
            hover
            striped
          />
        </Container>
      </Row>
    </Container>
  );
};

export default SearchTerms;
