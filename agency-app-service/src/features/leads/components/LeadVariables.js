import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import SlideOver from 'components/SlideOver';

import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import VariableForm from './VariableForm';
import { PlusIcon, PencilIcon } from '@heroicons/react/outline';
import { setLeadsVariablesPaginationParams } from '../leadsSlice';
import { dateFormatterUTC } from 'utils/formatters';

const LeadVariables = ({ tabs }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [variables, setVariables] = useState({});
  const [selected, setSelected] = useState({
    key: '',
    value: '',
    description: '',
  });
  const [open, setOpen] = useState(false);
  const { leadsVariablesPaginationParams } = useSelector(
    (state) => state.leads
  );
  const { params, updateParams, sortParam } = useQueryParams({
    ...leadsVariablesPaginationParams,
  });

  const getVariables = async () => {
    setLoading(true);
    await axios
      .get(`/agency/leads/variables`, { params: params })
      .then((res) => {
        dispatch(setLeadsVariablesPaginationParams(params));
        setVariables(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getVariables();
    }

    if (!loading) {
      getData();
    }
  }, [params]);

  const tableColumns = [
    {
      dataField: 'key',
      text: 'Key',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'value',
      text: 'Value',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created Date',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? dateFormatterUTC(cell) : ''}
          </span>
        );
      },
    },
    {
      dataField: 'action',
      text: 'Action',
      className: 'text-center',
      formatter: (cell, row) => {
        return userCan('leads.view') ? (
          <button onClick={() => onClickEdit(row)}>
            <PencilIcon className="m-1 h-5 w-5" />
          </button>
        ) : (
          ''
        );
      },
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder} nulls last`,
    });
  };

  const onClickAdd = () => {
    setSelected({
      key: '',
      value: '',
      description: '',
    });
    setOpen(true);
  };

  const onClickEdit = (row) => {
    setSelected(row);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Variable Settings"
        tabs={tabs}
        containerClasses={''}
        left={
          userCan('leads.create') && (
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
        data={variables}
        onTableChange={onTableChange}
        params={params}
        keyField="leadVariableId"
        defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
        loading={loading}
      />
      <SlideOver
        open={open}
        setOpen={setOpen}
        title={selected.leadVariableId ? 'Update Record' : 'Add Record'}
        titleClasses="capitalize"
        size="3xl"
      >
        <div className="flow-root">
          <VariableForm
            data={selected}
            action={selected.leadVariableId ? 'update' : 'add'}
            setOpen={setOpen}
            getVariables={getVariables}
          />
        </div>
      </SlideOver>
    </>
  );
};

export default LeadVariables;
