import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { selectIsLoading, resetPassword } from './authSlice';
import AuthLayout from 'layouts/auth/AuthLayout';
import logo from 'assets/logos/logo-orange.png';

const ResetPassword = ({ history }) => {
  const dispatch = useDispatch();
  const { resetToken } = useParams();

  const isLoading = useSelector(selectIsLoading);

  const [formData, setFormData] = useState({
    password: '',
    passwordcheck: '',
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(formData, resetToken, history));
  };

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto rounded-md"
          src={logo}
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 lead">
          Enter your new password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={onSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  onChange={onInputChange}
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Re-enter New Password
              </label>
              <div className="mt-1">
                <input
                  id="passwordcheck"
                  name="passwordcheck"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  onChange={onInputChange}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isLoading ? true : false}
              >
                {isLoading && (
                  <Loader
                    type="Oval"
                    color="#FFF"
                    height={20}
                    width={20}
                    className="mr-2"
                  />
                )}
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
