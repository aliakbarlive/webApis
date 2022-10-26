import { useEffect, Fragment, useState, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { joiAlertErrorsStringify } from 'utils/formatters';
import { setAlert } from 'features/alerts/alertsSlice';
import Label from 'components/Forms/Label';
import Button from 'components/Button';

const LiAccountForm = ({ action, data, setOpen, getLiAccounts }) => {
  const dispatch = useDispatch();

  const onCreateLead = async (values) => {
    try {
      await axios.post(`/agency/leads/liAccounts`, values).then((res) => {
        setOpen(false);
        dispatch(setAlert('success', 'Variable Saved'));
        getLiAccounts();
      });
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onUpdateLIAccount = async (values) => {
    const { linkedInAccountId } = values;
    delete values.linkedInAccountId;
    delete values.createdAt;
    delete values.updatedAt;
    try {
      await axios
        .put(`/agency/leads/liAccounts/${linkedInAccountId}`, values)
        .then((res) => {
          setOpen(false);
          dispatch(setAlert('success', 'LinkedIn Account Updated'));
          getLiAccounts();
        });
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onSubmit = async (values) => {
    if (action == 'add') {
      onCreateLead(values);
    } else {
      onUpdateLIAccount(values);
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const validationSchema = object().shape({
    // key: string().required('Required'),
    name: string().required('Required'),
    email: string().email().nullable(),
  });

  return (
    <>
      <Formik
        initialValues={data}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize={true}
      >
        {({ handleChange, setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <Label>Name</Label>
                <Field
                  name="name"
                  placeholder="Name"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-12">
                <Label>Email</Label>
                <Field
                  name="email"
                  placeholder="Email"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>
              <div className="col-span-12">
                <Label>Gender</Label>
                <Field
                  name="gender"
                  as="select"
                  className="form-select text-sm"
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={(e) => {
                  onCancel(e);
                }}
                className="mt-2"
                color="green"
              >
                Cancel
              </button>
              <Button type="submit" classes="mt-2">
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LiAccountForm;
