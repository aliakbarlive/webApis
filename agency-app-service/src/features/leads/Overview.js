import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { cloneDeep } from 'lodash';
import { Table } from 'components';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import { setAlert } from 'features/alerts/alertsSlice';

import PageHeader from 'components/PageHeader';
import TabNav from 'components/TabNav';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import {
  PlusIcon,
  UserCircleIcon,
  DocumentDownloadIcon,
} from '@heroicons/react/outline';
import { setLeadsPaginationParams } from './leadsSlice';
import { dateFormatterUTC } from 'utils/formatters';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Label from 'components/Forms/Label';
import ColumnPicker from './components/ColumnPicker';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { setParams } from 'features/advertising/optimizations/optimizationSlice';

const Overview = ({ tabs, page }) => {
  const dispatch = useDispatch();
  const { userCan, isAgencySuperUser } = usePermissions();
  const history = useHistory();
  const [leads, setLeads] = useState({});
  const { leadsPaginationParams } = useSelector((state) => state.leads);
  const { params, updateParams, sortParam } = useQueryParams({
    ...leadsPaginationParams,
  });
  const me = useSelector(selectAuthenticatedUser);
  const memberId = cloneDeep(me.memberId);
  // const podId = me.memberId ? me.memberId.podId : undefined;
  const [loading, setLoading] = useState(false);
  const [assignToMe, setAssignToMe] = useState([]);

  const [navTabs, setNavTabs] = useState(
    page === 'Archived'
      ? [
          {
            name: 'No LinkedIn Available',
            href: '#',
            count: '',
            options: ['No LinkedIn Available'],
            current: true,
            visible: userCan('leads.list'),
          },
          {
            name: 'Unqualified',
            href: '#',
            count: '',
            options: ['Unqualified'],
            current: false,
            visible: userCan('leads.list'),
          },
          {
            name: 'Duplicate',
            href: '#',
            count: '',
            options: ['Duplicate'],
            current: false,
            visible: userCan('leads.list'),
          },
          {
            name: 'Out of Stock',
            href: '#',
            count: '',
            options: ['Out of Stock'],
            current: false,
            visible: userCan('leads.list'),
          },
          {
            name: 'Less than $5000',
            href: '#',
            count: '',
            options: ['Less than $5000'],
            current: false,
            visible: userCan('leads.list'),
          },
        ]
      : [
          {
            name: 'Old-Leads',
            href: '#',
            count: '',
            options: ['Old-Leads'],
            current: userCan('leads.oldLeads') && !userCan('leads.newLeads'),
            visible: userCan('leads.oldLeads'),
            countRed: true,
          },
          {
            name: 'Unprocessed New Leads',
            href: '#',
            count: '',
            options: ['Unprocessed New Leads'],
            current: userCan('leads.newLeads'),
            visible: userCan('leads.newLeads'),
            countRed: true,
          },
          // {
          //   name: 'New Leads',
          //   href: '#',
          //   count: '',
          //   options: ['New Leads'],
          //   current: userCan('leads.admin.list'),
          //   visible: userCan('leads.admin.list') || userCan('leads.manager'),
          //   countRed: true,
          // },
          {
            name: 'Approved',
            href: '#',
            count: '',
            options: ['Approved'],
            current: false,
            visible: userCan('leads.list'),
            countRed: true,
          },
          // {
          //   name: 'Revision',
          //   href: '#',
          //   count: '',
          //   options: ['Revision'],
          //   current: false,
          //   visible: userCan('leads.list'),
          //   countRed: true,
          // },
          // {
          //   name: 'Rejected',
          //   href: '#',
          //   count: '',
          //   options: ['Rejected'],
          //   current: false,
          //   visible: userCan('leads.list'),
          //   countRed: true,
          // },
          {
            name: 'Pitched',
            href: '#',
            count: '',
            options: ['Pitched-LL'],
            current: false,
            visible: userCan('leads.list'),
            countRed: true,
          },
          {
            name: 'New Response',
            href: '#',
            count: '',
            options: ['New Response'],
            current: false,
            visible: userCan('leads.list'),
            countRed: true,
          },
          {
            name: 'Booked',
            href: '#',
            count: '',
            options: [
              'Direct-Booking',
              'Positive-Response',
              'Neutral-Response',
              'Call-Booked',
              'RepliedTo',
            ],
            current: false,
            visible: userCan('leads.list'),
          },
        ].filter((tab) => tab.visible)
  );

  const getLeads = async () => {
    setLoading(true);
    await axios
      .get(`/agency/leads`, {
        params: {
          ...params,
          statuses: params.statuses,
          podId: me.memberId ? me.memberId.podId : '',
          leadsRep: me.userId,
        },
      })
      .then((res) => {
        dispatch(setLeadsPaginationParams(params));
        setLeads(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
    async function getData() {
      await getLeads();
    }

    getData();
  }, [params, navTabs]);

  useEffect(() => {
    let myTabs = [...navTabs];

    let currenTab = myTabs.find((t) => t.current === true);
    currenTab.current = false;
    let selectedTab = myTabs.find((t) => t.name === params.statuses);
    if (selectedTab) {
      selectedTab.current = true;
    } else {
      currenTab.current = true;
    }

    updateParams({
      ...params,
      statuses:
        params.statuses && navTabs.find((el) => el.name === params.statuses)
          ? params.statuses
          : page === 'Archived'
          ? 'No LinkedIn Available'
          : userCan('leads.oldLeads') && !userCan('leads.newLeads')
          ? 'Old-Leads'
          : 'Unprocessed New Leads',
      search: '',
      fields: 'all',
      pitcher: userCan('leads.pitcher'),
    });

    let countParams = {
      leadsRep: me.userId,
    };

    if (page === 'My Workplace') {
      axios
        .get(`/agency/leads/count`, {
          params: countParams,
        })
        .then((res) => {
          let resCount = res.data.data;
          let approvedIndex = myTabs.findIndex((el) => el.name === 'Approved');
          myTabs[approvedIndex].count = resCount.Approved.count;
          setAssignToMe(resCount.AssignedToMe.rows);
          setNavTabs(myTabs);
        });
    }
  }, []);

  const onViewProfile = (id) => {
    if (
      assignToMe.length > 0 &&
      ['Unprocessed New Leads', 'Old-Leads'].includes(params.statuses) &&
      !assignToMe.find((el) => el.leadId === id)
    ) {
      assignToMe.map((rec) => {
        dispatch(
          setAlert(
            'info',
            `In-progress in ${rec.status}`,
            `Company name: ${rec.companyName}`
          )
        );
      });
    } else {
      history.push(`/leads/profile/${id}`);
    }
  };

  const [tableColumns, setTableColumns] = useState([
    {
      dataField: 'companyName',
      text: 'Company Name',
      sort: true,
      show: true,
      hideable: false,
      headerStyle: {
        minWidth: '200px',
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        position: 'sticky',
        left: 0,
        zIndex: 1,
      },
      style: {
        whiteSpace: 'normal',
        backgroundColor: '#fff',
        position: 'sticky',
        left: 0,
        zIndex: 1,
      },
    },
    {
      dataField: 'lead',
      text: 'Lead First Name',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: true,
      hideable: false,
    },
    {
      dataField: 'leadLastName',
      text: 'Lead Last Name',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: true,
      hideable: false,
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: true,
      hideable: true,
    },

    {
      dataField: 'currentEarnings',
      text: 'Revenue',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'productCategory',
      text: 'Product Category',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'subCategory2',
      text: 'SubCategory 2',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'asinFullTitle',
      text: 'ASIN Full Title',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'leadType',
      text: 'Lead Type',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'linkedinContact',
      text: 'Linkedin Contact',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'instagram',
      text: 'Instagram',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'facebook',
      text: 'Facebook',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },
    {
      dataField: 'decisionMakersEmail',
      text: 'Decision Makers Email',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      show: false,
      hideable: true,
    },

    {
      dataField: 'processedByUser',
      text: 'Leads Rep',
      // sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? `${cell.firstName} ${cell.lastName}` : ''}
          </span>
        );
      },
      show: true,
      hideable: true,
    },
    {
      dataField: 'pitchedByUser',
      text: 'Pitcher',
      // sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? `${cell.firstName} ${cell.lastName}` : ''}
          </span>
        );
      },
      show: true,
      hideable: true,
    },
    {
      dataField: 'pitchDate',
      text: 'Pitch Date Added',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? dateFormatterUTC(cell, 'DD MMM YYYY HH:mm') : ''}
          </span>
        );
      },
      show: true,
      hideable: true,
    },

    {
      dataField: 'dateBooked',
      text: 'Date Booked',
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
      show: false,
      hideable: true,
    },
    {
      dataField: 'dateOfCall',
      text: 'Date Call',
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
      show: false,
      hideable: true,
    },
    {
      dataField: 'dateTimeOfResponse',
      text: 'Response Date',
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
      show: false,
      hideable: true,
    },
    {
      dataField: 'dateTimeWeResponded',
      text: 'Our Response Date',
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
      show: false,
      hideable: true,
    },
  ]);

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const onTabChange = (tab) => {
    updateParams({
      statuses: tab.name,
      status: '',
    });
  };

  const fieldOptions = [
    { label: 'All', value: 'all' },
    { label: 'Lead First Name', value: 'lead' },
    { label: 'Lead Last Name', value: 'leadLastName' },
    { label: 'Company Name', value: 'companyName' },
    { label: 'Email', value: 'email' },
    { label: 'Website', value: 'website' },
    { label: 'Product Category', value: 'productCategory' },
  ];

  const onChangeField = (e) => {
    updateParams({
      ...params,
      fields: e.target.value,
    });
  };
  const onSearch = (e) => {
    updateParams({
      ...params,
      search: e.target.value,
    });
  };

  return (
    <>
      <PageHeader
        title={page === 'My Workplace' ? 'Leads' : 'Archive'}
        // tabs={page === 'My Workplace' ? tabs.filter((e) => e.isTab) : []}
        containerClasses={''}
        left={
          userCan('leads.create') &&
          page === 'My Workplace' && (
            <>
              <Link
                className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
                onClick={() => {
                  history.push(`/leads/profile/create`);
                }}
              >
                <PlusIcon className="h-4 w-4" /> Add
              </Link>
              {userCan('leads.upload.unassignedLeads') && (
                <Link
                  to="/leads/import"
                  className="flex items-center uppercase px-2 rounded-sm py-1 border bg-red-500 hover:bg-red-600 border-red-300 text-xs text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300 ml-2"
                >
                  <DocumentDownloadIcon className="inline w-4 h-4 mr-1" />{' '}
                  Import
                </Link>
              )}
            </>
          )
        }
      />
      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center pt-5">
        <div className="sm:col-span-1">
          <Label htmlFor="search">Search</Label>
          <Input
            name="search"
            value={params.search}
            onChange={onSearch}
            type="text"
            placeholder={'Search'}
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="field">Search Field</Label>
          <Select
            name="field"
            className={`appearance-none px-3 py-2 border shadow-sm placeholder-gray-400 focus:ring-red-500 focus:border-red-500 `}
            onChange={onChangeField}
            value={params.fields}
          >
            {fieldOptions.map((option, index) => {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </Select>
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="column_picker">Column Metrics</Label>
          <ColumnPicker
            options={tableColumns}
            setTableColumns={setTableColumns}
          />
        </div>
      </div>

      <TabNav
        tabs={navTabs}
        setTabs={setNavTabs}
        onClick={(tab) => onTabChange(tab)}
      />

      <Table
        columns={[
          ...tableColumns.filter((el) => el.show),
          {
            dataField: 'action',
            text: 'Action',
            className: 'text-center',
            formatter: (cell, row) => {
              return userCan('leads.view') ? (
                <>
                  <button
                    // onClick={() => history.push(`/leads/profile/${row.leadId}`)}
                    onClick={() => onViewProfile(row.leadId)}
                    data-tip="Profile"
                  >
                    <ReactTooltip
                      place="top"
                      className="max-w-xs text-black"
                      backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                      textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
                    />
                    <UserCircleIcon
                      className="m-1 h-5 w-5"
                      color={
                        assignToMe.length > 0 &&
                        !assignToMe.find((el) => el.leadId === row.leadId) &&
                        ['Unprocessed New Leads', 'Old-Leads'].includes(
                          params.statuses
                        )
                          ? 'grey'
                          : 'green'
                      }
                    />
                  </button>
                </>
              ) : (
                ''
              );
            },
          },
        ]}
        data={leads}
        onTableChange={onTableChange}
        params={params}
        keyField="leadId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'pitchDate',
            order: sortParam ? sortParam[1] : 'desc',
          },
        ]}
        loading={loading}
      />
    </>
  );
};

export default Overview;
