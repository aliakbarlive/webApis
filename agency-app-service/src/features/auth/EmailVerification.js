import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactCodeInput from 'react-verification-code-input';

import {
  selectAuthenticatedUser,
  verifyEmailAsync,
  resendVerificationEmailAsync,
} from './authSlice';

import OnboardingLayout from 'layouts/onboarding/OnboardingLayout';

const EmailVerification = ({ history }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (user.isEmailVerified) history.push('/onboarding');
  }, [user, history]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(verifyEmailAsync(token, history));
  };

  const onResendVerification = (e) => {
    e.preventDefault();
    dispatch(resendVerificationEmailAsync());
  };

  return (
    <OnboardingLayout>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please enter the verification code sent to {user.email}
        </p>
      </div>

      <div className="mt-8 px-4 sm:px-0 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={onSubmit}
          >
            <div>
              <div className="mt-1">
                <ReactCodeInput
                  className="mb-2 mx-auto"
                  onChange={setToken}
                  type="text"
                  fieldWidth={48}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Verify
              </button>
            </div>

            <div className="mt=3 text-center">
              <button
                type="link"
                className="w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none"
                onClick={onResendVerification}
              >
                Resend verification code
              </button>
            </div>
          </form>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default EmailVerification;
