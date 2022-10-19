import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getUsersAsync, selectUsers } from './usersSlice';

import { Container, Card, CardBody, Badge } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

import Header from './Header';

const Users = () => {
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersAsync());
  }, []);

  const statusFormatter = (cell, row) => {
    let className, status;
    if (cell === true) {
      className = 'badge-soft-success';
      status = 'Verified';
    } else {
      className = 'badge-soft-warning';
      status = 'Pending';
    }

    return <Badge className={className}>{status}</Badge>;
  };

  const tableColumns = [
    {
      dataField: 'firstName',
      text: 'First Name',
      sort: true,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      sort: true,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      headerStyle: {
        width: '250px',
      },
    },
    {
      dataField: 'roles[0].roleName',
      text: 'Type',
      sort: true,
      headerStyle: {
        width: '150px',
      },
    },
    {
      dataField: 'isEmailVerified',
      text: 'Account',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'isSPAPIAuthorized',
      text: 'Selling Partner API',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
    {
      dataField: 'isAdvAPIAuthorized',
      text: 'Advertising API',
      sort: true,
      headerStyle: {
        width: '150px',
      },
      formatter: statusFormatter,
    },
  ];

  return (
    <Container fluid className="p-0">
      <Header title="Users" />

      <Card>
        <CardBody>
          <BootstrapTable
            bootstrap4
            hover
            striped
            bordered={false}
            keyField="userId"
            wrapperClasses="table-responsive"
            data={users}
            columns={tableColumns}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default Users;
