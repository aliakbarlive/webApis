import permissionDeniedImg from 'assets/images/permission_denied.svg';

import { ExclamationIcon } from '@heroicons/react/outline';

const AccountError = ({ message }) => {
  return (
    <div>
      <div className="w-full">
        <div className="p-2 rounded-lg bg-red-500 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <span className="flex p-2 rounded-lg bg-red-600">
                <ExclamationIcon
                  className="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white text-sm truncate">
                <span>{message}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-16 sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="permission-denied" src={permissionDeniedImg} />;
      </div>
    </div>
  );
};

export default AccountError;
