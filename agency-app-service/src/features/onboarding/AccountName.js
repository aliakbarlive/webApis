import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateAccountAsync } from 'features/accounts/accountsSlice';

const AccountName = ({ account, setActiveStep }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const onNextClick = () => {
    dispatch(updateAccountAsync(account.accountId, { name }));
  };

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          What should we name your account?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We'll use this name to identify your account across the platform.
        </p>
      </div>

      <div className="mt-8">
        <input
          type="text"
          name="email"
          id="email"
          className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Enter an account name"
          aria-describedby="email-optional"
          defaultValue={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>

      <div className="mt-6 flex justify-end">
        {/* <button
          type="button"
          className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Back
        </button> */}
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
          onClick={onNextClick}
          disabled={name ? false : true}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default AccountName;
