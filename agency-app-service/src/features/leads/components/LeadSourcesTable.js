import React, { useState, useEffect } from 'react';
import useQueryParams from 'hooks/useQueryParams';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLeadsPaginationParams } from '../leadsSlice';
import { Table } from 'components';
import { dateFormatterUTC } from 'utils/formatters';

const LeadSourcesTable = ({ selectedDates }) => {
  const dispatch = useDispatch();
  const { leadsPaginationParams } = useSelector((state) => state.leads);
  const { params, updateParams, sortParam } = useQueryParams({
    ...leadsPaginationParams,
  });
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState({});

  const getSource = async () => {
    setLoading(true);
    await axios
      .get(`agency/leads/source`, {
        params: {
          ...params,
          startDateStr: selectedDates.startDate,
          endDateStr: selectedDates.endDate,
        },
      })
      .then((res) => {
        dispatch(setLeadsPaginationParams(params));
        setSource(res.data.data);
      });
    setLoading(false);
  };

  useEffect(() => {
    async function getData() {
      await getSource();
    }
    getData();
  }, [params, selectedDates]);

  const tableColumns = [
    {
      dataField: 'uploadedByUser',
      text: 'Uploaded By',
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
      formatter: (cell, row) => {
        return (
          <span className="font-normal">
            {cell ? `${cell.firstName} ${cell.lastName}` : ''}
          </span>
        );
      },
    },
    {
      dataField: 'filename',
      text: 'File Name',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'totalRows',
      text: 'Total Rows',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'inserted',
      text: 'Inserted Rows',
      sort: true,
      headerStyle: {
        minWidth: '180px',
      },
    },
    {
      dataField: 'createdAt',
      text: 'Uploaded Date',
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
    <Table
      columns={tableColumns}
      data={source}
      onTableChange={onTableChange}
      params={params}
      keyField="uploadUser"
      defaultSorted={[{ dataField: 'createdAt', order: 'desc' }]}
      loading={loading}
    />
  );
};

export default LeadSourcesTable;
