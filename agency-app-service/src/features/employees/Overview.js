import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { PlusIcon, PencilIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

import {
  fetchEmployees,
  fetchRoles,
  selectGroupsOptions,
  setSelectedSquad,
  setSelectedPod,
  setSelectedCell,
  fetchGroupsOptions,
  setSelectedType,
} from './employeesSlice';
import Table from 'components/Table';
import PageHeader from 'components/PageHeader';
import EmployeesSlideOver from './EmployeesSlideOver';
import { userCan } from 'utils/permission';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import Input from 'components/Forms/Input';
import { debounce, isEmpty } from 'lodash';
import EmployeeDropdown from './components/EmployeeDropdown';

const Overview = ({ tabs }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(selectAuthenticatedUser);
  const {
    employees,
    roles,
    types,
    groupsOptions,
    typeInitialOption,
    squadInitialOption,
    podInitialOption,
    cellInitialOption,
    selectedType,
    selectedSquad,
    selectedPod,
    selectedCell,
  } = useSelector((state) => state.employees);
  const { squads, pods, cells } = useSelector(selectGroupsOptions);
  const sortField = 'firstName';
  const sortOrder = 'asc';
  const defaultSorted = [{ dataField: sortField, order: sortOrder }];
  const [employeeSlideOver, setEmployeeSlideOver] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 50,
    sortField,
    sortOrder,
    type: selectedType.value,
    cellId: selectedCell.cellId,
    podId: selectedPod.podId,
    squadId: selectedSquad.squadId,
    search: '',
  });
  const [ddSquad, setDdSquad] = useState(null);
  const [ddPods, setDdPods] = useState(null);
  const [ddCells, setDdCells] = useState(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchEmployees(params)).then(() => {
      setLoading(false);
    });
  }, [dispatch, params, refresh]);

  useEffect(() => {
    if (roles.length <= 0) {
      setLoading(true);
      dispatch(fetchRoles()).then(() => {
        setLoading(false);
      });
    }
  }, [dispatch, roles]);

  useEffect(() => {
    if (isEmpty(groupsOptions)) {
      setLoading(true);
      dispatch(fetchGroupsOptions()).then(() => {
        setLoading(false);
      });
    } else {
      if (selectedType.value) {
        onChangeType(selectedType);
      }
      if (selectedSquad.squadId) {
        onChangeSquad(selectedSquad);
      }
      if (selectedPod.podId) {
        onChangePod(selectedPod);
      }
      if (selectedCell.cellId) {
        onChangeCell(selectedCell);
      }
      if (
        !selectedType.value &&
        !selectedSquad.squadId &&
        !selectedPod.podId &&
        !selectedCell.cellId
      ) {
        setDdSquad([squadInitialOption, ...squads]);
        setDdPods([podInitialOption, ...pods]);
        setDdCells([cellInitialOption, ...cells]);
      }
    }
  }, [dispatch, groupsOptions]);

  const tableColumns = [
    {
      dataField: 'firstName',
      text: 'FirstName',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'lastName',
      text: 'LastName',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'role.name',
      text: 'Role',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'role.department',
      text: 'Dept',
      sort: false,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'memberId.squad.name',
      text: 'Squad',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'memberId.pod.name',
      text: 'Pod',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'memberId.cell.name',
      text: 'Cell',
      sort: true,
      editable: false,

      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'action',
      text: 'Action',
      className: 'text-center',
      formatter: (cell, row) => {
        return userCan(user, 'employees.manage') ? (
          <button onClick={() => onOpenSlideOver(row)}>
            <PencilIcon className="h-4 w-4" color="red" />
          </button>
        ) : (
          ''
        );
      },
    },
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

  const onOpenSlideOver = (row) => {
    setSelectedRow(row);
    setEmployeeSlideOver(true);
  };

  const onClickAdd = () => {
    setSelectedRow({});
    setEmployeeSlideOver(true);
  };

  const updateSquadDropdown = (dd) => {
    if (dd.length > 0) {
      setDdSquad([squadInitialOption, ...dd]);
      dispatch(setSelectedSquad(squadInitialOption));
    } else {
      setDdSquad(null);
    }
  };

  const updatePodDropdown = (dd) => {
    if (dd.length > 0) {
      setDdPods([podInitialOption, ...dd]);
      dispatch(setSelectedPod(podInitialOption));
    } else {
      setDdPods(null);
    }
  };

  const updateCellDropdown = (dd) => {
    if (dd.length > 0) {
      setDdCells([cellInitialOption, ...dd]);
      dispatch(setSelectedCell(cellInitialOption));
    } else {
      setDdCells(null);
    }
  };

  const onChangeType = (e) => {
    dispatch(setSelectedType(e));
    setParams({
      ...params,
      type: e.value,
      squadId: null,
      podId: null,
      cellId: null,
    });

    updateSquadDropdown(
      e.value ? squads.filter((p) => p.type === e.value) : squads
    );
    updatePodDropdown(e.value ? pods.filter((p) => p.type === e.value) : pods);
    updateCellDropdown(
      e.value ? cells.filter((p) => p.type === e.value) : cells
    );
  };

  const onChangeSquad = (e) => {
    dispatch(setSelectedSquad(e));
    setParams({ ...params, squadId: e.squadId, podId: null, cellId: null });

    if (e.squadId) {
      const myPods = pods.filter((p) => p.squadId === e.squadId);
      const podIds = myPods.map((a) => a.podId);
      const myCells = cells.filter((p) => podIds.includes(p.podId));

      updatePodDropdown(myPods);
      updateCellDropdown(myCells);
    } else {
      updatePodDropdown(pods);
      updateCellDropdown(cells);
    }
  };

  const onChangePod = (e) => {
    dispatch(setSelectedPod(e));
    setParams({ ...params, podId: e.podId, cellId: null });
    updateCellDropdown(
      e.podId ? cells.filter((p) => p.podId === e.podId) : cells
    );
  };

  const onChangeCell = (e) => {
    dispatch(setSelectedCell(e));
    setParams({ ...params, cellId: e.cellId });
  };

  const handleSearchWithDebounce = debounce(async (e) => {
    setParams({ ...params, search: e.target.value });
  }, 500);

  return (
    <>
      <PageHeader
        title={t('Employees.Employees')}
        left={
          userCan(user, 'employees.create') ? (
            <button
              className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
              onClick={() => onClickAdd()}
            >
              <PlusIcon className="h-4 w-4" /> Add
            </button>
          ) : (
            ''
          )
        }
        tabs={tabs}
      />
      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center">
        <div className="col-span-4">
          <Input
            type="text"
            onChange={(e) => handleSearchWithDebounce(e)}
            placeholder="Search Firstname, Lastname, or Email..."
          />
        </div>
        <div className="col-span-1 flex bg-gray-200 rounded-md items-center">
          {types && (
            <EmployeeDropdown
              title="Type"
              data={[typeInitialOption, ...types]}
              schema={{
                label: 'label',
                description: '',
                value: 'value',
              }}
              selected={selectedType}
              onChange={onChangeType}
            />
          )}
        </div>
        <div className="col-span-1 flex bg-gray-200 rounded-md items-center">
          {ddSquad && (
            <EmployeeDropdown
              title="Squad"
              data={ddSquad}
              schema={{
                label: 'name',
                description: 'type',
                value: 'squadId',
              }}
              selected={selectedSquad}
              onChange={onChangeSquad}
            />
          )}
        </div>
        <div className="col-span-1 flex bg-gray-200 rounded-md items-center">
          {ddPods && (
            <EmployeeDropdown
              title="Pod"
              data={ddPods}
              schema={{
                label: 'name',
                description: 'type',
                value: 'podId',
              }}
              selected={selectedPod}
              onChange={onChangePod}
            />
          )}
        </div>
        <div className="col-span-1 flex bg-gray-200 rounded-md items-center">
          {ddCells && (
            <EmployeeDropdown
              title="Cell"
              data={ddCells}
              schema={{
                label: 'name',
                description: 'type',
                value: 'cellId',
              }}
              selected={selectedCell}
              onChange={onChangeCell}
            />
          )}
        </div>
      </div>
      <Table
        columns={tableColumns}
        data={employees}
        onTableChange={onTableChange}
        params={params}
        keyField="userId"
        defaultSorted={defaultSorted}
        loading={loading}
      />
      <EmployeesSlideOver
        open={employeeSlideOver}
        setOpen={setEmployeeSlideOver}
        row={selectedRow}
        roles={roles}
        employees={employees}
        refresh={refresh}
        setRefresh={setRefresh}
        employeeParams={params}
      />
    </>
  );
};

export default Overview;
