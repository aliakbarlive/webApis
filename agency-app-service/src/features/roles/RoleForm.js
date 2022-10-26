import { useEffect, Fragment, useState, useCallback } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { object, string, number, date, array } from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { joiAlertErrorsStringify } from 'utils/formatters';
import { setAlert } from 'features/alerts/alertsSlice';
import Label from 'components/Forms/Label';
import Button from 'components/Button';
import Toggle from 'components/Toggle';

const RoleForm = ({ action, data, setOpen, getRoles }) => {
  const dispatch = useDispatch();

  const onCreateRole = async (values) => {
    delete values.roleId;
    try {
      await axios.post(`/agency/roles`, values).then((res) => {
        console.log(res.data);
        setOpen(false);
        dispatch(setAlert('success', 'Role Saved'));
        getRoles();
      });
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onUpdateRole = async (values) => {
    console.log('onUpdate');
    const { roleId } = values;
    delete values.roleId;
    delete values.createdAt;
    delete values.updatedAt;

    try {
      await axios.put(`/agency/roles/${roleId}`, values).then((res) => {
        setOpen(false);
        dispatch(setAlert('success', 'Role Updated'));
        getRoles();
      });
    } catch (error) {
      const errorMessages = joiAlertErrorsStringify(error);
      dispatch(setAlert('error', error.response.data.message, errorMessages));
    }
  };

  const onSubmit = async (values) => {
    if (action == 'add') {
      onCreateRole(values);
    } else {
      onUpdateRole(values);
    }
  };

  const onCancel = (e) => {
    e.preventDefault();
    setOpen(false);
  };

  const onToggleAccess = (e, setFieldValue) => {
    console.log('ontoggle', e);
    data.hasAccessToAllClients = e;
    setFieldValue('hasAccessToAllClients', e);
  };

  const validationSchema = object().shape({
    name: string().required('Required'),
    level: string(),
    groupLevel: string(),
    allowPerGroup: number().min(1).nullable(),
    seniorityLevel: number().min(1).nullable(),
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
              <div className="col-span-6">
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
              <div className="col-span-6">
                <Label>Level</Label>
                <Field name="level" as="select" className="form-select text-sm">
                  {['', 'application', 'agency', 'account', 'system'].map(
                    (rec) => {
                      return (
                        <option key={rec} value={rec}>
                          {rec}
                        </option>
                      );
                    }
                  )}
                </Field>
              </div>
              <div className="col-span-6">
                <Label>Group Level</Label>
                <Field
                  name="groupLevel"
                  as="select"
                  className="form-select text-sm"
                >
                  {['', 'squad', 'pod', 'cell'].map((rec) => {
                    return <option value={rec}>{rec}</option>;
                  })}
                </Field>
              </div>

              <div className="col-span-6">
                <Label>Allow Per Group</Label>
                <Field
                  name="allowPerGroup"
                  placeholder="Allow Per Group"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="number"
                />
                <ErrorMessage
                  name="competitorSalesUnits"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>
              <div className="col-span-6">
                <Label>Department</Label>
                <Field
                  name="department"
                  as="select"
                  className="form-select text-sm"
                >
                  {[
                    '',
                    'operations',
                    'ppc',
                    'sales',
                    'sales lead',
                    'writing',
                    'design',
                  ].map((rec) => {
                    return (
                      <option key={rec} value={rec}>
                        {rec}
                      </option>
                    );
                  })}
                </Field>
              </div>
              <div className="col-span-6">
                <Label>Seniority Level</Label>
                <Field
                  name="seniorityLevel"
                  placeholder="Seniority Level"
                  className="form-select text-sm"
                  onChange={(e) => handleChange(e)}
                  type="number"
                />
                <ErrorMessage
                  name="seniorityLevel"
                  component="div"
                  className="text-red-700 font-normal text-xs"
                />
              </div>
              <div className="col-span-6">
                <label className="mt-4 flex items-center">
                  <Toggle
                    onChange={(e) => onToggleAccess(e, setFieldValue)}
                    checked={data.hasAccessToAllClients}
                  />
                  <span className="ml-2 text-red-700 text-left">
                    Has Access To All Clients
                  </span>
                </label>
                <ErrorMessage
                  name="competitorSalesUnits"
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
                // onClick={() => console.log(values)}
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

export default RoleForm;
