import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { PlusIcon } from '@heroicons/react/solid';

const AddEmployeeSlideOver = ({ open, setOpen, onAddEmployee }) => {
  const [employees, setEmployees] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAccountEmployees = async () => {
      const res = await axios({
        method: 'GET',
        url: `/agency/employees`,
      });

      setEmployees(res.data.data);
      setLoading(false);
    };

    getAccountEmployees();
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 overflow-hidden z-20"
        open={open}
        onClose={setOpen}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-lg">
                <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Add Employee
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 relative flex-1">
                    <ul
                      role="list"
                      className="flex-1 divide-y divide-gray-200 overflow-y-auto"
                    >
                      {employees &&
                        employees.rows.map((employee) => (
                          <li key={employee.userId}>
                            <div className="relative group py-6 px-5 flex items-center">
                              <a
                                // href={employee.href}
                                className="-m-1 flex-1 block p-1"
                              >
                                <div
                                  className="absolute inset-0 group-hover:bg-gray-50"
                                  aria-hidden="true"
                                />
                                <div className="flex-1 flex items-center min-w-0 relative">
                                  <span className="flex-shrink-0 inline-block relative">
                                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-400">
                                      <span className="font-medium leading-none text-white">
                                        {employee.firstName
                                          .charAt(0)
                                          .toUpperCase() +
                                          employee.lastName
                                            .charAt(0)
                                            .toUpperCase()}
                                      </span>
                                    </span>
                                  </span>
                                  <div className="ml-4 truncate">
                                    <p className="text-base font-bold text-gray-900 truncate">
                                      {`${employee.firstName} ${employee.lastName}`}
                                    </p>

                                    <p className="text-sm text-gray-500 truncate">
                                      <span className="font-bold">Email:</span>{' '}
                                      {employee.email}
                                    </p>

                                    <p className="text-sm text-gray-500 truncate">
                                      <span className="font-bold">Role:</span>{' '}
                                      <span className="capitalize">
                                        {employee.role.name}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </a>
                              <div className="ml-2 flex-shrink-0 relative inline-block text-left">
                                <button
                                  className="group relative w-8 h-8 bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                  onClick={() => onAddEmployee(employee)}
                                >
                                  <span className="flex items-center justify-center h-full w-full rounded-full">
                                    <PlusIcon
                                      className="w-5 h-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddEmployeeSlideOver;
