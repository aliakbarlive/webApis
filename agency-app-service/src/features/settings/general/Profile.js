import React from 'react';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAuthenticatedUser,
  updateMeAsync,
} from 'features/auth/authSlice';
import Input from 'components/aron/Input';
import Alert from 'components/Alert';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    validate: (values) => {
      const errors = {};

      if (!values.firstName) {
        errors.firstName = 'First name is required';
      } else if (values.firstName.length > 20) {
        errors.firstName = 'First name must be 20 characters or less';
      }

      if (!values.lastName) {
        errors.lastName = 'Last name is required';
      } else if (values.lastName.length > 20) {
        errors.lastName = 'Last name must be 20 characters or less';
      }

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
      ) {
        errors.email =
          'Please enter an email address in format: name@example.com';
      }

      return errors;
    },
    onSubmit: (values) => {
      dispatch(updateMeAsync(values));
    },
  });

  const noOfErrors = Object.keys(formik.errors).length;
  const noOfTouched = Object.keys(formik.touched).length;

  return (
    <section>
      <form name="profileInformation" onSubmit={formik.handleSubmit}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2
                id="payment_details_heading"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Profile Information
              </h2>
            </div>

            {noOfErrors !== 0 && noOfTouched !== 0 && (
              <div className="mt-3">
                <Alert message={'Some fields require your attention'} />
              </div>
            )}

            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  id="firstName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  error={formik.errors.firstName}
                  touched={formik.touched.firstName}
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  id="lastName"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  error={formik.errors.lastName}
                  touched={formik.touched.lastName}
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  id="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.errors.email}
                  touched={formik.touched.email}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
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

export default Profile;
