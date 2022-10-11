import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserIcon } from '@heroicons/react/solid';

import { Table } from 'components';

import UserFormSlideOver from './UserFormSlideOver';

// Slices
import {
  selectUsers,
  getUsersAsync,
  selectCurrentAccount,
} from 'features/accounts/accountsSlice';

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const account = useSelector(selectCurrentAccount);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sort: 'firstName:asc',
  });

  const [user, setUser] = useState({});
  const [userModal, setUserModal] = useState(false);

  useEffect(() => {
    if (account) {
      dispatch(getUsersAsync(account.accountId, params));
    }
  }, [dispatch, account, params]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };
    delete newParams.sort;

    if (sortField && sortOrder) {
      newParams.sort = `${sortField}:${sortOrder}`;
    }
    setParams(newParams);
  };

  const onUserModalToggle = () => {
    setUserModal(!userModal);
  };

  const onAddUser = () => {
    setUser({});
    onUserModalToggle();
  };

  const onEditUser = (row) => {
    setUser(row);
    onUserModalToggle();
  };

  const columns = [
    {
      dataField: 'email',
      text: 'Email Address',
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
      formatter: (cell, row) => {
        return (
          <button className="text-red-500" onClick={() => onEditUser(row)}>
            {cell}
          </button>
        );
      },
    },
    {
      dataField: 'firstName',
      text: 'First Name',
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      sort: true,
      headerStyle: {
        minWidth: '130px',
      },
    },
  ];

  return (
    <>
      <UserFormSlideOver open={userModal} setOpen={setUserModal} user={user} />
      <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 sm:rounded-lg mb-3">
        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Users
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            <button
              onClick={() => onAddUser()}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <UserIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Add User
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              {users ? (
                <Table
                  keyField="userId"
                  columns={columns}
                  data={users}
                  onTableChange={onTableChange}
                  page={params.page}
                  pageSize={params.pageSize}
                />
              ) : (
                <strong>Loading....</strong>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
