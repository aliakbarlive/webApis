import React from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Badge from 'components/Badge';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import { columnClasses, headerClasses } from 'utils/table';
import { currencyFormatter, dateFormatter } from 'utils/formatter';
import InvoicesTable from './InvoicesTable';

const InvoiceHistory = ({ history }) => {
  const { accountId } = useSelector(selectCurrentAccount);
  const params = {
    page: 1,
    sizePerPage: 10,
  };

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
          <Link
            to={`/plan/invoices/${row.invoice_id}`}
            className="text-red-600"
          >
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
      accountId={accountId}
    />
  );
};
export default InvoiceHistory;
