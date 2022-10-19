import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, CardBody, Badge, Row, Col, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import Moment from 'react-moment';
import { Edit3, Check } from 'react-feather';

import { fetchClients, getData, setClientLoaded } from './agencyClientsSlice';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Loading from 'components/Loading';

const AgencyClients = () => {
  const { agencyClients, dataLoaded } = useSelector(
    (state) => state.agencyClients
  );
  const dispatch = useDispatch();
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    'sort[client]': 'asc',
  });

  useEffect(() => {
    dispatch(fetchClients(params));
    dispatch(setClientLoaded(false));
  }, [params]);

  useEffect(() => {
    if (!dataLoaded) {
      dispatch(getData());
    }
  }, [dataLoaded]);

  const statusFormatter = (cell, row) => {
    let className = 'text-capitalize ';
    className +=
      cell === 'subscribed' ? 'badge-soft-success' : 'badge-soft-warning';
    const status = cell;

    return <Badge className={className}>{status}</Badge>;
  };

  // const amountFormatter = (cell, row) => {
  //   const formatter = new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: row.currency_code,
  //   });

  //   return formatter.format(cell);
  // };

  const dateFormatter = (cell, row) => {
    return <Moment format="L">{cell}</Moment>;
  };

  const tableColumns = [
    {
      dataField: 'client',
      text: 'Client',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return (
          <span>
            {row.Subscription ? (
              <Link
                className={'text-success'}
                to={`/clients/profile/${row.agencyClientId}`}
              >
                <Check size={14} />
              </Link>
            ) : (
              <Link to={`/clients/edit/${row.agencyClientId}`}>
                <Edit3 size={14} />
              </Link>
            )}
            <span className={'ml-2 text-capitalize'}>{cell}</span>
          </span>
        );
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'subscription',
      text: 'Subscription',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return row.Subscription ? (
          <Badge className="badge-soft-success text-capitalize">
            {row.Subscription.status}
          </Badge>
        ) : (
          ''
        );
      },
    },
    {
      dataField: 'activated_at',
      text: 'Activated At',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return row.Subscription ? (
          <Moment format="L">{row.Subscription.activatedAt}</Moment>
        ) : (
          ''
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return <Moment format="L">{row.createdAt}</Moment>;
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
              <h3 className="mb-0 text-white">Clients</h3>
            </Col>
            <Col xs="auto">
              <Link to="/clients/add">
                <Button color="light">Add Client</Button>
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Loading />
          <BootstrapTable
            remote
            bootstrap4
            hover
            striped
            bordered={false}
            keyField="agencyClientId"
            wrapperClasses="table-responsive"
            data={agencyClients.rows ?? []}
            columns={tableColumns}
            pagination={paginationFactory({
              sizePerPage: agencyClients.pageSize ?? 10,
              sizePerPageList: [10, 25, 50, 100],
              totalSize: agencyClients.count ?? 0,
            })}
            onTableChange={onTableChange}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default AgencyClients;
