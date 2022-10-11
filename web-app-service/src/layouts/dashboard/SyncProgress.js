import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { XIcon } from '@heroicons/react/outline';

import {
  selectCurrentAccount,
  selectInitialSyncStatus,
  getInitialSyncStatusAsync,
} from 'features/accounts/accountsSlice';

import SyncProgressModal from './SyncProgressModal';

const SyncProgress = () => {
  const account = useSelector(selectCurrentAccount);
  const initialSyncStatus = useSelector(selectInitialSyncStatus);
  const dispatch = useDispatch();

  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (account) dispatch(getInitialSyncStatusAsync(account.accountId));
  }, [dispatch, account]);

  useEffect(() => {
    if (initialSyncStatus.summary) {
      setProgress(initialSyncStatus.summary.percentage);
      setVisible(!initialSyncStatus.summary.done);
    }
  }, [dispatch, initialSyncStatus]);

  return (
    <div
      className={
        visible ? 'p-2 mb-3 rounded-lg bg-red-500 shadow-lg sm:p-3' : 'hidden'
      }
    >
      <SyncProgressModal
        open={showDetails}
        setOpen={setShowDetails}
        details={initialSyncStatus.details}
      />

      <div className="flex items-center justify-between flex-wrap">
        <div className="flex flex-col">
          <p className="ml-3 text-md font-medium text-white">
            <span className="inline">{progress}% Complete</span>
          </p>
          <p className="ml-3 text-xs text-white truncate">
            <span className="inline">Amazon account sync in-progress</span>
          </p>
        </div>

        <div className="flex flex-1 flex-col mx-5">
          <div className="rounded w-full bg-white">
            <div
              className="bg-gray-500 text-xs leading-none py-1 text-center text-white"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <button
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none"
            onClick={() => setShowDetails(true)}
          >
            Details
          </button>
        </div>

        <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
          <button
            type="button"
            className="-mr-1 flex p-2 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SyncProgress;
