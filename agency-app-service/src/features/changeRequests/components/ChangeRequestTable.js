import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FolderOpenIcon } from '@heroicons/react/outline';

import { selectList, getChangeRequestsAsync } from '../changeRequestsSlice';

import Table from 'components/Table';
import ChangeRequestStatus from './ChangeRequestStatus';
import PageHeader from 'components/PageHeader';

const ChangeRequestTable = () => {
  const dispatch = useDispatch();
  const list = useSelector(selectList);

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sort: 'createdAt:desc',
  });

  useEffect(() => {
    dispatch(getChangeRequestsAsync(params));
  }, [dispatch, params]);

  const columns = [
    {
      dataField: 'client',
      text: 'Client',
      headerStyle: { minWidth: '180px' },
      formatter: (cell, row) => {
        return (
          <div>
            <p>{cell.client}</p>
            <span className="text-xs text-gray-400">
              {row.advProfile.account.name}
            </span>
          </div>
        );
      },
    },
    {
      dataField: 'requestor',
      text: 'Requested By',
      headerStyle: { minWidth: '180px' },
      formatter: (cell) => `${cell.firstName} ${cell.lastName}`,
    },
    {
      dataField: 'createdAt',
      text: 'Requested At',
      sort: true,
      headerStyle: { minWidth: '180px' },
      formatter: (cell) => moment(cell).format('MMMM Do YYYY, h:mm:ss a'),
    },
    {
      dataField: 'description',
      text: 'Description',
      headerStyle: { minWidth: '350px' },
    },
    {
      dataField: 'totalCount',
      text: 'Status',
      formatter: (cell, row) => {
        return (
          <>
            <ChangeRequestStatus count={row.pendingCount} status="pending" />
            <ChangeRequestStatus count={row.approvedCount} status="approved" />
            <ChangeRequestStatus count={row.rejectedCount} status="rejected" />
          </>
        );
      },
    },
    {
      dataField: 'advChangeRequestId',
      text: 'Actions',
      formatter: (cell) => (
        <NavLink to={`/change-requests/${cell}`}>
          <FolderOpenIcon className="h-6 w-6 cursor-pointer" />
        </NavLink>
      ),
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

  return (
    <>
      <PageHeader title="Change Requests" />

      <Table
        data={list}
        params={params}
        columns={columns}
        keyField="advChangeRequestId"
        onTableChange={onTableChange}
        defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
      />
    </>
  );
};

export default ChangeRequestTable;
