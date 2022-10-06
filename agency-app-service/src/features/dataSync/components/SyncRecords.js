import axios from 'axios';
import { useEffect, useState } from 'react';

import Table from 'components/Table';
import { startCase } from 'lodash';
import { statusFormatter } from '../utils/formatter';
import dataTypes from '../utils/dataTypes';
import moment from 'moment';
import { Link } from 'react-router-dom';

const SyncRecords = () => {
  const [list, setList] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    sort: 'createdAt:desc',
    include: ['account'],
  });

  useEffect(() => {
    axios.get('/data-sync/records', { params }).then((response) => {
      setList(response.data.data);
    });
  }, [params]);

  const columns = [
    {
      dataField: 'syncRecordId',
      text: 'ID',
      formatter: (value) => (
        <Link to={`/data-sync/records/${value}`}>{value}</Link>
      ),
    },
    {
      dataField: 'account',
      text: 'Client',
      headerStyle: { minWidth: '180px' },
      formatter: (cell) => cell.AgencyClient.client,
    },
    {
      sort: true,
      dataField: 'syncType',
      text: 'syncType',
      formatter: (cell) => startCase(cell),
    },
    {
      sort: true,
      dataField: 'dataType',
      text: 'dataType',
      formatter: (cell) => startCase(cell),
    },
    {
      sort: true,
      dataField: 'status',
      text: 'status',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      sort: true,
      dataField: 'totalReports',
      text: 'totalReports',
      formatter: (cell, row) => `${cell - row.pendingReports} / ${cell}`,
    },
    {
      sort: true,
      dataField: 'startedAt',
      text: 'startedAt',
      formatter: (cell) => moment(cell).format('MMMM Do, h:mm:ss a'),
    },
    {
      sort: true,
      dataField: 'completedAt',
      text: 'completedAt',
      formatter: (cell) =>
        cell ? moment(cell).format('MMMM Do, h:mm:ss a') : '',
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const onSearch = (e) => {
    let newParams = { ...params };
    newParams.search = e.target.value;
    setParams(newParams);
  };

  const onChangeFilter = (e) => {
    const { value, name } = e.target;
    let newParams = { ...params };
    delete newParams[name];

    if (value) {
      newParams[name] = value;
    }

    setParams(newParams);
  };

  return (
    <>
      <div className="grid grid-cols-5 gap-2 mb-2">
        <input
          placeholder="Search client"
          className="mt-1 px-2 col-span-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
          onChange={onSearch}
        />
        <select
          name="syncType"
          className="mt-1 px-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
          onChange={onChangeFilter}
        >
          <option value="">All Sync Types</option>
          <option value="initial">Initial</option>
          <option value="daily">Daily</option>
          <option value="hourly">Hourly</option>
        </select>
        <select
          name="dataType"
          className="mt-1 px-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
          onChange={onChangeFilter}
        >
          <option value="">All Data Types</option>
          {dataTypes.map((dataType) => {
            return (
              <option value={dataType.dataField} key={dataType.dataField}>
                {dataType.text}
              </option>
            );
          })}
        </select>
        <select
          name="status"
          className="mt-1 px-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
          onChange={onChangeFilter}
        >
          <option value="">All Status</option>
          {[
            'STARTED',
            'REQUESTING',
            'REQUESTED',
            'PROCESSING',
            'PROCESSED',
            'FAILED',
          ].map((status) => (
            <option key={status} value={status}>
              {startCase(status.toLowerCase())}
            </option>
          ))}
        </select>
      </div>

      <Table
        data={list}
        params={params}
        columns={columns}
        keyField="syncRecordId"
        onTableChange={onTableChange}
        defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
      />
    </>
  );
};

export default SyncRecords;
