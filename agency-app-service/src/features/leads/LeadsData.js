import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';
import { Table } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import PageHeader from 'components/PageHeader';
import usePermissions from 'hooks/usePermissions';
import useQueryParams from 'hooks/useQueryParams';
import { UserCircleIcon } from '@heroicons/react/outline';
import { setAllLeadsPaginationParams } from './leadsSlice';
import { dateFormatterUTC } from 'utils/formatters';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Label from 'components/Forms/Label';

const LeadsData = ({ tabs }) => {
  const dispatch = useDispatch();
  const { userCan, isAgencySuperUser } = usePermissions();
  const history = useHistory();
  const [leads, setLeads] = useState({});
  const { allLeadsPaginationParams } = useSelector((state) => state.leads);
  const { user } = useSelector((state) => state.auth);
  const { params, updateParams, sortParam } = useQueryParams({
    ...allLeadsPaginationParams,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState({
    lead: '',
    companyName: '',
    status: '',
  });

  const getLeads = async () => {
    setLoading(true);
    await axios
      .get(`/agency/leads`, { params: { ...params, ...search } })
      .then((res) => {
        dispatch(setAllLeadsPaginationParams(params));
        setLeads(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    ReactTooltip.rebuild();
    async function getData() {
      await getLeads(true);
    }

    // if (!loading) {
    //   getData();
    // }
  }, [params]);

  useEffect(() => {
    updateParams({
      ...params,
      lead: '',
      companyName: '',
      status: '',
      statuses: '',
    });
    if (user.role.name === 'lead generation captain') {
      const podId = user.memberId.podId;
      console.log(podId);
    }
  }, []);

  const tableColumns = [
    {
      dataField: 'lead',
      text: 'Lead',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },

    {
      dataField: 'companyName',
      text: 'Company Name',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'processedByUser',
      text: 'Processed By',
      sort: true,
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
            {cell ? dateFormatterUTC(cell) : ''}
          </span>
        );
      },
      tabs: ['Pending Approval', 'Pitched'],
    },
    {
      dataField: 'action',
      text: 'Action',
      className: 'text-center',
      formatter: (cell, row) => {
        return userCan('leads.view') ? (
          <>
            <button
              onClick={() => history.push(`/leads/profile/${row.leadId}`)}
              data-tip="Profile"
            >
              <ReactTooltip
                place="top"
                className="max-w-xs text-black"
                backgroundColor="rgba(229, 231, 235, var(--tw-bg-opacity))"
                textColor="rgba(17, 24, 39, var(--tw-text-opacity))"
              />
              <UserCircleIcon className="m-1 h-5 w-5" color="green" />
            </button>
          </>
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
      sort: `${sortField}:${sortOrder}`,
    });
  };

  const updateParamsSearch = ({ lead, companyName, status, params }, type) => {
    if (type === 'lead') {
      updateParams({ page: 1, lead }, true);
    } else if (type === 'companyName') {
      updateParams({ page: 1, companyName }, true);
    } else if (type === 'status') {
      updateParams({ page: 1, status }, true);
    }
  };

  const debouncedUpdateSearch = useCallback(
    debounce((value, type) => updateParamsSearch(value, type), 500),
    []
  );

  const onSearchLead = (e) => {
    setSearch({ ...search, lead: e.target.value });
    debouncedUpdateSearch({ lead: e.target.value, params }, 'lead');
  };

  const onSearchCompanyName = (e) => {
    setSearch({ ...search, companyName: e.target.value });
    debouncedUpdateSearch(
      { companyName: e.target.value, params },
      'companyName'
    );
  };

  const onChangeStatus = (e) => {
    setSearch({ ...search, status: e.target.value });
    updateParamsSearch({ status: e.target.value, params }, 'status');
  };

  const statusOptions = [
    'Pending Approval',
    'Approved',
    'Revision',
    'Rejected',
    'Pitched-LL',
    'Direct-Booking',
    'Positive-Response',
    'Neutral-Response',
    'Call-Booked',
    'RepliedTo',
  ];

  return (
    <>
      <PageHeader title="Leads Records" containerClasses={''} />

      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center pt-5">
        <div className="sm:col-span-1">
          <Label htmlFor="search_status">Status</Label>
          <Select
            name="status"
            className={`appearance-none px-3 py-2 border shadow-sm placeholder-gray-400 focus:ring-red-500 focus:border-red-500 `}
            onChange={onChangeStatus}
            value={params.status}
          >
            <option key="-1" value=""></option>
            {statusOptions.map((option, index) => {
              return (
                <option key={index} value={option}>
                  {option}
                </option>
              );
            })}
          </Select>
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="search_lead">Lead Name</Label>
          <Input
            name="search"
            value={search.lead}
            onChange={onSearchLead}
            type="text"
            placeholder={'Search Lead Name'}
          />
        </div>
        <div className="sm:col-span-1">
          <Label htmlFor="search_company">Company Name</Label>
          <Input
            name="search"
            value={search.companyName}
            onChange={onSearchCompanyName}
            type="text"
            placeholder={'Search Company Name'}
          />
        </div>
      </div>
      <Table
        columns={tableColumns}
        data={leads}
        onTableChange={onTableChange}
        params={params}
        keyField="leadId"
        defaultSorted={[
          {
            dataField: sortParam ? sortParam[0] : 'updatedAt',
            order: sortParam ? sortParam[1] : 'asc',
          },
        ]}
        loading={loading}
      />
    </>
  );
};

export default LeadsData;
