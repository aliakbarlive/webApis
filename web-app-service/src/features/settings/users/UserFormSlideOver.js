import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, MailIcon } from '@heroicons/react/outline';

const _ = require('lodash');

export default function UserFormSlideOver({ open, setOpen, user }) {
  const { firstName, lastName, email } = user;
  let header = 'Add User';
  let headerMessage =
    'Get started by filling in the information below to create new user.';
  if (!_.isEmpty(user)) {
    header = 'Edit User';
    headerMessage = '';
  }
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
          <Dialog.Overlay className="absolute inset-0" />

          <div className="fixed inset-y-0 pl-16 max-w-full right-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <form
                  className="h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl"
                  autoComplete="no"
                >
                  <div className="flex-1 h-0 overflow-y-auto">
                    <div className="py-6 px-4 bg-red-700 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          {header}
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-red-700 rounded-md text-red-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-red-300">{headerMessage}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="px-4 divide-y divide-gray-200 sm:px-6">
                        <div className="space-y-6 pt-6 pb-5">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-900"
                            >
                              First name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                defaultValue={
                                  firstName !== null ? firstName : ''
                                }
                                className="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Last name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                defaultValue={lastName !== null ? lastName : ''}
                                className="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="Phone"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Phone
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="Phone"
                                id="Phone"
                                className="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MailIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={email !== null ? email : ''}
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                placeholder="user@betterseller.com"
                                autoComplete="no"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="password"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Password
                            </label>
                            <div className="mt-1">
                              <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="no"
                                className="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="confirmPassword"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Confirm Password
                            </label>
                            <div className="mt-1">
                              <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                className="block w-full shadow-sm sm:text-sm focus:ring-gray-500 focus:border-gray-500 border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 px-4 py-4 flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
