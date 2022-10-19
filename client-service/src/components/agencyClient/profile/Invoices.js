import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import classnames from 'classnames';
import moment from 'moment';
import InvoicesTable from 'components/invoices/InvoicesTable';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Invoices = ({ subscriptionId }) => {
  const { paginationParams } = useSelector((state) => state.invoices);  
  const [params, setParams] = useState({
    page:1,
    per_page: paginationParams.per_page,
    subscriptionId,
    status: 'All',
  });

  const tableColumns = [
    {
      dataField: 'invoice_id',
      text: 'Invoice #',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return <Link to={`/invoices/${row.invoice_id}`}>{cell}</Link>;
      },
    },
    {
      dataField: 'invoice_date',
      text: 'Date',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell)}</span>;
      },
    },
    {
      dataField: 'total',
      text: 'Amount',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerStyle: {
        width: '150px',
      },
      formatter: (cell, row) => {
        return (
          <span
            className={classnames('text-uppercase', {
              'text-success': cell === 'paid',
              'text-secondary': cell === 'pending',
            })}
          >
            {cell}
          </span>
        );
      },
    },
  ];
  
  return (
    <div>
      <Card>
        <CardBody className={'text-dark p-auto p-lg-5'}>
          <InvoicesTable
            tableColumns={tableColumns}
            params={params}            
          />
        </CardBody>
      </Card>
    </div>
  );
};
export default Invoices;
