import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getKeywordsAsync,
  selectList,
  selectCurrentProfile,
  selectCampaignType,
} from './ppcSlice';
import { selectCurrentDateRange } from 'components/datePicker/dateSlice';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {
  currencyFormatter,
  percentageFormatter,
  numberFormatter,
  stateFormatter,
} from 'utils/formatters';

import MetricsFilter from './shared/MetricsFilter';
import SearchBar from '../../components/filters/SearchBar';
import SelectFilter from '../../components/filters/SelectFilter';

import ExportButton from '../../components/ExportButton';
import { Container, Row, Col } from 'reactstrap';

const Keywords = () => {
  const profile = useSelector(selectCurrentProfile);
  const campaignType = useSelector(selectCampaignType);
  const keywords = useSelector(selectList);
  const selectedDates = useSelector(selectCurrentDateRange);
  const dispatch = useDispatch();

  const { startDate, endDate } = selectedDates;

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    startDate,
    endDate,
    attributes: `advKeywordId,advAdGroupId,keywordText,matchType,clicks,impressions,cost,${campaignType.salesAttr},${campaignType.ordersAttr},bid,state,cr,acos,cpc,ctr`,
  });

  useEffect(() => {
    dispatch(getKeywordsAsync(params));
  }, [profile, params]);

  useEffect(() => {
    if (startDate != params.startDate || endDate != params.endDate)
      setParams({ ...params, startDate, endDate });
  }, [selectedDates]);

  const tableColumns = [
    {
      dataField: 'keywordText',
      text: 'Keyword',
      sort: true,
      headerStyle: {
        width: '200px',
      },
    },
    {
      dataField: 'matchType',
      text: 'Match Type',
      sort: true,
      headerStyle: {
        width: '125px',
      },
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => stateFormatter(cell),
    },
    {
      dataField: 'bid',
      text: 'Bid',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
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

  return (
    <Container fluid className="p-0">
      <Row className="mb-2">
        <Col md="3">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search keyword text"
            name="keywordText"
          />
        </Col>
        <Col md="2">
          <SelectFilter
            name="matchType"
            placeholder="All Match Type"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'exact', display: 'Exact' },
              { value: 'phrase', display: 'Phrase' },
              { value: 'broad ', display: 'Broad' },
            ]}
          ></SelectFilter>
        </Col>
        <Col md="2">
          <SelectFilter
            name="state"
            placeholder="All Status"
            onApplyFilter={setParams}
            params={params}
            options={[
              { value: 'enabled', display: 'Enabled' },
              { value: 'paused', display: 'Paused' },
              { value: 'archived', display: 'Archived' },
            ]}
          ></SelectFilter>
        </Col>
        <Col md="3">
          <MetricsFilter
            onApplyFilter={setParams}
            params={params}
            additionalMetric={[
              { display: 'Bid', key: 'bid', min: '', max: '' },
            ]}
          ></MetricsFilter>
        </Col>
        <Col md="2">
          <ExportButton
            url={`ppc/${campaignType.key}/keywords/export`}
            params={params}
          />
        </Col>
      </Row>

      <Row>
        <Container fluid>
          <BootstrapTable
            bootstrap4
            remote
            bordered={false}
            keyField="advKeywordId"
            data={keywords.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: 10,
              sizePerPage: keywords.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: keywords.count ?? 0,
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

export default Keywords;
