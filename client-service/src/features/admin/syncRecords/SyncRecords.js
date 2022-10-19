import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { startCase } from 'lodash';

import { selectSyncRecords, getSyncRecordsAsync } from './syncRecordsSlice';

import { Container, Card, CardBody, Row, Col, Badge } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import SelectFilter from '../../../components/filters/SelectFilter';
import SearchBar from '../../../components/filters/SearchBar';

const SyncRecords = () => {
  const syncRecords = useSelector(selectSyncRecords);
  const dispatch = useDispatch();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    'sort[createdAt]': 'DESC',
  });

  useEffect(() => {
    dispatch(getSyncRecordsAsync(params));
  }, [params]);

  const tableColumns = [
    {
      dataField: 'syncRecordId',
      text: 'ID',
      sort: true,
      formatter: (cell, row) => {
        return (
          <Link className="text-primary mb-2 h5" to={`/sync-records/${cell}`}>
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: 'accountId',
      text: 'Seller',
      sort: true,
    },
    {
      dataField: 'dataType',
      text: 'Data Type',
      sort: true,
      formatter: (cell, row) => startCase(cell),
    },
    {
      dataField: 'syncType',
      text: 'Sync Type',
      sort: true,
      formatter: (cell, row) => startCase(cell),
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      formatter: (cell, row) => {
        let theme;
        cell = cell.toLowerCase();

        switch (cell) {
          case 'completed':
            theme = 'success';
            break;
          case 'processing':
            theme = 'primary';
            break;
          case 'started':
            theme = 'secondary';
            break;
          case 'failed':
            theme = 'danger';
            break;
          case 'requested':
            theme = 'info';
            break;
          default:
            theme = 'warning';
            break;
        }

        return <Badge className={`badge-${theme}`}>{cell}</Badge>;
      },
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
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Sync Records</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="mb-2">
        <Col md="3">
          <SearchBar
            params={params}
            onApplyFilter={setParams}
            placeholder="Search Account"
            name="accountId"
          />
        </Col>
        <Col md="3">
          <SelectFilter
            name="dataType"
            placeholder="All Data Type"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'inventory', display: 'Inventory' },
              { value: 'products', display: 'Products' },
              { value: 'orders', display: 'Orders' },
              { value: 'reviews', display: 'Reviews' },
              {
                value: 'inboundFBAShipments',
                display: 'Inbound FBA Shipments',
              },
              {
                value: 'inboundFBAShipmentItems',
                display: 'Inbound FBA ShipmentItems',
              },
              { value: 'financialEvents', display: 'Financial Events' },
              { value: 'advSnapshots', display: 'Adv. Snapshots' },
              {
                value: 'advPerformanceReport',
                display: 'Adv. Performance Report',
              },
            ]}
          ></SelectFilter>
        </Col>

        <Col md="3">
          <SelectFilter
            name="syncType"
            placeholder="All Sync Type"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'initial', display: 'Initial' },
              { value: 'hourly', display: 'Hourly' },
              { value: 'daily', display: 'Daily' },
            ]}
          ></SelectFilter>
        </Col>

        <Col md="3">
          <SelectFilter
            name="status"
            placeholder="All Status"
            params={params}
            onApplyFilter={setParams}
            options={[
              { value: 'STARTED', display: 'Started' },
              { value: 'REQUESTING', display: 'Requesting' },
              { value: 'REQUESTED', display: 'Requested' },
              { value: 'PROCESSING', display: 'Processing' },
              { value: 'COMPLETED', display: 'Completed' },
              { value: 'FAILED', display: 'Failed' },
            ]}
          ></SelectFilter>
        </Col>
      </Row>

      <Row>
        <Container fluid>
          <Card>
            <CardBody>
              <BootstrapTable
                remote
                bootstrap4
                bordered={false}
                keyField="syncRecordId"
                data={syncRecords.rows ?? []}
                columns={tableColumns}
                pagination={paginationFactory({
                  sizePerPage: syncRecords.pageSize ?? 10,
                  sizePerPageList: [10, 25, 50, 100],
                  totalSize: syncRecords.count ?? 0,
                })}
                onTableChange={onTableChange}
                wrapperClasses="table-responsive"
                hover
                striped
              />
            </CardBody>
          </Card>
        </Container>
      </Row>
    </Container>
  );
};

export default SyncRecords;
