import React, { useState } from 'react';

import Table from 'components/Table';
import { dateFormatter } from 'utils/formatters';

const Client = (clients, employee) => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortField: 'name',
    sortOrder: 'asc',
  });
  const defaultSorted = [
    { dataField: params.sortField, order: params.sortOrder },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };

    Object.keys(newParams)
      .filter((key) => key.includes('sort'))
      .forEach((key) => {
        delete newParams[key];
      });

    if (sortField) {
      newParams['sortField'] = sortField;
      newParams['sortOrder'] = sortOrder;
    }

    setParams(newParams);
  };

  const tableColumns = [
    {
      dataField: 'name',
      text: 'Account',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'role',
      text: 'Employee Role',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <span className="capitalize">
            {employee.role ? employee.role.name : ''}
          </span>
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">{dateFormatter(row.createdAt)}</span>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={tableColumns}
        data={clients}
        onTableChange={onTableChange}
        params={params}
        keyField="name"
        defaultSorted={defaultSorted}
      />
    </>
  );
};

export default Client;
