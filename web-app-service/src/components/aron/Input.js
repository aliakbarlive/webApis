import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import classNames from 'utils/classNames';

const Input = (props) => {
  const { label, name, error, touched } = props;

  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          className={classNames(
            touched && error ? 'border-red-300' : 'border-gray-300',
            'mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-200 focus:border-green-200 sm:text-sm'
          )}
          {...props}
        />

        {touched && error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {touched && error && (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </>
  );
};

export default Input;
