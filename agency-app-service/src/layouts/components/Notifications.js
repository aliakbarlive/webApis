import React, { useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
  BellIcon,
  XIcon,
  BadgeCheckIcon,
  BanIcon,
  AnnotationIcon,
} from '@heroicons/react/outline';
import { Popover } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { dateFormatter } from 'utils/formatters';
import classNames from 'utils/classNames';
import SpinnerGrow from 'components/SpinnerGrow';
import { fetchNotifications, markAsRead } from './NotificationSlice';

const Notifications = () => {
  const { notifications, newMessages, hasNew } = useSelector(
    (state) => state.notifications
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notifications) {
      setLoading(true);
      dispatch(fetchNotifications()).then(() => {
        setLoading(false);
      });
    }
  }, [notifications]);

  const onMarkAsRead = async (open) => {
    if (!open) {
      setTimeout(() => {
        dispatch(markAsRead(newMessages));
      }, 10000);
    }
  };

  const renderSwitch = (key) => {
    switch (key) {
      case 'ok':
        return <BadgeCheckIcon className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <BanIcon className="w-4 h-4 text-red-600" />;
      default:
        return <AnnotationIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderLink = (notification) => {
    switch (notification.entity) {
      case 'clients':
        return `/clients/${
          notification.entityTypeId === '2' ? 'edit' : 'profile'
        }/${notification.entityId}`;
      default:
        return '';
    }
  };

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button
            className={classNames(open && 'opened', 'bell-notif')}
          >
            <div className="bell-div relative px-1 inline-flex items-center bg-white ml-3 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <span className="sr-only">View notifications</span>
              <span onClick={() => onMarkAsRead(open)} className="relative">
                <BellIcon
                  className="h-7 w-7 transform rotate-45"
                  aria-hidden="true"
                />
                {hasNew && (
                  <label className="w-3 h-3 bg-red-500 absolute bottom-0 right-0 rounded-lg shadow-lg border-gray-100 border-2"></label>
                )}
              </span>
              <div className="arrow-top"></div>
            </div>
          </Popover.Button>
          <Popover.Panel>
            <div className="menu-popup-div absolute bg-white shadow-lg border w-96 z-10 right-0">
              <div className="bg-green-50 p-4 text-gray-700 flex justify-between">
                <span className="flex items-center">
                  Notifications&nbsp;&nbsp;
                  {loading && <SpinnerGrow />}
                </span>
                <Popover.Button>
                  <XIcon className="h-5 w-5 inline text-gray-400" />
                </Popover.Button>
              </div>
              <div className="py-2 overflow-y-auto h-87vh">
                <ul className="divide-y divide-gray-200">
                  {notifications ? (
                    notifications.map((notification) => (
                      <li
                        key={notification.notificationObjectId}
                        className={classNames(
                          'p-4',
                          notification.new ? 'bg-yellow-50' : ''
                        )}
                      >
                        <div className="flex space-x-3">
                          {renderSwitch(notification.status)}
                          <div className="flex-1 space-y-1">
                            <div className="flex flex-col">
                              <p className="text-sm text-gray-700">
                                <Link to={renderLink(notification)}>
                                  {notification.message}
                                </Link>
                              </p>
                              <span className="text-1xs text-gray-400 mt-1">
                                {dateFormatter(
                                  notification.createdAt,
                                  'MMM DD, YYYY HH:MM:a'
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <span>No notifications</span>
                  )}
                </ul>
              </div>
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default withRouter(Notifications);
