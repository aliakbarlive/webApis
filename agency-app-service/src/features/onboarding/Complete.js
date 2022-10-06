import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentAccount,
  updateAccountAsync,
} from '../accounts/accountsSlice';

const Complete = () => {
  const dispatch = useDispatch();

  const currentAccount = useSelector(selectCurrentAccount);

  const onComplete = async () => {
    dispatch(
      updateAccountAsync(currentAccount.accountId, { isOnboarding: false })
    );
  };

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Congratulations! Your account is ready.
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Click the button below to get redirected to your dashboard.
        </p>
      </div>

      <div className="mt-8"></div>

      <div className="mt-6 flex justify-end">
        {/* <button
          type="button"
          className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Back
        </button> */}
        <button
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={onComplete}
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
};

export default Complete;
