import { Table } from 'components';
import Badge from 'components/Badge';
import React, { useEffect, useState } from 'react';
import { dateFormatter } from 'utils/formatters';
import { columnClasses, headerClasses } from 'utils/table';
import classnames from 'classnames';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../invoicesSlice';
import TabNav from 'components/TabNav';
import _ from 'lodash';
import useQuery from 'hooks/useQuery';

const CommissionErrors = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let query = useQuery();
  const [params, setParams] = useState({
    page: parseInt(query.get('page') ?? 1),
    pageSize: parseInt(query.get('pageSize') ?? 30),
    sort: query.get('sort') ?? 'invoiceDate:desc',
    status: query.get('status') ?? 'pending',
  });
  const defaultSorted = [{ dataField: 'invoiceDate', order: 'desc' }];
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(setCurrentPage('Commission Errors'));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await axios
        .get(`/agency/invoice/errors`, { params: params })
        .then((res) => {
          setInvoices(res.data.data);
          setLoading(false);
        });
    };
    if (!loading) load();
  }, [params]);

  const [tabs, setTabs] = useState([
    { name: 'Pending', href: '#', count: '', current: true },
    { name: 'Resolved', href: '#', count: '', current: false },
  ]);

  const tableColumns = [
    {
      dataField: 'invoiceDate',
      text: 'Invoice Date',
      sort: true,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell)}</span>;
      },
    },
    {
      dataField: 'invoiceNumber',
      text: 'Invoice #',
      sort: true,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <Link className="text-red-500 " to={`/invoices/${row.invoiceId}`}>
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerClasses,
      classes: `${columnClasses} uppercase`,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => {
        return (
          <Badge
            color={classnames({
              yellow: cell === 'pending',
              green: cell === 'resolved',
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
      dataField: 'customer_name',
      text: 'Customer',
      sort: true,
      headerClasses,
      classes: `${columnClasses}`,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <Link
            className="text-red-500 "
            to={`/clients/account/${row.accountId}`}
          >
            {row.account?.AgencyClient.client}
          </Link>
        );
      },
    },
    {
      dataField: 'description',
      text: 'Description',
      sort: true,
      headerClasses,
      classes: `${columnClasses}`,
      headerStyle: {
        minWidth: '250px',
      },
    },
    {
      dataField: 'createdAt',
      text: 'Created',
      sort: true,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '80px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell, 'DD MMM YYYY HH:MM A')}</span>;
      },
    },
  ];

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = {
      ...params,
      page,
      pageSize: sizePerPage,
      sort: `${sortField}:${sortOrder}`,
    };
    updateParams(newParams);
  };

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

  const updateStatus = (status) => {
    let newParams = {
      ...params,
      status: _.lowerCase(status),
      page: 1,
      sizePerPage: query.get('sizePerPage'),
    };
    updateParams(newParams);
  };

  const onSelectChange = (e) => {
    updateStatus(e.target.value);
  };

  const onClick = (selectedTab) => {
    updateStatus(selectedTab.name);
  };

  return (
    <>
      <TabNav
        tabs={tabs}
        setTabs={setTabs}
        onSelectChange={onSelectChange}
        onClick={onClick}
      />
      <Table
        columns={tableColumns}
        data={invoices}
        onTableChange={onTableChange}
        params={params}
        keyField="invoiceErrorId"
        defaultSorted={defaultSorted}
        loading={loading}
      />
    </>
  );
};
export default CommissionErrors;
