import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactTooltip from 'react-tooltip';
import { Link, useHistory } from 'react-router-dom';
import {
  currencyFormatter,
  dateFormatter,
  strUnderscoreToSpace,
} from 'utils/formatters';
import classnames from 'classnames';
import InvoicesTable from './InvoicesTable';
import { columnClasses, headerClasses } from 'utils/table';
import EditAction from 'components/Table/EditAction';
import Badge from 'components/Badge';
import TabNav from 'components/TabNav';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from './invoicesSlice';
import usePermissions from 'hooks/usePermissions';
import useQuery from 'hooks/useQuery';

const Overview = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userCan } = usePermissions();
  let query = useQuery();
  const [params, setParams] = useState({
    page: query.get('page'),
    sizePerPage: query.get('sizePerPage'),
    subscriptionId: null,
    status: query.get('status'),
  });
  const [tabs, setTabs] = useState([
    { name: 'All', href: '#', count: '', current: false },
    { name: 'Pending', href: '#', count: '', current: true },
    { name: 'Sent', href: '#', count: '', current: false },
    { name: 'OverDue', href: '#', count: '', current: false },
    { name: 'Paid', href: '#', count: '', current: false },
    { name: 'PartiallyPaid', href: '#', count: '', current: false },
    { name: 'Void', href: '#', count: '', current: false },
    { name: 'Unpaid', href: '#', count: '', current: false },
    { name: 'Draft', href: '#', count: '', current: false },
  ]);

  useEffect(() => {
    dispatch(setCurrentPage(`Invoices`));
    let myTabs = [...tabs];
    let currentTab = myTabs.find((t) => t.current === true);
    currentTab.current = false;
    let selectedTab = myTabs.find((t) => t.name == params.status);
    selectedTab.current = true;
    setTabs(myTabs);
  }, [params.status]);

  const updateStatus = (status) => {
    let newParams = {
      ...params,
      status,
      page: 1,
      sizePerPage: query.get('sizePerPage'),
    };
    setParams(newParams);
    query.set('status', status);
    query.set('page', 1);
    query.set('sizePerPage', newParams.sizePerPage);
    history.push(window.location.pathname + '?' + query.toString());
  };

  const forwardToClient = async (invoiceId, customerId) => {
    await axios
      .get(`/agency/invoice/${invoiceId}/customer/${customerId}`)
      .then((res) => {
        const { output } = res.data;
        if (output) {
          const { agencyClientId } = output;
          history.push(`/clients/profile/${agencyClientId}/subscription`);
        } else {
          // get zoho id
        }
      });
  };

  const tableColumns = [
    {
      dataField: 'invoice_date',
      text: 'Date',
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
      dataField: 'number',
      text: 'Invoice #',
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => {
        return userCan('invoices.details.view') ? (
          <Link to={`/invoices/${row.invoice_id}`} className="text-red-600">
            {cell}
          </Link>
        ) : (
          cell
        );
      },
    },
    {
      dataField: 'customer_name',
      text: 'Customer Name',
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '250px',
      },
      formatter: (cell, row) => {
        return userCan('clients.profile.view') ? (
          <button
            onClick={() => forwardToClient(row.invoice_id, row.customer_id)}
            className="text-red-600"
          >
            {cell}
          </button>
        ) : (
          cell
        );
      },
    },
    {
      dataField: 'email',
      text: 'Email',
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '250px',
      },
    },
    {
      dataField: 'status',
      text: 'Status',
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '175px',
      },
      formatter: (cell, row) => {
        return (
          <div className="flex flex-wrap">
            <Badge
              color={classnames({
                green: cell === 'paid' || cell === 'partially_paid',
                yellow: cell === 'pending',
                red: cell === 'overdue',
                blue: cell === 'sent',
                gray: cell === 'void',
              })}
              classes="uppercase mr-2 my-1"
              rounded="md"
            >
              {strUnderscoreToSpace(row.status)}
            </Badge>
            {(cell === 'pending' || cell === 'overdue') &&
              row.cf_payment_failure && (
                <>
                  <Badge color="pink" classes="uppercase my-1" rounded="md">
                    <span data-tip data-for="paymentFailed">
                      Payment Failed
                    </span>
                  </Badge>
                  <ReactTooltip
                    id="paymentFailed"
                    type="error"
                    place="bottom"
                    className="w-56"
                  >
                    <span>{row.cf_payment_failure}</span>
                  </ReactTooltip>
                </>
              )}
            {(cell === 'pending' || cell === 'overdue') &&
              row.cf_pause_collect &&
              (row.cf_pause_collect === 'true' ? (
                <Badge color="indigo" classes="uppercase my-1" rounded="md">
                  Collect Paused
                </Badge>
              ) : (
                ''
              ))}
          </div>
        );
      },
    },
    {
      dataField: 'due_date',
      text: 'Due Date',
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
      headerClasses,
      classes: columnClasses,
      headerStyle: {
        minWidth: '150px',
      },
      formatter: (cell, row) => currencyFormatter(cell),
    },
  ];

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
      <InvoicesTable
        history={history}
        tableColumns={tableColumns}
        params={params}
        setParams={setParams}
      />
    </>
  );
};
export default Overview;
