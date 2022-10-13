import React from 'react';
import { startCase, camelCase } from 'lodash';

import { XIcon } from '@heroicons/react/outline';

import { Modal } from 'components';

const AlertDetailsModal = ({ open, setOpen, alert, Component }) => {
  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-2xl w-full">
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

        {alert && (
          <>
            <div className="px-4 md:px-6 border-b-2 pb-3">
              <h3 className="text-md leading-6 font-medium text-gray-800">
                {startCase(camelCase(alert.type))}
              </h3>
            </div>

            <div className="px-4 md:px-6 pb-4s">
              <div className="my-5">
                {Component && <Component alert={alert} />}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AlertDetailsModal;
