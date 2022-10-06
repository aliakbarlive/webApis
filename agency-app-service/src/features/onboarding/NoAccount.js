import React from 'react';

const NoAccount = () => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-xl">
      <div className="mt-8 bg-white py-12 px-12 shadow sm:rounded-lg">
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          What should we name your account?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We'll use this name to identify your account across the platform.
        </p>
      </div>
    </div>
  );
};

export default NoAccount;
