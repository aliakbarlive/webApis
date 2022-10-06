import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Table from 'components/Table';
import PageHeader from 'components/PageHeader';
import { dateFormatter } from 'utils/formatters';
import { PlusIcon } from '@heroicons/react/outline';
import { startCase } from 'lodash';
import axios from 'axios';
import { setAlert } from '../alerts/alertsSlice';
import { useParams } from 'react-router';
import moment from 'moment';
import Select from 'react-select';

import { getCreditNoteRequests } from './creditNotesSlice';
import CreditNoteSlider from './CreditNoteSlider';
import ConfirmationModal from 'components/ConfirmationModal';
import Label from 'components/Forms/Label';

import { userCan } from 'utils/permission';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import {
  getClientAsync,
  selectClientList,
} from 'features/clients/clientsSlice';

const Pages = ({ tabs }) => {
  const { t } = useTranslation();
  const { status } = useParams();
  const dispatch = useDispatch();
  const { creditNotes } = useSelector((state) => state.creditNotes);

  const { rows: clients } = useSelector(selectClientList);
  //const { user } = useSelector((state) => state.auth);
  const user = useSelector(selectAuthenticatedUser);

  const { userId: approvedBy, role, memberId } = user;
  let cellId = null;
  if (memberId) {
    const { cellId: cId } = memberId;
    cellId = cId;
  }

  const { level } = role;
  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedTitle, setSelectedTitle] = useState('');
  const sortField = 'name';
  const sortOrder = 'asc';
  const defaultSorted = [{ dataField: sortField, order: sortOrder }];
  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    sortField,
    sortOrder,
  });

  let showAddBtn = false;
  if (
    level === 'agency' &&
    userCan(user, 'creditNotes.request') &&
    cellId === null
  ) {
    showAddBtn = true;
  }

  let showActions = false;
  if (userCan(user, 'creditNotes.approve') && role.level === 'agency') {
    showActions = true;
  }

  useEffect(() => {
    dispatch(getClientAsync());
  }, [dispatch]);

  let options = [];

  if (clients) {
    clients.map((c) => {
      options.push({
        value: c.zohoId,
        label: c.client,
      });
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(
      getCreditNoteRequests({ ...params, status, customers: selectedOption })
    ).then(() => {
      setLoading(false);
    });
  }, [dispatch, params, refresh, status, selectedOption]);

  const onClickAdd = () => {
    setSelectedRow({});
    setOpen(true);
  };

  const onView = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const onConfirm = (row, status, title) => {
    setSelectedRow(row);
    setSelectedStatus(status);
    setSelectedTitle(title);
    setModal(true);
  };

  const onSelectOption = (e) => {
    const ids = e.map((c) => {
      return c.value;
    });
    setSelectedOption(ids);
  };

  const AddCreditNoteRequest = () => {
    return (
      showAddBtn && (
        <button
          className="flex items-center uppercase px-2 rounded-sm py-1 border border-gray-300 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-red-300"
          onClick={() => onClickAdd()}
        >
          <PlusIcon className="h-4 w-4" /> Add
        </button>
      )
    );
  };

  const onCreateCreditNote = (creditNoteId, status, body, row, invoices) => {
    const {
      customerId: customer_id,
      description,
      price,
      dateApplied: date,
      notes,
      terms,
    } = row;
    axios
      .patch(`/agency/credit-notes/${creditNoteId}/update`, body)
      .then((res) => {
        dispatch(
          setAlert('success', `The request has been ${startCase(status)}`)
        );
        if (status === 'approved') {
          const { invoice_id, number } = invoices[0];
          // trigger the zoho endpoint for creating the credit note
          // and attach to the latest pending invoice of the customer
          console.log('Create Credit Note on Zoho Subscription');
          axios
            .post('/agency/credit-notes', {
              customer_id,
              date: moment(date).format('YYYY-MM-DD'),
              creditnote_items: [
                {
                  description,
                  quantity: 1,
                  price,
                  tax_id: process.env.REACT_APP_NO_TAX_ID,
                },
              ],
              reference_number: number,
              ignore_auto_number_generation: false,
              notes,
              terms,
            })
            .then((note) => {
              const { code, message, creditnote } = note.data.data;
              if (code === 0) {
                dispatch(setAlert('success', message));
                const { creditnote_id, creditnote_number } = creditnote;

                // update the credit note request
                console.log('Get and save the zoho credit note id');
                axios
                  .patch(`/agency/credit-notes/${creditNoteId}/update`, {
                    zohoCreditNoteId: creditnote_id,
                    zohoCreditNoteNumber: creditnote_number,
                    status,
                  })
                  .then((update) => {
                    dispatch(
                      setAlert('success', `The credit note request was updated`)
                    );
                  });

                // Attach the credit note to the pending invoice
                console.log(
                  'Attach the created credit note to the latest pending invoice'
                );
                axios
                  .post(`/agency/credit-notes/${creditnote_id}/invoices`, {
                    invoices: [
                      {
                        invoice_id,
                        amount_applied: price,
                      },
                    ],
                  })
                  .then((apply) => {
                    setRefresh(!refresh);
                    dispatch(
                      setAlert(
                        'success',
                        `The credit note was attached to invoice: ${number}`
                      )
                    );
                  });
              } else {
                dispatch(setAlert('error', message));
              }
            });
        } else {
          setRefresh(!refresh);
        }
      });
  };

  const onUpdateCreditNoteRequest = (row, status, title) => {
    setModal(false);
    const { creditNoteId, customerId, group, requestorId } = row;

    const { name: roleName } = role;

    let allowed = false;
    let message = '';

    if (roleName === 'super user') {
      allowed = true;
    } else {
      const { departmentId: d1, squadId: s1, podId: p1, cellId: c1 } = memberId;
      const { departmentId: d2, squadId: s2, podId: p2, cellId: c2 } = group;
      message = `Only super admin can ${title} the credit note request!`;
      if (approvedBy !== requestorId) {
        // check if they have same department and squad
        if (d1 === d2 && s1 === s2) {
          // check if the user is assign to a pod, if not it means OM or PM
          if (!p1) {
            allowed = true;
            message = '';
          } else {
            message = `Ask your superior to ${title} the request!`;
          }
        } else {
          message = `You are not on the same group to ${title} the request!`;
        }
      } else {
        message = `You are not allowed to ${title} your own request!`;
      }
    }
    let body = { status };
    if (allowed) {
      body = { ...body, approvedBy };
      if (status === 'approved') {
        // Check if the client has an Pending invoices
        axios
          .get(
            `/agency/invoice?status=Pending&page=1&sizePerPage=10&zohoId=${customerId}`
          )
          .then((res2) => {
            const { rows: invoices } = res2.data.data;
            console.log(invoices);
            if (invoices.length > 0) {
              onCreateCreditNote(creditNoteId, status, body, row, invoices);
            } else {
              const body = { status: 'queued', approvedBy };
              onCreateCreditNote(creditNoteId, 'queued', body, row, []);
              dispatch(
                setAlert(
                  'error',
                  `The client has no pending invoice to attach the credit note, it will be queued until the client has a pending invoice`
                )
              );
            }
          });
      } else {
        // Update all other status
        onCreateCreditNote(creditNoteId, status, body, row, []);
      }
    } else {
      dispatch(setAlert('error', message));
    }
  };

  let tableColumns = [
    {
      dataField: 'name',
      text: t('Name'),
      sort: true,
      formatter: (cell, row) => (
        <a
          onClick={() => onView(row)}
          className="font-normal text-blue-500 cursor-pointer"
        >
          {cell}
        </a>
      ),
    },
    { dataField: 'price', text: t('Price'), sort: true },
    {
      dataField: 'status',
      text: t('Status'),
      sort: true,
      formatter: (cell, row) => (
        <span className="font-normal">{startCase(cell)}</span>
      ),
    },
    {
      dataField: 'dateApplied',
      text: t('DateApplied'),
      sort: true,
      formatter: (cell, row) => (
        <span className="font-normal">{dateFormatter(cell)}</span>
      ),
    },
    { dataField: 'AgencyClient.client', text: 'Agency Client' },
    {
      dataField: 'requestorId',
      text: t('RequestedBy'),
      formatter: (cell, row) => (
        <span className="font-normal">{`${row.requestor.firstName} ${row.requestor.lastName}`}</span>
      ),
    },
  ];

  if (status !== 'pending') {
    let statusHeader = typeof status !== 'undefined' ? status : 'processed';
    statusHeader = statusHeader === 'queued' ? 'approved' : statusHeader;
    tableColumns = [
      ...tableColumns,
      {
        dataField: 'approvedBy',
        text: `${statusHeader} by`,
        formatter: (cell, row) =>
          row.approved ? (
            <span className="font-normal">{`${row.approved.firstName} ${row.approved.lastName}`}</span>
          ) : (
            <span className="font-normal">None</span>
          ),
      },
    ];
  }

  if (showActions) {
    tableColumns = [
      ...tableColumns,
      {
        dataField: 'action',
        text: 'Action',
        className: 'text-center',
        formatter: (cell, row) => {
          return (
            <>
              {row.status === 'pending' && (
                <>
                  <button
                    className="border px-2 py-1 rounded mr-1 bg-blue-400 text-white"
                    title="Approve"
                    onClick={() => onConfirm(row, 'approved', 'approve')}
                  >
                    Approve
                  </button>
                  <button
                    className="border px-2 py-1 rounded mr-1 bg-red-400 text-gray-600"
                    title="Deny"
                    onClick={() => onConfirm(row, 'denied', 'deny')}
                  >
                    Deny
                  </button>
                  <button
                    className="border px-2 py-1 rounded mr-1 bg-yellow-400 text-gray-600"
                    title="Cancel"
                    onClick={() => onConfirm(row, 'cancelled', 'cancel')}
                  >
                    Cancel
                  </button>
                  <button
                    className="border px-2 py-1 rounded mr-1 bg-blue-300 text-white"
                    title="Manually Approve"
                    onClick={() =>
                      onConfirm(row, 'manually-approved', 'manually approve')
                    }
                  >
                    Manually Approve
                  </button>
                </>
              )}
            </>
          );
        },
      },
    ];
  }

  const onTableChange = (type, { page, sizePerPage, sortField, sortOrder }) => {
    let newParams = { ...params, page, pageSize: sizePerPage };

    Object.keys(newParams)
      .filter((key) => key.includes('sort'))
      .forEach((key) => {
        delete newParams[key];
      });

    if (sortField) {
      newParams['sortField'] = sortField;
      newParams['sortOrder'] = sortOrder;
    }

    setParams(newParams);
  };

  return (
    <>
      <PageHeader
        title={t('CreditNotes')}
        left={AddCreditNoteRequest()}
        tabs={tabs}
      />
      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-8 gap-4 mb-4 items-center">
        <div className="col-span-3 sm:col-span-2">
          <Label htmlFor="search_client">Clients</Label>
          <Select
            defaultValue={selectedOption}
            onChange={onSelectOption}
            options={options}
            isMulti={true}
          />
        </div>
      </div>
      <ConfirmationModal
        title={`Continue to ${selectedTitle} the credit note request?`}
        open={modal}
        setOpen={setModal}
        onOkClick={() =>
          onUpdateCreditNoteRequest(selectedRow, selectedStatus, selectedTitle)
        }
        onCancelClick={() => setModal(false)}
        size="sm"
      />
      <Table
        columns={tableColumns}
        data={creditNotes}
        onTableChange={onTableChange}
        params={params}
        keyField="creditNoteId"
        defaultSorted={defaultSorted}
        loading={loading}
      />
      <CreditNoteSlider
        open={open}
        setOpen={setOpen}
        refresh={refresh}
        setRefresh={setRefresh}
        row={selectedRow}
      />
    </>
  );
};

export default Pages;
