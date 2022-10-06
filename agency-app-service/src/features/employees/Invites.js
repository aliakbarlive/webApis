import axios from 'axios';
import PageHeader from 'components/PageHeader';
import Table from 'components/Table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatter } from 'utils/formatters';
import { fetchInvites } from './employeesSlice';
import { MailIcon } from '@heroicons/react/solid';
import { setAlert } from 'features/alerts/alertsSlice';
import moment from 'moment';

const Invites = ({ tabs }) => {
  const { invites } = useSelector((state) => state.employees);
  const [loading, setLoading] = useState(false);
  const sortField = 'email';
  const sortOrder = 'asc';
  const defaultSorted = [{ dataField: sortField, order: sortOrder }];
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortField,
    sortOrder,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(fetchInvites(params)).then(() => {
      setLoading(false);
    });
  }, [params, dispatch]);

  const tableColumns = [
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
      dataField: 'userRole.name',
      text: 'Role',
      sort: false,
      editable: false,

      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => <span className="capitalize">{cell}</span>,
    },
    {
      dataField: 'inviteExpire',
      text: 'Expires At',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      editable: false,
      formatter: (cell, row) => (
        <span
          className={`font-normal ${isExpired(cell) ? 'text-red-600' : ''}`}
        >
          {dateFormatter(cell, 'DD MMM YYYY HH:MM a')}
        </span>
      ),
    },
    {
      dataField: 'action',
      text: 'Action',
      className: 'text-center',
      formatter: (cell, row) => {
        return (
          <button
            className="hover:text-red-600"
            title="Resend Invite"
            onClick={() => onResendInvite(row)}
          >
            <MailIcon className="w-4 h-4" />
          </button>
        );
      },
    },
  ];

  const isExpired = (expireDate) => {
    return moment().isAfter(expireDate);
  };

  const onResendInvite = async (row) => {
    await axios({
      method: 'GET',
      url: `/invites/${row.inviteId}/resend`,
    });

    dispatch(setAlert('success', `New invitation sent to ${row.email}`));
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

  return (
    <>
      <PageHeader title="Invites" tabs={tabs} />
      <button onClick={() => console.log('++++invites', invites)}>
        invites
      </button>
      <Table
        columns={tableColumns}
        data={invites}
        onTableChange={onTableChange}
        params={params}
        keyField="inviteId"
        defaultSorted={defaultSorted}
        loading={loading}
      />
    </>
  );
};
export default Invites;
