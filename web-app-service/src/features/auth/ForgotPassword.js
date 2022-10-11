import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from 'react-loader-spinner';
import { selectIsLoading, forgotPassword } from './authSlice';
import AuthLayout from 'layouts/auth/AuthLayout';

const ForgotPassword = ({ history }) => {
  const dispatch = useDispatch();

  const isLoading = useSelector(selectIsLoading);

  const [formData, setFormData] = useState({
    email: '',
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(formData, history));
  };

  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://cdn.worldvectorlogo.com/logos/firefox-send.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 lead">
          Enter your email to your reset password.
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
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
          <div className="pt-4 text-sm">
            Did you remember your password?
            <Link
              to="/sign-in"
              className="pl-2 font-medium text-red-600 hover:text-red-500"
            >
              Try logging in.
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
