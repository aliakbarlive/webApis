import axios from 'axios';
import { useEffect, useState } from 'react';

import Table from 'components/Table';
import { startCase } from 'lodash';
import { statusFormatter } from '../utils/formatter';
import dataTypes from '../utils/dataTypes';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const SyncReports = () => {
  const [list, setList] = useState({ rows: [] });
  const { recordId } = useParams();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    sort: 'createdAt:desc',
  });

  useEffect(() => {
    axios
      .get('/data-sync/reports', {
        params: { ...params, syncRecordId: recordId },
      })
      .then((response) => {
        setList(response.data.data);
      });
  }, [params, recordId]);

  const retry = async (id) => {
    axios.post(`/data-sync/reports/${id}/retry`).then(() => {
      axios
        .get('/data-sync/reports', {
          params: { ...params, syncRecordId: recordId },
        })
        .then((response) => {
          setList(response.data.data);
        });
    });
  };

  const columns = [
    {
      dataField: 'syncReportId',
      text: 'ID',
    },
    {
      sort: true,
      dataField: 'date',
      text: 'Date',
    },
    {
      sort: true,
      dataField: 'status',
      text: 'status',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      sort: true,
      dataField: 'processingTime',
      text: 'processingTime',
      formatter: (cell) => `${cell} seconds`,
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
    {
      dataField: 'meta',
      text: 'Meta Data',
      formatter: (cell) => {
        return (
          <pre
            style={{
              fontSize: '10px',
              backgroundColor: '#1E1E1E',
            }}
          >
            {JSON.stringify(cell, undefined, 2)}
          </pre>
        );
      },
    },
    {
      dataField: 'action',
      text: 'Action',
      formatter: (cell, row) => {
        return (
          <button
            onClick={() => retry(row.syncReportId)}
            disabled={row.onQueue || row.status === 'PROCESSED'}
            className="text-xs py-1 px-4 rounded font-medium text-white bg-red-600"
          >
            Retry
          </button>
        );
      },
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
        keyField="syncReportId"
        onTableChange={onTableChange}
        defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
      />
    </>
  );
};

export default SyncReports;
