import { useEffect, useState } from 'react';
import axios from 'axios';
import { dateFormatterUTC, nameFormatter } from 'utils/formatters';
import { Table } from 'components';
import { Link, useHistory } from 'react-router-dom';
import Badge from 'components/Badge';
import classnames from 'classnames';
import _ from 'lodash';
import { ArrowSmRightIcon } from '@heroicons/react/outline';
import TerminationSlideOver from './components/TerminationSlideOver';
import TabNav from 'components/TabNav';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from './churnSlice';
import usePermissions from 'hooks/usePermissions';
import useQuery from 'hooks/useQuery';

const Terminations = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  let query = useQuery();
  const [loading, setLoading] = useState(false);
  const [terminations, setTerminations] = useState(null);
  const [client, setClient] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const defaultSorted = [{ dataField: 'createdAt', order: 'desc' }];
  const [params, setParams] = useState({
    page: parseInt(query.get('page') ?? 1),
    pageSize: parseInt(query.get('pageSize') ?? 30),
    search: query.get('search') ?? '',
    sort: query.get('sort') ?? 'createdAt:desc',
    status: query.get('status') ?? 'pending',
  });
  const [tabs, setTabs] = useState([
    { name: 'Pending', href: '#', count: '', current: true },
    { name: 'Approved', href: '#', count: '', current: false },
    { name: 'Cancelled', href: '#', count: '', current: false },
  ]);

  const getTerminations = async () => {
    setLoading(true);
    await axios.get(`/agency/terminations`, { params }).then((res) => {
      setTerminations(res.data.data);

      let myTabs = [...tabs];
      let currentTab = myTabs.find((t) => t.current === true);
      currentTab.current = false;
      let selectedTab = myTabs.find(
        (t) => t.name === _.capitalize(params.status)
      );
      selectedTab.current = true;
      selectedTab.count = res.data.data.count;
      setTabs(myTabs);
    });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getTerminations();
    }

    if (!loading) {
      getData();
    }
    dispatch(setCurrentPage(`Terminations`));
  }, [params]);

  const tableColumns = [
    {
      dataField: 'createdAt',
      text: 'Timestamp',
      sort: true,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return <span className="font-normal">{dateFormatterUTC(cell)}</span>;
      },
    },
    {
      dataField: 'Account Manager',
      text: 'Account Manager',
      sort: true,
      headerStyle: {
        minWidth: '250px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {nameFormatter(row.accountManager)}
            <br />
            <a
              href={`mailto:${row.accountManager?.email}`}
              className="text-red-500"
            >
              {row.accountManager?.email}
            </a>
          </span>
        );
      },
    },
    {
      dataField: 'Client',
      text: 'Client',
      sort: true,
      headerStyle: {
        minWidth: '200px',
      },
      formatter: (cell, row) => {
        return (
          <Link
            className="text-red-500 "
            to={`/clients/profile/${row.agencyClientId}`}
          >
            {row.agencyClient.client}
          </Link>
        );
      },
    },
    {
      dataField: 'terminationDate',
      text: 'Termination Date',
      sort: true,
      headerStyle: {
        minWidth: '190px',
      },
      formatter: (cell, row) => {
        return <span className="font-normal">{dateFormatterUTC(cell)}</span>;
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '120px',
      },
      formatter: (cell) => {
        return (
          <Badge
            color={classnames({
              green: cell === 'approved',
              red: cell === 'cancelled',
              yellow: cell === 'pending',
            })}
            classes="uppercase"
            rounded="md"
          >
            {cell}
          </Badge>
        );
      },
    },
    {
      dataField: 'reason',
      text: 'Reason',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'moreInformation',
      text: 'More Information',
      sort: true,
      headerStyle: {
        minWidth: '320px',
      },
      formatter: (cell, row) => {
        return (
          <>
            <span className="whitespace-pre-wrap">
              {_.truncate(cell, {
                length: 80,
                separator: ' ',
              })}
            </span>
          </>
        );
      },
    },
    ...(userCan('termination.view')
      ? [
          {
            dataField: 'expand',
            text: 'Details',
            sort: false,
            headerStyle: {
              minWidth: '80px',
            },
            formatter: (cell, row) => {
              return (
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => showMoreInfo(row)}
                >
                  <ArrowSmRightIcon className="transform -rotate-45 w-5 h-5 inline" />
                </button>
              );
            },
          },
        ]
      : []),
  ];

  const updateParams = (newParams, search = false) => {
    setParams(newParams);
    query.set('page', newParams.page);
    query.set('pageSize', newParams.pageSize);
    query.set('status', newParams.status);
    query.set('sort', newParams.sort);

    if (search) {
      if (newParams.search === '') {
        query.delete('search');
      } else {
        query.set('search', newParams.search);
      }
    }

    history.push(window.location.pathname + '?' + query.toString());
  };

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = {
      ...params,
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    };
    updateParams(newParams);
  };

  const showMoreInfo = async (row) => {
    setSelected(row);
    await axios.get(`/agency/client/${row.agencyClientId}`).then((res) => {
      setClient(res.data.data);
      setOpen(true);
    });
  };

  const onSelectChange = (e) => {
    let newParams = {
      ...params,
      status: _.lowerCase(e.target.value),
    };

    updateParams(newParams);
  };

  const onClick = (selectedTab) => {
    let newParams = {
      ...params,
      status: _.lowerCase(selectedTab.name),
    };

    updateParams(newParams);
  };

  const updateTerminationDetails = async (details) => {
    await getTerminations();
  };

  return (
    terminations && (
      <>
        <TabNav
          tabs={tabs}
          setTabs={setTabs}
          onSelectChange={onSelectChange}
          onClick={onClick}
        />
        <Table
          columns={tableColumns}
          data={terminations}
          onTableChange={onTableChange}
          params={params}
          keyField="terminationId"
          defaultSorted={defaultSorted}
          loading={loading}
        />
        {client && (
          <TerminationSlideOver
            open={open}
            setOpen={setOpen}
            termination={selected}
            client={client}
            updateDetails={updateTerminationDetails}
          />
        )}
      </>
    )
  );
};

export default Terminations;
