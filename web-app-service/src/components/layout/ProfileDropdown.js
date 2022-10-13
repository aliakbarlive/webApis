import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { withRouter, Link } from 'react-router-dom';
import { signOutAsync } from 'features/auth/authSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import classNames from 'utils/classNames';

const userNavigation = [
  { name: 'Settings', href: '/settings', type: 'link' },
  { name: 'Sign Out', type: 'button' },
];

const ProfileDropdown = ({ history }) => {
  const dispatch = useDispatch();

  const { firstName, lastName } = useSelector(selectAuthenticatedUser);

  const initials =
    firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

  return (
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
                            item.name === 'Sign Out' && dispatch(signOutAsync())
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
  );
};

export default withRouter(ProfileDropdown);
