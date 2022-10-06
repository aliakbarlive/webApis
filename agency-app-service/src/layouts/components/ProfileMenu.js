import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'utils/classNames';
import { XIcon } from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';
import { signOutAsync, selectAuthenticatedUser } from 'features/auth/authSlice';

const ProfileMenu = ({ userNavigation, history, isOnboarding = false }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);

  const { firstName, lastName } = user;

  const initials =
    firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(open && 'opened', 'bell-notif')}
          >
            <div className="bell-div relative inline-flex items-center bg-white ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <span className="sr-only">Open User Settings</span>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-400">
                <span className="font-medium leading-none text-white">
                  {initials}
                </span>
              </span>
            </div>
          </Popover.Button>
          <Popover.Panel>
            <div className="menu-popup-div absolute bg-white shadow-lg border w-96 z-10 right-0">
              <div className="bg-green-50 py-8 text-gray-700">
                <span className="absolute right-5 top-3">
                  <Popover.Button>
                    <XIcon className="h-5 w-5 inline text-gray-400" />
                  </Popover.Button>
                </span>
                <div className="text-center flex flex-col items-center space-y-2">
                  <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-400">
                    <span className="leading-none text-white text-2xl">
                      {initials}
                    </span>
                  </span>
                  <span className="text-sm uppercase text-gray-800">
                    {user.firstName}&nbsp;
                    {user.lastName}
                  </span>
                  {user.role.level === 'agency' && (
                    <span className="text-1xs text-gray-400 uppercase">
                      {user.role?.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{user.email}</span>
                  <div className="flex items-center divide-x-2 leading-none pt-2">
                    {!isOnboarding && (
                      <Link
                        to="/settings"
                        className="text-sm text-red-400 hover:text-red-600 pr-3"
                      >
                        {t('Dashboard.Settings')}
                      </Link>
                    )}
                    <button
                      className="text-sm text-red-700 hover:text-red-800 pl-3"
                      onClick={() => dispatch(signOutAsync(history))}
                    >
                      {t('Dashboard.SignOut')}
                    </button>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2">
                {/* <ul className="divide-y divide-gray-200">
                  {userNavigation.map((item) => (
                    <li key={item.name}>
                      {item.type === 'button' ? (
                        <button
                          className="flex w-full px-4 py-2 text-sm text-gray-700  bg-white hover:bg-gray-100"
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
                          className="block px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-100"
                          onClick={() =>
                            item.name === 'Sign Out' && dispatch(signOutAsync())
                          }
                        >
                          {item.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul> */}
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default withRouter(ProfileMenu);
