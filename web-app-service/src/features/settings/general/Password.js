import React from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { updatePasswordAsync } from 'features/auth/authSlice';
import Input from 'components/aron/Input';
import Alert from 'components/Alert';

const Password = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: (values) => {
      const errors = {};

      if (!values.password) {
        errors.password = 'Current password is required';
      }

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
    onSubmit: (values) => {
      dispatch(updatePasswordAsync(values));
      formik.resetForm();
    },
  });

  const noOfErrors = Object.keys(formik.errors).length;
  const noOfTouched = Object.keys(formik.touched).length;

  return (
    <section aria-labelledby="payment_details_heading">
      <form name="password" onSubmit={formik.handleSubmit}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2
                id="payment_details_heading"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Password
              </h2>
              {/* <p className="mt-1 text-sm text-gray-500">
                Update your personal information.
              </p> */}
            </div>

            {noOfErrors !== 0 && noOfTouched !== 0 && (
              <div className="mt-3">
                <Alert message={'Some fields require your attention.'} />
              </div>
            )}

            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <Input
                  label="Current Password"
                  type="password"
                  name="password"
                  id="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.errors.password}
                  touched={formik.touched.password}
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <Input
                  label="New Password"
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
              <div className="col-span-4 sm:col-span-2">
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
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              // form="profile"
              type="submit"
              className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Password;
