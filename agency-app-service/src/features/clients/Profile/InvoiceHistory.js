import React, { useState } from 'react';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { columnClasses, headerClasses } from 'utils/table';
import InvoicesTable from 'features/invoices/InvoicesTable';
import Badge from 'components/Badge';

const InvoiceHistory = ({ client }) => {
  const history = useHistory();
  const { zohoId } = client;
  const { subscriptionId } = client.account.subscription;
  const { paginationParams } = useSelector((state) => state.invoices);
  const [params, setParams] = useState({
    page: 1,
    sizePerPage: paginationParams.sizePerPage,
    subscriptionId,
    zohoId,
    status: 'All',
  });

  const tableColumns = [
    {
      dataField: 'number',
      text: 'Invoice #',
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <Link to={`/invoices/${row.invoice_id}`} className="text-red-600">
            {cell}
          </Link>
        );
      },
    },
    {
      dataField: 'invoice_date',
      text: 'Date',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell)}</span>;
      },
    },
    {
      dataField: 'total',
      text: 'Amount',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
    {
      dataField: 'status',
      text: 'Status',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <Badge
            color={classnames({
              green: cell === 'paid',
              yellow: cell === 'pending',
              red: cell === 'overdue',
              blue: cell === 'sent',
              gray: cell === 'void',
            })}
            classes="uppercase"
            rounded="md"
          >
            {cell}
          </Badge>
        );
      },
    },
  ];

  return (
    <InvoicesTable
      history={history}
      tableColumns={tableColumns}
      params={params}
      setParams={setParams}
    />
  );
};
export default InvoiceHistory;
