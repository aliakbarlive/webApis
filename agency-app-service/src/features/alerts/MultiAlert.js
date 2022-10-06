import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Transition } from '@headlessui/react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { deleteAlert } from './alertsSlice';

const MultiAlert = ({ alerts }) => {
  const dispatch = useDispatch();

  const [show, setShow] = useState(true);

  useEffect(() => {
    if (alerts) setShow(true);
  }, [alerts]);

  const icon = (type) => {
    switch (type) {
      case 'success':
        return (
          <CheckCircleIcon
            className="h-6 w-6 text-green-400"
            aria-hidden="true"
          />
        );
      case 'error':
        return (
          <ExclamationCircleIcon
            className="h-6 w-6 text-red-400"
            aria-hidden="true"
          />
        );
      case 'info':
        return (
          <InformationCircleIcon
            className="h-6 w-6 text-yellow-400"
            aria-hidden="true"
          />
        );

      default:
        break;
    }
  };

  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div className="p-4">
          <div className="w-full text-right">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={() => {
                setShow(false);
              }}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start">
              <div className="flex-shrink-0">{icon(alert.type)}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">
                  {alert.title}
                </p>
                <p className="mt-1 text-sm text-gray-500 whitespace-pre-wrap">
                  {alert.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="bg-white rounded-md inline-flex text-red-400 hover:text-red-500 text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => {
                    dispatch(deleteAlert(alert.id));
                  }}
                >
                  <TrashIcon className="h-4 hw-4 inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Transition>
  );
};

export default MultiAlert;
