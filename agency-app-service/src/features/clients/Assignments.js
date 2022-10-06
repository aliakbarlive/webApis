import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _, { set } from 'lodash';
import { Link } from 'react-router-dom';

import classnames from 'classnames';
import Badge from 'components/Badge';
import PageHeader from 'components/PageHeader';
import Label from 'components/Forms/Label';
import Input from 'components/Forms/Input';
import useQuery from 'hooks/useQuery';
import useQueryParams from 'hooks/useQueryParams';
import Table from 'components/Table';
import { dateFormatterUTC } from 'utils/formatters';

import { fetchUnassignedClients } from './clientsSlice';
import AssignmentSlider from './Form/AssignmentSlider';

import usePermissions from 'hooks/usePermissions';

const Assignments = () => {
  const { userCan, isAgencySuperUser } = usePermissions();
  let query = useQuery();
  const dispatch = useDispatch();
  const { unAssignedAgencyClients, paginationParams } = useSelector(
    (state) => state.clients
  );
  const { params, updateParams, sortParam } = useQueryParams(paginationParams);
  const [updated, setUpdated ] = useState(false);
  const [search, setSearch] = useState(query.get('search') ?? '');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [row, setRow] = useState(null);

  useEffect(() => {
    if (!updated) {
      updateParams({ page: 1, pageSize: '30', search }, true);
      setUpdated(true);
    }
    else if (!loading) {
      setLoading(true);
      dispatch(fetchUnassignedClients(params)).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, params, refresh]);

  const updateParamsSearch = ({ search, params }) => {
    updateParams({ page: 1, search }, true);
  };

  const debouncedUpdateSearch = useCallback(
    _.debounce((value) => updateParamsSearch(value), 500),
    []
  );

  const onSearch = (e) => {
    setSearch(e.target.value);
    debouncedUpdateSearch({ search: e.target.value, params });
  };

  const onAssign = (row) => {
    setRow(row);
    setOpen(true);
  };

  const tableColumns = [
    {
      dataField: 'client',
      text: 'Client',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        let to = `/clients/profile/${row.agencyClientId}`;
        return (
          <Link className={`font-normal`} to={to}>
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: false,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return <span className="text-black">{row.defaultContact.email}</span>;
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return (
          <>
            <Badge
              color={classnames({
                green: cell === 'subscribed',
                red: cell === 'registered',
                yellow: cell === 'draft',
                blue: cell === 'invited',
                purple: cell === 'cancelled',
              })}
              classes="uppercase"
              rounded="md"
            >
              {cell}
            </Badge>
          </>
        );
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created At',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return (
          cell && <span className="font-normal">{dateFormatterUTC(cell)}</span>
        );
      },
    },
    {
      dataField: 'action',
      text: 'Action',
      sort: true,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return userCan('clients.assignment.assign') ? (
          <button
            className="border px-2 py-1 rounded mr-1 bg-blue-300 text-white"
            title="Manually Approve"
            onClick={() => onAssign(row)}
          >
            Assign
          </button>
        ) : (
          <>-</>
        );
      },
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  return (
    <>
      <PageHeader title="Client Assignments" left="" />
      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center">
        <div className="sm:col-span-1 flex items-center bg-gray-200 rounded-md">
          <Label htmlFor="search_client" classes="px-2" textSize="xs">
            Client
          </Label>
          <Input
            name="search"
            value={search}
            onChange={onSearch}
            type="text"
            placeholder="Search Client"
          />
        </div>
      </div>

      <Table
        columns={tableColumns}
        data={unAssignedAgencyClients}
        onTableChange={onTableChange}
        params={params}
        keyField="agencyClientId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'client',
            order: sortParam ? sortParam[1] : 'asc',
          },
        ]}
        loading={loading}
      />

      <AssignmentSlider
        open={open}
        setOpen={setOpen}
        refresh={refresh}
        setRefresh={setRefresh}
        row={row}
        setRow={setRow}
      />
    </>
  );
};

export default Assignments;
