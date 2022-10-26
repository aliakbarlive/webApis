import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import Input from 'components/aron/Input';
import axios from 'axios';
import { setAlert } from 'features/alerts/alertsSlice';
import classNames from 'utils/classNames';

const ResetPassword = ({ userId, type }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      userId: userId,
      newPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.newPassword) {
        errors.newPassword = 'New password is required';
      } else if (values.newPassword.length < 8) {
        errors.newPassword = 'New password much be more than 8 characters';
      }

      if (!values.confirmPassword) {
        errors.confirmPassword = 'Please confirm new password';
      } else if (values.newPassword !== values.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        const out = await axios.patch('/auth/you/password', values);
        console.log(out);

        dispatch(setAlert('success', 'Successfully updated password'));
      } catch (error) {
        dispatch(
          setAlert(
            'error',
            'Error updating password',
            error.response.data.message
          )
        );
      }
      formik.resetForm();
    },
  });

  return (
    <section>
      <form name="password" onSubmit={formik.handleSubmit}>
        <div
          className={classNames(
            type === 'client' && 'mt-3 shadow sm:rounded-md sm:overflow-hidden',
            ''
          )}
        >
          <div
            className={classNames(type === 'client' && 'py-4 px-6', 'bg-white')}
          >
            <h4 className="font-semibold">
              {type === 'client' ? 'Default Contact' : 'Reset Password'}
            </h4>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <div className="col-span-1">
                <Input
                  label=" New Password"
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  error={formik.errors.newPassword}
                  touched={formik.touched.newPassword}
                />
              </div>
              <div className="col-span-1">
                <Input
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  error={formik.errors.confirmPassword}
                  touched={formik.touched.confirmPassword}
                />
              </div>
            </div>
          </div>
          <div className="px-6 py-3 text-right">
            <button type="submit" className="btn-red">
              Reset
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default ResetPassword;
