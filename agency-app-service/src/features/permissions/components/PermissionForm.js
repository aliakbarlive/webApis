import { useEffect, Fragment, useState, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { joiAlertErrorsStringify } from 'utils/formatters';
import { setAlert } from 'features/alerts/alertsSlice';
import Label from 'components/Forms/Label';
import Button from 'components/Button';

const PermissionForm = ({ data, setOpen, setSelected }) => {
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      await axios.post(`/agency/permissions`, values).then((res) => {
        console.log(res.data);
        setOpen(false);
        dispatch(setAlert('success', 'Variable Saved'));
      });
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const validationSchema = object().shape({
    feature: string().required('Required'),
    access: string().required('Required'),
    description: string(),
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
                <Label>feature</Label>
                <Field
                  name="feature"
                  placeholder="feature"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="text"
                />
                <ErrorMessage
                  name="feature"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-12">
                <Label>access</Label>
                <Field
                  name="access"
                  placeholder="access"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  as="textarea"
                />
                <ErrorMessage
                  name="access"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>

              <div className="col-span-12">
                <Label>Description</Label>
                <Field
                  name="description"
                  placeholder="Description"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  as="textarea"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
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
              <Button
                onClick={() => console.log(values)}
                type="submit"
                classes="mt-2"
              >
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PermissionForm;
