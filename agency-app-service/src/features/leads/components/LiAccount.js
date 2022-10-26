import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Table } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import SlideOver from 'components/SlideOver';

import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import LiAccountForm from './LiAccountForm';
import { PlusIcon, PencilIcon } from '@heroicons/react/outline';

const LiAccount = ({ tabs }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [liAccounts, setLiAccounts] = useState({});
  const [selected, setSelected] = useState({
    name: '',
    email: '',
  });

  const { liAccountsPaginationParams } = useSelector((state) => state.leads);
  const { params, updateParams, sortParam } = useQueryParams({
    ...liAccountsPaginationParams,
  });

  const getLiAccounts = async () => {
    setLoading(true);
    try {
      await axios
        .get('/agency/leads/liAccounts', { params: params })
        .then((res) => {
          console.log('success ', res.data.data);
          setLiAccounts(res.data.data);
        });
    } catch (error) {
      console.log('error: ', error.response);
    }
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getLiAccounts();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

  const tableColumns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'gender',
      text: 'Gender',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'action',
      text: 'Action',
      className: 'text-center',
      formatter: (cell, row) => {
        return userCan('leads.settings.liAccount.manage') ? (
          <button onClick={() => onClickEdit(row)}>
            <PencilIcon className="m-1 h-5 w-5" />
          </button>
        ) : (
          ''
        );
      },
    },
  ];

  const onClickAdd = () => {
    setSelected({
      name: '',
      email: '',
      gender: '',
    });
    setOpen(true);
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const onClickEdit = (row) => {
    setSelected(row);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="LinkedIn Accounts"
        tabs={tabs}
        containerClasses={''}
        left={
          userCan('leads.settings.liAccount.manage') && (
            <button
              onClick={() => onClickAdd()}
              className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          )
        }
      />
      <Table
        columns={tableColumns}
        data={liAccounts}
        onTableChange={onTableChange}
        params={params}
        keyField="liAccountId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'name',
            order: sortParam ? sortParam[1] : 'desc',
          },
        ]}
        loading={loading}
      />
      <SlideOver
        open={open}
        setOpen={setOpen}
        title={selected.linkedInAccountId ? 'Update Record' : 'Add Record'}
        titleClasses="capitalize"
        size="3xl"
      >
        <div className="flow-root">
          <LiAccountForm
            data={selected}
            action={selected.linkedInAccountId ? 'update' : 'add'}
            setOpen={setOpen}
            getLiAccounts={getLiAccounts}
          />
        </div>
      </SlideOver>
    </>
  );
};

export default LiAccount;
