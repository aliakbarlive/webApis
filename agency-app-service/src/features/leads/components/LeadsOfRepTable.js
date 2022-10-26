import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useQueryParams from 'hooks/useQueryParams';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { cloneDeep } from 'lodash';
import axios from 'axios';
import { setLeadsPaginationParams } from '../leadsSlice';
import ReactTooltip from 'react-tooltip';
import { UserCircleIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import Input from 'components/Forms/Input';
import Select from 'components/Forms/Select';
import Label from 'components/Forms/Label';
import { Table } from 'components';

const LeadsOfRepTable = ({ selectedDates, leadsRep }) => {
  const dispatch = useDispatch();
  const [leads, setLeads] = useState({});
  const { leadsPaginationParams } = useSelector((state) => state.leads);
  const { params, updateParams, sortParam } = useQueryParams({
    ...leadsPaginationParams,
  });
  const [loading, setLoading] = useState(false);

  const getLeads = async () => {
    setLoading(true);
    await axios
      .get(`/agency/leads`, {
        params: {
          ...params,
          leadsRep: leadsRep,
          statuses: '',
          startDateStr: selectedDates.startDate,
          endDateStr: selectedDates.endDate,
        },
      })
      .then((res) => {
        dispatch(setLeadsPaginationParams(params));
        setLeads(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getLeads();
    }
    getData();
  }, [params, selectedDates]);

  const tableColumns = [
    {
      dataField: 'companyName',
      text: 'Company Name',
      sort: true,
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
    },
    {
      dataField: 'leadLastName',
      text: 'Lead Last Name',
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
      dataField: 'action',
      text: 'Action',
      headerStyle: { textAlign: `right` },
      sort: true,
      formatter: (cell, row) => {
        return (
          <Link
            to={`/leads/profile/${row.leadId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button data-tip="Profile">
              <UserCircleIcon className="m-1 h-5 w-5" color="green" />
            </button>
          </Link>
        );
      },
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    updateParams({
      page,
      pageSize: sizePerPage,
      sort: `${sortField ?? 'pitchDate'}:${sortOrder}`,
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
      <div className="sm:grid sm:grid-cols-4 gap-4 mb-4 items-center pt-5 px-4">
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
            className={`appearance-none px-3 py-2 border shadow-sm placeholder-gray-400 focus:ring-red-500 focus:border-red-500`}
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
      </div>
      <Table
        columns={tableColumns}
        data={leads}
        onTableChange={onTableChange}
        params={params}
        keyField="companyName"
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

export default LeadsOfRepTable;
