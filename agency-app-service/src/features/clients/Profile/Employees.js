import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { TrashIcon } from '@heroicons/react/outline';
import { PlusIcon } from '@heroicons/react/solid';
import Table from 'components/Table';
import { setAlert } from 'features/alerts/alertsSlice';
import AddEmployeeSlideOver from './AddEmployeeSlideOver';
import { dateFormatter } from 'utils/formatters';
import DeleteEmployeeModal from './DeleteEmployeeModal';

const Employees = ({ client }) => {
  const dispatch = useDispatch();

  const { agencyClientId } = client;

  const [addEmployeeSlideOver, setAddEmployeeSlideOver] = useState(false);
  const [deleteEmployeeModal, setDeleteEmployeeModal] = useState(false);
  const [employees, setEmployees] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortField: 'firstName',
    sortOrder: 'asc',
  });
  const defaultSorted = [
    { dataField: params.sortField, order: params.sortOrder },
  ];

  useEffect(() => {
    getAccountEmployees();
  }, [params]);

  const getAccountEmployees = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: `/agency/client/${agencyClientId}/employees`,
        params,
      });

      setEmployees(res.data.data);
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }

    setLoading(false);
  };

  const onAddEmployee = async (employee) => {
    const { email, userId } = employee;

    try {
      await setAddEmployeeSlideOver(false);

      await axios({
        method: 'POST',
        url: `/agency/client/${agencyClientId}/employees`,
        data: {
          userId,
        },
      });

      await dispatch(
        setAlert(
          'success',
          `Successfully added ${email} to ${client.client}'s account`
        )
      );

      await getAccountEmployees();
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }
  };

  const onDelete = async () => {
    const { userId, email } = employee;

    setDeleteEmployeeModal(false);

    try {
      await axios({
        method: 'DELETE',
        url: `/agency/client/${agencyClientId}/employees/${userId}`,
      });

      await dispatch(
        setAlert(
          'success',
          `Successfully removed ${email} from ${client.client}'s account`
        )
      );

      await getAccountEmployees();
    } catch (error) {
      await dispatch(setAlert('error', error.response.data.message));
    }

    setEmployee(null);
  };

  const onDeleteConfirm = (row) => {
    setEmployee(row);
    setDeleteEmployeeModal(true);
  };

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

  const tableColumns = [
    {
      dataField: 'firstName',
      text: 'First Name',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      sort: true,
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
      dataField: 'name',
      text: 'Role',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => (
        <span className="capitalize">{row.role.name}</span>
      ),
    },
    {
      text: 'Actions',
      headerStyle: {
        minWidth: '50px',
        textAlign: 'center',
      },
      formatter: (cell, row) => {
        return (
          <div className="flex justify-center align-center">
            <button onClick={() => onDeleteConfirm(row)}>
              <TrashIcon className="h-4 w-4" color="red" />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <>
      {employee && deleteEmployeeModal && (
        <DeleteEmployeeModal
          open={deleteEmployeeModal}
          setOpen={setDeleteEmployeeModal}
          employee={employee}
          client={client.client}
          onDelete={onDelete}
        />
      )}

      {addEmployeeSlideOver && (
        <AddEmployeeSlideOver
          open={addEmployeeSlideOver}
          setOpen={setAddEmployeeSlideOver}
          onAddEmployee={onAddEmployee}
        />
      )}

      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={() => setAddEmployeeSlideOver(!addEmployeeSlideOver)}
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Employee
        </button>
      </div>
      <Table
        columns={tableColumns}
        data={employees ? employees : []}
        onTableChange={onTableChange}
        params={params}
        keyField="userId"
        defaultSorted={defaultSorted}
        loading={loading}
      />
    </>
  );
};

export default Employees;
