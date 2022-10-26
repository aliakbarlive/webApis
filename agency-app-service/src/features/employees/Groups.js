import axios from 'axios';
import PageHeader from 'components/PageHeader';
import Table from 'components/Table';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatter } from 'utils/formatters';
import { fetchGroupsByLevel } from './employeesSlice';
import { MailIcon } from '@heroicons/react/solid';
import { setAlert } from 'features/alerts/alertsSlice';
import moment from 'moment';

const Invites = ({ tabs }) => {
  const { groupsByLevel } = useSelector((state) => state.employees);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    level: 'squad',
    type: 'operations',
    page: 1,
    pageSize: 10,
  });
  const dispatch = useDispatch();

  const tableColumns = [
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      editable: false,
      headerStyle: {
        minWidth: '150px',
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    dispatch(fetchGroupsByLevel(params)).then(() => {
      setLoading(false);
    });
  }, [params, dispatch]);

  return (
    <>
      <PageHeader title="Groups" tabs={tabs} />
      <button
        onClick={() => console.log('+++++++=groupsByLevel', groupsByLevel)}
      >
        groupsByLevel
      </button>
      <Table
        columns={tableColumns}
        data={groupsByLevel}
        // onTableChange={onTableChange}
        params={params}
        keyField="id"
        // defaultSorted={defaultSorted}
        loading={loading}
      />
    </>
  );
};
export default Invites;
