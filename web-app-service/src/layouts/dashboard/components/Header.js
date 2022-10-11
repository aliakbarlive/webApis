import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { MenuAlt2Icon, BellIcon } from '@heroicons/react/outline';
import classNames from 'utils/classNames';
import { signOutAsync } from 'features/auth/authSlice';
import MarketplacePicker from './MarketplacePicker';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

const Header = ({ setMobileMenuOpen, userNavigation, history }) => {
  const dispatch = useDispatch();
  const { firstName, lastName } = useSelector(selectAuthenticatedUser);
  const initials =
    firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      {setMobileMenuOpen && (
        <button
          type="button"
          className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <div className="flex-1 px-4 flex justify-end">
        {/* <div className="flex-1 flex">
          <form className="w-full flex md:ml-0" action="#" method="GET">
            <label htmlFor="search_field" className="sr-only">
              Search
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <input
                id="search_field"
                className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </form>
        </div> */}
        <div className="ml-4 flex items-center md:ml-6">
          <MarketplacePicker history={history} />

          <button className="bg-white ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="ml-3 relative">
            {({ open }) => (
              <>
                <div>
                  <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <span className="sr-only">Open user menu</span>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-400">
                      <span className="font-medium leading-none text-white">
                        {initials}
                      </span>
                    </span>
                  </Menu.Button>
                </div>
                {userNavigation && (
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) =>
                            item.type === 'button' ? (
                              <button
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'flex w-full px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() =>
                                  item.name === 'Sign Out' &&
                                  dispatch(signOutAsync(history))
                                }
                              >
                                {item.name}
                              </button>
                            ) : (
                              <Link
                                to={item.href}
                                className={classNames(
                                  active ? 'bg-gray-100' : '',
                                  'block px-4 py-2 text-sm text-gray-700'
                                )}
                                onClick={() =>
                                  item.name === 'Sign Out' &&
                                  dispatch(signOutAsync())
                                }
                              >
                                {item.name}
                              </Link>
                            )
                          }
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                )}
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
