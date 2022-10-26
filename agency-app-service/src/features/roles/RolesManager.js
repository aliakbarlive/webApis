import { Route, Switch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import { PlusIcon, PencilIcon } from '@heroicons/react/outline';

import SlideOver from 'components/SlideOver';
import { Table } from 'components';
import RoleForm from './RoleForm';

const RolesManager = () => {
  const { userCan } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState({});
  const [params, setParams] = useState({
    page: 1,
    pageSize: 30,
  });

  const [selected, setSelected] = useState({
    roleId: -1,
    name: '',
    level: '',
    groupLevel: '',
    allowPerGroup: 1,
    hasAccessToAllClients: false,
    department: '',
    seniorityLevel: 1,
  });

  const getRoles = async () => {
    setLoading(true);
    await axios.get(`/agency/roles`, { params: params }).then((res) => {
      setParams(params);
      setRoles(res.data.data);
    });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getRoles();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    setParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder} nulls last`,
    });
  };
  const onClickEdit = (row) => {
    setSelected(row);
    setOpen(true);
  };

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
      dataField: 'level',
      text: 'level',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'groupLevel',
      text: 'groupLevel',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'allowPerGroup',
      text: 'allowPerGroup',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'department',
      text: 'department',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'seniorityLevel',
      text: 'seniorityLevel',
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
        return userCan('roles.manage') ? (
          <button onClick={() => onClickEdit(row)}>
            <PencilIcon className="m-1 h-5 w-5" />
          </button>
        ) : (
          ''
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Roles"
        containerClasses={''}
        left={
          userCan('roles.manage') && (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          )
        }
      />

      <Table
        columns={tableColumns}
        data={roles}
        onTableChange={onTableChange}
        params={params}
        keyField="roleId"
        defaultSorted={[{ dataField: 'name', order: 'asc' }]}
        loading={loading}
      />

      <SlideOver
        open={open}
        setOpen={setOpen}
        title={selected.roleId === -1 ? 'Add Record' : 'Update Record'}
        titleClasses="capitalize"
        size="3xl"
      >
        <div className="flow-root">
          <RoleForm
            data={selected}
            action={selected.roleId === -1 ? 'add' : 'update'}
            setOpen={setOpen}
            getRoles={getRoles}
          />
        </div>
      </SlideOver>
    </div>
  );
};

export default RolesManager;
