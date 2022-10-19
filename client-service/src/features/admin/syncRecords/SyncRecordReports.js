import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { lowerFirst, startCase, toLower } from 'lodash';
import moment from 'moment';
import Loader from '../../../components/Loader';
import axios from 'axios';

import {
  selectSyncRecord,
  selectLoading,
  selectSyncRecordReports,
  getSyncRecordDetailsAsync,
  getSyncRecordReportsAsync,
} from './syncRecordsSlice';

import {
  Button,
  Container,
  Card,
  CardBody,
  Row,
  Col,
  Badge,
  ListGroup,
  ListGroupItem,
  Spinner,
} from 'reactstrap';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

import SelectFilter from '../../../components/filters/SelectFilter';

const formatDate = (date, format) => {
  return date ? moment(date).format(format) : '';
};

const processingTime = (start, end) => {
  if (!end) return '';
  const diffInMinutes = moment(end).diff(moment(start), 'minutes');

  if (diffInMinutes) {
    return `${diffInMinutes} mins.`;
  }
  return `${moment(end).diff(moment(start), 'seconds')} seconds`;
};

const statusFilters = (summary) => {
  return summary.map((s) => {
    const { status } = s;
    return { value: status.toUpperCase(), display: startCase(status) };
  });
};

const SyncRecordReports = () => {
  const { syncRecordId } = useParams();

  const syncRecord = useSelector(selectSyncRecord);
  const reports = useSelector(selectSyncRecordReports);
  const loading = useSelector(selectLoading);

  const dispatch = useDispatch();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    'sort[createdAt]': 'DESC',
  });

  const [retryingReports, setRetryingReports] = useState([]);

  useEffect(() => {
    dispatch(getSyncRecordDetailsAsync(syncRecordId));
    dispatch(getSyncRecordReportsAsync(syncRecordId, params));
  }, [syncRecordId, params, retryingReports]);

  const retryReport = (reportId) => {
    const endpoint = `${lowerFirst(syncRecord.reportsModel)}s`;
    axios({
      method: 'POST',
      url: `/syncRecords/${syncRecordId}/${endpoint}/${reportId}/retry`,
    })
      .then(() => setRetryingReports([...retryingReports, reportId]))
      .catch((err) => {
        alert(
          err.response
            ? err.response.data.message
            : 'Whoops! Something went wrong'
        );
      });
  };

  const tableColumns = [
    {
      dataField: `${lowerFirst(syncRecord.reportsModel)}Id`,
      text: 'ID',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: '120px' };
      },
    },
    {
      dataField: 'attempts',
      text: 'Attempts',
      sort: true,
      headerStyle: (colum, colIndex) => {
        return { width: '120px' };
      },
    },
    {
      dataField: 'message',
      text: 'Message',
      sort: false,
    },
    {
      dataField: 'startedAt',
      text: 'Started At',
      sort: true,
      formatter: (cell, row) => formatDate(cell, 'MM/DD/YYYY hh:mm:ss'),
    },
    {
      dataField: 'completedAt',
      text: 'Completed At',
      sort: true,
      formatter: (cell, row) => formatDate(cell, 'MM/DD/YYYY hh:mm:ss'),
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
          case 'processed':
            theme = 'success';
            break;
          case 'processing':
            theme = 'primary';
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

        return row.status == 'FAILED' ? (
          <div>
            <Badge className={`badge-${theme} mr-2 mb-1`}>{cell}</Badge>

            <Button
              onClick={() =>
                retryReport(row[`${lowerFirst(syncRecord.reportsModel)}Id`])
              }
              disabled={row.onQueue}
              className="rounded"
              size="sm"
              outline
              color="primary"
            >
              {row.onQueue ? (
                <div>
                  Retrying
                  <Spinner className="ml-2" size="sm" color="primary" />
                </div>
              ) : (
                'Retry'
              )}
            </Button>
          </div>
        ) : (
          <Badge className={`badge-${theme} mb-2`}>{cell}</Badge>
        );
      },
      headerStyle: (colum, colIndex) => {
        return { width: '150px' };
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

  return loading ? (
    <Loader></Loader>
  ) : (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">{`Sync Record #${syncRecordId} Reports`}</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h6 className="text-uppercase text-muted mb-3">Details</h6>
          <Row>
            <Col>
              <ListGroup className="mb-4">
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Account</span>
                  <span>{syncRecord.accountId}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Data Type</span>
                  <span>{startCase(syncRecord.dataType)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Sync Type</span>
                  <span>{startCase(syncRecord.syncType)}</span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Status</span>
                  <span>{startCase(toLower(syncRecord.status))}</span>
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col>
              <ListGroup className="mb-4">
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Started At</span>
                  <span>
                    {formatDate(
                      syncRecord.startedAt,
                      'MMMM Do YYYY, h:mm:ss a'
                    )}
                  </span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Completed At</span>
                  <span>
                    {formatDate(
                      syncRecord.completedAt,
                      'MMMM Do YYYY, h:mm:ss a'
                    )}
                  </span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Processing Time</span>
                  <span>
                    {processingTime(
                      syncRecord.startedAt,
                      syncRecord.completedAt
                    )}
                  </span>
                </ListGroupItem>
                <ListGroupItem className="d-flex justify-content-between align-items-center">
                  <span>Total Reports</span>
                  <span>{syncRecord.totalReports}</span>
                </ListGroupItem>
              </ListGroup>
            </Col>
            <Col>
              <ListGroup className="mb-4">
                <ListGroup className="mb-4">
                  {syncRecord.summary.map((s) => {
                    return (
                      <ListGroupItem
                        key={s.status}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <span>{startCase(s.status)}</span>
                        <span>{s.count}</span>
                      </ListGroupItem>
                    );
                  })}
                </ListGroup>
              </ListGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="mb-2 flex justify-content-end">
        <Col md="3">
          <SelectFilter
            name="status"
            placeholder="All Status"
            params={params}
            onApplyFilter={setParams}
            options={statusFilters(syncRecord.summary)}
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
                keyField={`${lowerFirst(syncRecord.reportsModel)}Id`}
                data={reports.rows ?? []}
                columns={tableColumns}
                pagination={paginationFactory({
                  sizePerPage: reports.pageSize ?? 10,
                  sizePerPageList: [10, 25, 50, 100],
                  totalSize: reports.count ?? 0,
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

export default SyncRecordReports;
