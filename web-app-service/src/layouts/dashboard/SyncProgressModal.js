import React, { useRef } from 'react';
import { CheckIcon, XIcon, RefreshIcon } from '@heroicons/react/outline';
import { startCase } from 'lodash';

import Modal from 'components/Modal';

const SyncProgressModal = ({ open, setOpen, details = {} }) => {
  let listRef = useRef(null);

  const Info = ({ attribute }) => {
    return (
      <li className="py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-normal text-gray-700">
            {details[attribute] === 'PENDING' ? 'In-Progress' : 'Completed'} -{' '}
            {startCase(attribute)}
          </h3>

          {details[attribute] === 'PENDING' ? (
            <RefreshIcon
              className="h-6 w-6 text-green-600"
              aria-hidden="true"
            />
          ) : (
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          )}
        </div>
      </li>
    );
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle md:max-w-md md:w-full">
        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 md:px-6 border-b-2 pb-3">
          <h3 className="text-md leading-6 font-medium text-gray-800">
            Sync Details
          </h3>
        </div>

        <div className="text-center px-4 md:px-6 pb-4s">
          <div className="my-5">
            <ul className="-my-5 divide-y divide-gray-200" ref={listRef}>
              {Object.keys(details).map((attr) => (
                <Info key={attr} attribute={attr} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SyncProgressModal;
