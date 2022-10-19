import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCampaignsAsync,
  selectList,
  selectCurrentProfile,
  selectCampaignType,
} from '../ppcSlice';
import { selectCurrentDateRange } from 'components/datePicker/dateSlice';

import { Container, Row, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import {
  currencyFormatter,
  percentageFormatter,
  numberFormatter,
  stateFormatter,
} from 'utils/formatters';

import MetricsFilter from '../shared/MetricsFilter';
import SearchBar from 'components/filters/SearchBar';
import SelectFilter from 'components/filters/SelectFilter';

import ExportButton from 'components/ExportButton';

const CampaignList = () => {
  const profile = useSelector(selectCurrentProfile);
  const selectedDates = useSelector(selectCurrentDateRange);
  const campaigns = useSelector(selectList);
  const campaignType = useSelector(selectCampaignType);
  const dispatch = useDispatch();

  const additionalAttr = campaignType.key == 'sp' ? 'targetingType,' : '';
  const attributes = `advCampaignId,name,${additionalAttr}${campaignType.budgetAttr},state,clicks,impressions,cost,cr,acos,${campaignType.salesAttr},${campaignType.ordersAttr},cpc,ctr`;

  const { startDate, endDate } = selectedDates;
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    startDate,
    endDate,
    attributes,
  });

  const [tableColumns, setTableColumns] = useState([
    {
      dataField: 'name',
      text: 'Campaign',
      sort: true,
      headerStyle: {
        width: '275px',
      },
      formatter: (cell, row) => (
        <NavLink to={`/ppc/${campaignType.key}/campaigns/${row.advCampaignId}`}>
          {cell}
        </NavLink>
      ),
    },
    {
      dataField: 'targetingType',
      text: 'Targeting',
      sort: true,
      campaignType: ['sp'],
    },
    {
      dataField: campaignType.budgetAttr,
      text: 'Daily Budget',
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
  ]);

  useEffect(() => {
    setTableColumns(
      tableColumns.filter((col) =>
        'campaignType' in col
          ? col.campaignType.includes(campaignType.key)
          : true
      )
    );

    dispatch(getCampaignsAsync(params));
  }, [params, profile]);

  useEffect(() => {
    if (startDate != params.startDate || endDate != endDate)
      setParams({ ...params, startDate, endDate });
  }, [selectedDates]);

  // Handle table change.
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
      <Row className="mb-2" key="campaignFilters">
        <Col
          md={campaignType.key == 'sp' ? 2 : 5}
          className="mb-sm-2"
          key={`${campaignType.key}NameFilter`}
        >
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search name"
            name="name"
          />
        </Col>
        <Col md="2" className="mb-sm-2" key={`${campaignType.key}StateFilter`}>
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
        <Col
          md="3"
          className={`${campaignType.key == 'sp' ? '' : 'd-none'}`}
          key={`${campaignType.key}TargetingTypeFilter`}
        >
          <SelectFilter
            name="targetingType"
            placeholder="All Targeting Type"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'auto', display: 'Auto' },
              { value: 'manual', display: 'Manual' },
            ]}
          ></SelectFilter>
        </Col>
        <Col
          md="3"
          className="mb-sm-2"
          key={`${campaignType.key}MetricsFilter`}
        >
          <MetricsFilter
            onApplyFilter={setParams}
            params={params}
            additionalMetric={[
              {
                display: 'Budget',
                key: campaignType.budgetAttr,
                min: '',
                max: '',
              },
            ]}
          ></MetricsFilter>
        </Col>

        <Col md="2" className="mb-sm-2" key={`${campaignType.key}Export`}>
          <ExportButton
            url={`ppc/${campaignType.key}/campaigns/export`}
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
            keyField="advCampaignId"
            data={campaigns.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: campaigns.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: campaigns.count ?? 0,
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

export default CampaignList;
