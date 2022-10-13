import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from 'layouts/auth/AuthLayout';

const ForgotPasswordSuccess = () => {
  return (
    <AuthLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://cdn.worldvectorlogo.com/logos/firefox-send.svg"
          alt="Workflow"
        />
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="my-4 text-center text-md text-gray-600 lead">
            We just emailed you instructions on how to reset your password.
          </p>
          <div>
            <Link to="/sign-in">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Return to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordSuccess;
