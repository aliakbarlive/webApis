import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  getTargetsAsync,
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
import { Container, Row, Col } from 'reactstrap';
import ExportButton from '../../components/ExportButton';

const Targets = () => {
  const profile = useSelector(selectCurrentProfile);
  const campaignType = useSelector(selectCampaignType);
  const selectedDates = useSelector(selectCurrentDateRange);
  const { startDate, endDate } = selectedDates;

  const [params, setParams] = useState({
    page: 1,
    endDate,
    startDate,
    pageSize: 10,
    attributes: `advTargetId,expression,targetingText,clicks,impressions,cost,${campaignType.ordersAttr},${campaignType.salesAttr},cr,acos,cpc,ctr,state,bid`,
  });

  const targets = useSelector(selectList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTargetsAsync(params));
  }, [profile, params]);

  useEffect(() => {
    if (startDate != params.startDate || endDate != params.endDate)
      setParams({ ...params, startDate, endDate });
  }, [selectedDates]);

  const tableColumns = [
    {
      dataField: 'targetingText',
      text: 'Target',
      sort: true,
      headerStyle: {
        width: '275px',
      },
    },
    {
      dataField: 'bid',
      text: 'Bid',
      sort: true,
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'state',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => stateFormatter(cell),
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
        <Col md="4">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search expression"
            name="targetingText"
          />
        </Col>
        <Col md="3">
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
        <Col md="2" className="mb-sm-2" key={`${campaignType.key}Export`}>
          <ExportButton
            url={`ppc/${campaignType.key}/targets/export`}
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
            keyField="advTargetId"
            data={targets.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: targets.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: targets.count ?? 0,
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

export default Targets;
