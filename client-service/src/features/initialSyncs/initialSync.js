import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getInitialSyncAsync, selectInitialSyncList } from './initialSyncSlice';

import { Container, Card, CardBody, Badge, Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const InitialSync = () => {
  const initialSyncStatus = useSelector(selectInitialSyncList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitialSyncAsync());
  }, []);

  const statusFormatter = (cell, row) => {
    let className, status;
    if (cell === 'COMPLETED') {
      className = 'badge-soft-success';
      status = 'Completed';
    } else {
      className = 'badge-soft-warning';
      status = 'Pending';
    }

    return <Badge className={className}>{status}</Badge>;
  };

  const tableColumns = [
    {
      dataField: 'account.name',
      text: 'Account',
      sort: false,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'inventory',
      text: 'Inventory',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'orders',
      text: 'Orders',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'financialEvents',
      text: 'Financial Events',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'products',
      text: 'Products',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'reviews',
      text: 'Reviews',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'inboundFBAShipments',
      text: 'Inbound Shipments',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'inboundFBAShipmentItems',
      text: 'Inbound Shipment Items',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'advSnapshots',
      text: 'Adv. Snapshots',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'advPerformanceReport',
      text: 'Adv. Reports',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
  ];

  return (
    <Container fluid className="p-0">
      <Card className="bg-gradient">
        <CardBody>
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0 text-white">Accounts Initial Sync</h3>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row>
        <Container fluid>
          <Card>
            <CardBody>
              <BootstrapTable
                remote
                bootstrap4
                bordered={false}
                keyField="accountId"
                data={initialSyncStatus.rows ?? []}
                columns={tableColumns}
                pagination={paginationFactory({
                  sizePerPage: initialSyncStatus.pageSize ?? 10,
                  sizePerPageList: [10, 25, 50, 100],
                  totalSize: initialSyncStatus.count ?? 0,
                })}
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

export default InitialSync;
