import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';

import Label from 'components/Forms/Label';
import Input from 'components/Forms/Input';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ModalHeader from 'components/ModalHeader';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';

const ChangeDefaultContactModal = ({ open, setOpen, client, setClient }) => {
  const dispatch = useDispatch();
  const { userCan } = usePermissions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();

  const getClient = (id, callback) => {
    axios.get(`/agency/client/${id}`).then((res) => {
      callback(res.data.data);
    });
  };

  const createContact = (
    agencyClientId,
    firstName,
    lastName,
    email,
    callback
  ) => {
    const body = { firstName, lastName, email };
    axios
      .post(`/agency/client/${agencyClientId}/create-default-contact`, body)
      .then((res) => {
        const { success } = res.data;
        if (success) {
          dispatch(
            setAlert('success', 'The contact is successfully assigned')
          ).then(() => {
            callback();
          });
        }
      });
  };

  const assignContact = (agencyClientId, userId, callback) => {
    const body = { userId };
    axios
      .post(`/agency/client/${agencyClientId}/assign-existing-contact`, body)
      .then((res) => {
        const { success } = res.data;
        if (success) {
          dispatch(
            setAlert('success', 'The contact is successfully assigned')
          ).then(() => {
            callback();
          });
        }
      });
  };

  const updateZohoEmail = (zohoId, firstName, lastName, email, callback) => {
    const body = { zohoId, firstName, lastName, email };
    axios
      .post(`/agency/client/update-zoho-default-contact`, body)
      .then((res) => {
        const { success, msg, data } = res.data;
        if (success) {
          dispatch(setAlert('success', msg)).then(() => {
            callback();
          });
        } else {
          dispatch(setAlert('error', msg));
        }
      });
  };

  const onSubmit = (data) => {
    const { agencyClientId, zohoId } = client;
    const { firstName, lastName, email } = data;
    const body = { email };
    if (isEmail(email)) {
      axios.post(`/agency/client/check-contact-email`, body).then((res) => {
        const { success, exists, alreadyAssigned, user } = res.data;
        if (success) {
          if (exists) {
            const { userId } = user;
            if (!alreadyAssigned) {
              //add contact
              updateZohoEmail(zohoId, firstName, lastName, email, () => {
                assignContact(agencyClientId, userId, () => {
                  getClient(agencyClientId, (c) => {
                    setOpen(false);
                    setClient({
                      ...c,
                      account: {
                        ...c.account,
                      },
                    });
                  });
                });
              });
            } else {
              dispatch(
                setAlert('error', 'The contact is already assigned to a client')
              );
            }
          } else {
            // create contact
            updateZohoEmail(zohoId, firstName, lastName, email, () => {
              createContact(agencyClientId, firstName, lastName, email, () => {
                getClient(agencyClientId, (c) => {
                  setOpen(false);
                  setClient({
                    ...c,
                    account: {
                      ...c.account,
                    },
                  });
                });
              });
            });
          }
        } else {
          dispatch(
            setAlert('error', 'Something went wrong, please try again later!')
          );
        }
      });
    } else {
      dispatch(setAlert('error', 'Invalid Email'));
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block w-full max-w-md my-8 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-xl">
        <ModalHeader
          title="Change Default Contact"
          setOpen={setOpen}
          titleClasses="capitalize"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-2 text-left bg-gray-50 p-3 rounded-lg shadow-sm">
            <div className="col-span-2">
              <Label htmlFor="firstName" classes="text-left">
                First Name
              </Label>
              <div>
                <Input
                  id="firstName"
                  type="text"
                  {...register('firstName', { required: true })}
                />
                {errors.firstName && (
                  <b className="text-red-800 text-xs">First Name is Required</b>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="lastName" classes="text-left">
                Last Name
              </Label>
              <div>
                <Input
                  id="lastName"
                  type="text"
                  {...register('lastName', { required: true })}
                />
                {errors.lastName && (
                  <b className="text-red-800 text-xs">Last Name is Required</b>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <Label htmlFor="email" classes="text-left">
                Email Address
              </Label>
              <div>
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: true,
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Entered value does not match email format',
                    },
                  })}
                />
                {errors.email && (
                  <b className="text-red-800 text-xs">
                    {errors.email.type === 'required'
                      ? 'Email Address is required'
                      : errors.email.message}
                  </b>
                )}
              </div>
            </div>
          </div>
          <div className="px-2 py-3 text-right bg-gray-50 border-t">
            <div>
              <Button
                color="gray"
                onClick={(e) => {
                  if (e) e.preventDefault();
                  clearErrors();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              &nbsp;
              <Button type="submit">Save</Button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ChangeDefaultContactModal;
