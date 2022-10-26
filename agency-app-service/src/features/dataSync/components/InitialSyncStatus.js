import axios from 'axios';
import { startCase } from 'lodash';
import { useEffect, useState } from 'react';

import Table from 'components/Table';
import Checkbox from 'components/Forms/Checkbox';

import { statusFormatter } from '../utils/formatter';
import dataTypes from '../utils/dataTypes';

const InitialSyncStatus = () => {
  const [list, setList] = useState({ rows: [] });

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: '',
    sort: 'createdAt:desc',
    include: ['account'],
    scope: [],
  });

  useEffect(() => {
    axios.get('/data-sync/initial', { params }).then((response) => {
      setList(response.data.data);
    });
  }, [params]);

  const columns = [
    {
      dataField: 'accountId',
      text: 'Client',
      headerStyle: { minWidth: '180px' },
      formatter: (cell, row) => row.account.AgencyClient.client,
    },
    {
      dataField: 'account.spApiAuthorized',
      text: 'SP API',
      formatter: (cell) => (cell ? 'Yes' : 'No'),
    },
    {
      dataField: 'account.advApiAuthorized',
      text: 'SP API',
      formatter: (cell) => (cell ? 'Yes' : 'No'),
    },
    {
      dataField: 'inventory',
      text: 'Inventory',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'orders',
      text: 'orders',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'financialEvents',
      text: 'Financial Events',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'products',
      text: 'Products',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'reviews',
      text: 'Reviews',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'inboundFBAShipments',
      text: 'Shipments',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'inboundFBAShipmentItems',
      text: 'Shipment Items',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'advSnapshots',
      text: 'PPC Snapshots',
      formatter: (cell) => statusFormatter(cell),
    },
    {
      dataField: 'advPerformanceReport',
      text: 'PPC Performance',
      formatter: (cell) => statusFormatter(cell),
    },
  ];

  const onSearch = (e) => {
    let newParams = { ...params };
    newParams.search = e.target.value;
    setParams(newParams);
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const onFilterStatus = (dataType, status) => {
    let newParams = { ...params };
    delete newParams[dataType];

    if (status) {
      newParams[dataType] = status;
    }

    setParams(newParams);
  };

  const onFilterCredentials = (e) => {
    let newParams = { ...params };
    const { id, checked } = e.target;
    const newScope = checked
      ? [...newParams.scope, id]
      : newParams.scope.filter((scope) => scope !== id);

    newParams.scope = newScope;

    setParams(newParams);
  };

  const exportList = async () => {
    let exportParams = { ...params };
    delete exportParams.page;
    delete exportParams.pageSize;

    const response = await axios.get('/data-sync/initial/export', {
      params: exportParams,
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'],
      encoding: 'UTF-8',
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'initial-sync-status.csv';
    link.click();
  };

  return (
    <>
      <div className="grid grid-cols-2 mb-2">
        <input
          placeholder="Search client"
          className="mt-1 px-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
          onChange={onSearch}
        />
        <div className="flex items-center ">
          <div>
            <Checkbox
              id="spApiAuthorized"
              classes="my-2 mx-3"
              checked={params.scope.includes('spApiAuthorized')}
              onChange={onFilterCredentials}
            />
            <label className="text-sm font-medium text-gray-700 ml-2 w-full cursor-pointer">
              SP API Authorized
            </label>
          </div>

          <div>
            <Checkbox
              id="advApiAuthorized"
              classes="my-2 mx-3"
              checked={params.scope.includes('advApiAuthorized')}
              onChange={onFilterCredentials}
            />
            <label className="text-sm font-medium text-gray-700 ml-2 w-full cursor-pointer">
              Adv API Authorized
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-2">
        {dataTypes.map((dataType) => {
          return (
            <div key={dataType.dataField}>
              <select
                className="mt-1 px-2 py-1.5 shadow-sm block w-full border border-gray-300 rounded-md"
                onChange={(e) =>
                  onFilterStatus(dataType.dataField, e.target.value)
                }
              >
                <option key={`${dataType.dataField}-all`} value="">
                  {`All ${dataType.text}`}
                </option>
                {['COMPLETED', 'IN-PROGRESS', 'PENDING', 'FAILED'].map(
                  (status) => {
                    return (
                      <option
                        key={`${dataType.dataField}-${status}`}
                        value={status}
                      >
                        {`All ${startCase(status.toLowerCase())} ${
                          dataType.text
                        }`}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          );
        })}
        <button
          onClick={exportList}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Export
        </button>
      </div>

      <Table
        data={list}
        params={params}
        columns={columns}
        keyField="accountId"
        onTableChange={onTableChange}
        defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
      />
    </>
  );
};

export default InitialSyncStatus;
