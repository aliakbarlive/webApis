import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import moment from 'moment';

import Input from 'components/Forms/Input';
import Label from 'components/Forms/Label';
import Textarea from 'components/Forms/Textarea';
import Button from 'components/Button';
import Select from 'components/Forms/Select';
import Select2 from 'react-select';

import { isEmpty } from 'lodash';

import { getClientsByPodId } from './creditNotesSlice';
import { getAccountsAsync } from 'features/accounts/accountsSlice';

import { selectClientList } from 'features/clients/clientsSlice';

import { fetchEmployees } from 'features/employees/employeesSlice';
import { setAlert } from 'features/alerts/alertsSlice';

import usePermissions from 'hooks/usePermissions';

const CreditNoteSlider = ({ open, setOpen, refresh, setRefresh, row }) => {
  const dispatch = useDispatch();

  const { isAgencySuperUser, isSalesAdmin, hasAccessToAllClients } =
    usePermissions();

  const { user } = useSelector((state) => state.auth);
  const { userId: requestorId, memberId, role } = user;
  const { name, level } = role;
  let podId = null;
  if (memberId !== null) {
    const { podId: pId } = memberId;
    podId = pId;
  }

  const { employees } = useSelector((state) => state.employees);
  const { rows: superUsers } = employees;
  const { clients: filterClients } = useSelector((state) => state.creditNotes);
  const { rows: allClients } = useSelector(selectClientList);
  const [selectedOption, setSelectedOption] = useState(null);

  let clients = filterClients;
  if (isAgencySuperUser() || isSalesAdmin() || hasAccessToAllClients()) {
    clients = allClients; // show all clients if super user
  }

  let options = [];
  const agencyClients =
    clients &&
    clients.map((c) => {
      options.push({
        value: c.zohoId,
        label: c.client,
      });
      return { id: c.zohoId, name: c.client };
    });

  let emailsToNotify = [];
  if (superUsers) {
    superUsers.map((su) => {
      if (!emailsToNotify.includes(su.email)) {
        emailsToNotify.push(su.email);
      }
    });
  }

  useEffect(() => {
    dispatch(
      fetchEmployees({
        pageSize: 30,
        roleId: 4, // agency super user
      })
    );
    if (podId) {
      dispatch(getClientsByPodId({ podId, isPpc: false }));
    }
    dispatch(getAccountsAsync());
  }, [dispatch]);

  const notifyHigherUps = (squadId, user, clientName) => {
    axios
      .get('/agency/employees/groups', {
        isPpc: false,
        squadId,
      })
      .then((res) => {
        const groups = res.data.data;
        groups.map((g) => {
          const { Squads } = g;
          Squads.map((sg) => {
            const { UserGroups } = sg;
            UserGroups.map((ug) => {
              const { email } = ug.User;
              if (!emailsToNotify.includes(email)) {
                emailsToNotify.push(email);
              }
            });
          });
        });

        axios
          .post('/agency/credit-notes/notify-higher-ups', {
            emails: emailsToNotify,
            clientName,
            requestor: {
              firstName: user.firstName,
              lastName: user.lastName,
            },
          })
          .then(() => {
            dispatch(setAlert('success', `Notified the higher ups`));
          });
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();

  const onCancel = (e) => {
    if (e) e.preventDefault();
    clearErrors();
    setOpen(false);
  };

  const onSubmit = (data) => {
    const cellId = 0;
    const { customerId, price } = data;
    const body = { ...data, requestorId, cellId };

    axios
      .get(
        `/agency/invoice?status=Pending&page=1&sizePerPage=10&zohoId=${customerId}`
      )
      .then((res2) => {
        const { rows: invoices } = res2.data.data;
        if (invoices.length > 0) {
          const { invoice_id, number, balance } = invoices[0];
          if (parseFloat(price) <= balance) {
            axios.post(`/agency/credit-notes/request`, body).then((res) => {
              if (memberId !== null) {
                const client = agencyClients.find((e) => e.id === customerId);
                const { squadId } = memberId;
                notifyHigherUps(squadId, user, client.name);
              }
              setRefresh(!refresh);
              setOpen(false);
            });
          } else {
            dispatch(
              setAlert(
                'error',
                `Price ( $${price} )  is more than the balance ( $${balance} ) of the client's pending invoice`
              )
            );
          }
        } else {
          dispatch(
            setAlert(
              'error',
              `The client has no pending invoice to attach the credit note`
            )
          );
        }
      });
  };

  const onSelectOption = (e) => {
    const { value } = e;
    setValue('customerId', value, { shouldValidate: true });
    setSelectedOption(value);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-10"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
        </div>

        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="w-screen max-w-lg">
              <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                <div className="px-4 sm:px-6">
                  {/* Start Title */}
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {row.customerId ? 'View' : 'Create'} Credit Note Request
                    </Dialog.Title>

                    <div className="ml-3 h-7 flex items-center">
                      <button
                        className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => onCancel()}
                      >
                        <span className="sr-only">Close panel</span>
                        <XIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  {/* End Title */}
                  <div className="px-4 py-4 sm:px-6">
                    <hr />
                  </div>

                  {!isEmpty(row) ? (
                    <>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Agency Client:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.AgencyClient.client}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Credit Note Name:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.name}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Description:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.description}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Price:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.price}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Date Applied:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {moment(row.AgencyClient.dateApplied).format(
                                'DD/MM/YYYY'
                              )}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Notes:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.notes}
                            </dd>
                          </div>
                          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">
                              Terms:
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                              {row.terms}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="px-6 py-6 sm:px-8">
                        <div className="flex flex-col">
                          <Label>Agency Client</Label>
                          <span className="col-span-2 text-gray-900 mb-2 mx-2">
                            <Select2
                              placeholder="Select an agency client"
                              defaultValue={selectedOption}
                              onChange={onSelectOption}
                              options={options}
                            />
                            <Select
                              className="hidden"
                              name="customerId"
                              {...register('customerId', { required: true })}
                            >
                              <option value="">Select an agency client</option>
                              {agencyClients &&
                                agencyClients.map((ac) => {
                                  return (
                                    <option value={ac.id}>{ac.name}</option>
                                  );
                                })}
                            </Select>
                            {errors.customerId && (
                              <b className="text-red-800 text-xs">
                                Agency Client is required
                              </b>
                            )}
                          </span>
                          <Label>Credit Note Name</Label>
                          <span className="col-span-2 text-gray-900 mb-2 mx-2">
                            <Input
                              type="text"
                              placeholder="Name"
                              disabled={row.name ? 'disabled' : null}
                              value={row.name ? row.name : null}
                              {...register('name', { required: true })}
                            />
                            {errors.name && (
                              <b className="text-red-800 text-xs">
                                Credit Note is required
                              </b>
                            )}
                          </span>
                          <Label>Description</Label>
                          <span className="col-span-2 text-gray-900 mx-2">
                            <Textarea
                              placeholder="Description"
                              label="description"
                              disabled={row.customerId ? 'disabled' : null}
                              value={row.description ? row.description : null}
                              {...register('description', { required: true })}
                            />
                            {errors.description && (
                              <b className="text-red-800 text-xs">
                                Description is required
                              </b>
                            )}
                          </span>
                          <Label>Price</Label>
                          <span className="col-span-2 text-gray-900 mb-2 mx-2">
                            <Input
                              placeholder="0"
                              label="price"
                              type="number"
                              step="any"
                              classes="text-right"
                              disabled={row.customerId ? 'disabled' : null}
                              value={row.price ? row.price : null}
                              {...register('price', { required: true, min: 1 })}
                            />
                            {errors.price?.type === 'required' && (
                              <b className="text-red-800 text-xs">
                                Price is required
                              </b>
                            )}
                            {errors.price?.type === 'min' && (
                              <b className="text-red-800 text-xs">
                                Your input is required to be more than 0
                              </b>
                            )}
                          </span>
                          <Label>Date Applied</Label>
                          <span className="col-span-2 text-gray-900 mb-2 mx-2">
                            <Input
                              label="dateApplied"
                              type="date"
                              classes="text-right"
                              disabled={row.customerId ? 'disabled' : null}
                              value={
                                row.dateApplied
                                  ? moment(row.dateApplied).format('YYYY-MM-DD')
                                  : null
                              }
                              {...register('dateApplied', { required: true })}
                            />
                            {errors.dateApplied && (
                              <b className="text-red-800 text-xs">
                                Date Applied is required
                              </b>
                            )}
                          </span>
                          <Label>Notes</Label>
                          <span className="col-span-2 text-gray-900 mx-2">
                            <Textarea
                              placeholder="Notes"
                              label="notes"
                              disabled={row.customerId ? 'disabled' : null}
                              value={row.notes ? row.notes : null}
                              {...register('notes', { required: true })}
                            />
                            {errors.notes && (
                              <b className="text-red-800 text-xs">
                                Notes is required
                              </b>
                            )}
                          </span>
                          <Label>Terms</Label>
                          <span className="col-span-2 text-gray-900 mx-2">
                            <Textarea
                              placeholder="Terms"
                              label="terms"
                              disabled={row.customerId ? 'disabled' : null}
                              value={row.terms ? row.terms : null}
                              {...register('terms', { required: true })}
                            />
                            {errors.terms && (
                              <b className="text-red-800 text-xs">
                                Terms is required
                              </b>
                            )}
                          </span>
                        </div>
                        <div className={`flex items-start  justify-end mt-10`}>
                          <div>
                            <Button
                              bgColor="gray-50"
                              hoverColor="gray-300"
                              textColor="gray-700"
                              onClick={onCancel}
                            >
                              Cancel
                            </Button>
                            <input
                              className={`${
                                row.name ? 'hidden' : 'block'
                              } cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 hover:bg-red-700 bg-red-600 ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
                              type="submit"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreditNoteSlider;
