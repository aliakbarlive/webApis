import Badge from 'components/Badge';
import Select from 'components/Forms/Select';
import React, { useEffect, useState } from 'react';
import { currencyFormatter, dateFormatter } from 'utils/formatters';
import { columnClasses, headerClasses } from 'utils/table';
import PaymentsTable from './PaymentsTable';
import classnames from 'classnames';
import PaymentDetailsSlideOver from './PaymentDetailsSlideOver';
import { useHistory } from 'react-router-dom';
import { setCurrentPage } from '../invoicesSlice';
import { useDispatch } from 'react-redux';
import useQuery from 'hooks/useQuery';

const Payments = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  let query = useQuery();
  const [params, setParams] = useState({
    page: query.get('page') ?? 1,
    sizePerPage: query.get('sizePerPage') ?? 25,
    status: query.get('status') ?? 'PaymentStatus.All',
  });
  const [payment, setPayment] = useState(null);
  const [isOpenDetails, setIsOpenDetails] = useState(false);

  useEffect(() => {
    dispatch(setCurrentPage('Payments'));
  }, []);

  const statuses = [
    { label: 'All Success', value: 'PaymentStatus.All' },
    { label: 'Online - Success', value: 'PaymentStatus.OnlineSuccess' },
    { label: 'Online - Failure', value: 'PaymentStatus.OnlineFailure' },
    { label: 'Offline', value: 'PaymentType.Offline' },
  ];

  const tableColumns = [
    {
      dataField: 'transaction_time',
      text: 'Date',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return <span>{dateFormatter(cell, 'DD MMM YYYY HH:MM a')}</span>;
      },
    },
    {
      dataField: 'payment_number',
      text: 'Payment Number',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return (
          <button
            className="capitalize text-red-600 font-normal"
            onClick={() => onClickDetails(row)}
          >
            {cell === '' ? 'view' : cell}
          </button>
        );
      },
    },
    {
      dataField: 'invoice_number',
      text: 'Invoice Number',
      sort: false,
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'customer_name',
      text: 'Customer',
      sort: false,
      headerClasses,
      classes: `${columnClasses}`,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: false,
      headerClasses,
      classes: `${columnClasses}`,
      headerStyle: {
        minWidth: '150px',
      },
    },
    {
      dataField: 'mode',
      text: 'Payment Mode',
      sort: false,
      headerClasses,
      classes: `${columnClasses} uppercase`,
      headerStyle: {
        minWidth: '150px',
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
              green: cell === 'success',
              red: cell === 'failure',
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
      dataField: 'amount',
      text: 'Amount',
      sort: false,
      headerClasses,
      classes: `${columnClasses} capitalize`,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell) => {
        return currencyFormatter(cell);
      },
    },
  ];

  const onClickDetails = (row) => {
    setIsOpenDetails(true);
    setPayment(row);
  };

  const updateStatus = (status) => {
    let newParams = {
      ...params,
      status,
      page: 1,
      sizePerPage: query.get('sizePerPage') ?? 25,
    };
    setParams(newParams);
    query.set('status', status);
    query.set('page', 1);
    query.set('sizePerPage', newParams.sizePerPage);
    history.push(window.location.pathname + '?' + query.toString());
  };

  return (
    <>
      <div className="sm:flex items-center py-2 my-3">
        <label
          htmlFor="status"
          className="w-max text-sm font-medium text-gray-700 pb-1 pr-3"
        >
          Status
        </label>
        <div className="sm:w-max">
          <Select
            id="status"
            label="status"
            value={params.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            {statuses.map((status, i) => (
              <option
                key={i}
                value={status.value}
                disabled={status.disabled ?? ''}
                className={status.disabled ? 'bg-red-50' : ''}
              >
                {status.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <PaymentsTable
        history={history}
        tableColumns={tableColumns}
        params={params}
        setParams={setParams}
      />
      <PaymentDetailsSlideOver
        open={isOpenDetails}
        setOpen={setIsOpenDetails}
        payment={payment}
      />
    </>
  );
};
export default Payments;
