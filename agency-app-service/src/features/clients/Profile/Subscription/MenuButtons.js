import React from 'react';
import { Menu } from '@headlessui/react';
import Button from 'components/Button';
import DropdownMenu from 'components/DropdownMenu';
import ButtonLink from 'components/ButtonLink';
import { AnnotationIcon } from '@heroicons/react/outline';
import usePermissions from 'hooks/usePermissions';
import useSubscription from 'hooks/useSubscription';
import {
  CANCELLED,
  DUNNING,
  EXPIRED,
  FUTURE,
  LIVE,
  NON_RENEWING,
  UNPAID,
} from 'utils/subscriptions';

const MenuButtons = ({
  subscription,
  onEditSubscription,
  setIsOpenUpdateCardDetails,
  setIsOpenAddOneTimeAddon,
  onCancelSubscription,
  setIsOpenPause,
  setIsOpenResume,
  setIsOpenRecentActivities,
  setIsOpenCancel,
  setIsOpenCancelImmediately,
}) => {
  const { userCan, isSalesAdmin, isAgencySuperUser } = usePermissions();
  const status = useSubscription(subscription);

  const isEditable = () => {
    return status.hasAny([
      LIVE,
      FUTURE,
      UNPAID,
      DUNNING,
      NON_RENEWING,
      EXPIRED,
      CANCELLED,
    ]);
  };

  return (
    <div className="sm:col-span-3 sm:flex justify-between">
      <div>
        {isEditable() && userCan('clients.subscription.update') ? (
          <Button classes="mr-2" onClick={onEditSubscription}>
            {status.expired() || status.cancelled() ? 'Reactivate' : 'Edit'}
          </Button>
        ) : (
          ''
        )}
        {status.hasAny([LIVE, FUTURE, UNPAID, DUNNING]) &&
          userCan('clients.subscription.card.add') &&
          !subscription.card && (
            <Button
              classes="mr-2"
              onClick={() => setIsOpenUpdateCardDetails(true)}
            >
              Add Card
            </Button>
          )}
        {status.hasAny([LIVE, FUTURE, UNPAID, DUNNING]) &&
          userCan('clients.subscription.card.update') &&
          subscription.card && (
            <Button
              classes="mr-2"
              onClick={() => setIsOpenUpdateCardDetails(true)}
            >
              Update Card
            </Button>
          )}
        {/* {subscription.status === 'non_renewing' && (
          <Button classes="mr-2" onClick={onReactivateSubscription}>
            Reactivate Subscription
          </Button>
        )} */}
        {status.paused() && userCan('clients.subscription.pause') && (
          <>
            <Button classes="mr-2" onClick={() => setIsOpenResume(true)}>
              Resume Subscription
            </Button>
            {(isSalesAdmin() || isAgencySuperUser()) && (
              <>
                <Button classes="mr-2" onClick={() => setIsOpenCancel(true)}>
                  Cancel Subscription
                </Button>
                <Button
                  classes="mr-2"
                  onClick={() => setIsOpenCancelImmediately(true)}
                >
                  Cancel Immediately
                </Button>
              </>
            )}
          </>
        )}

        {status.hasAny([LIVE, UNPAID, DUNNING, NON_RENEWING]) &&
        userCan(
          'clients.subscription.addon.add|clients.subscription.pause|clients.subscription.update'
        ) ? (
          <DropdownMenu title="More">
            {userCan('clients.subscription.addon.add') && (
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && 'bg-red-500 text-white'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() => setIsOpenAddOneTimeAddon(true)}
                    >
                      Add One Time Addon
                    </button>
                  )}
                </Menu.Item>
              </div>
            )}
            <div className="px-1 py-1">
              {status.hasAny([LIVE, UNPAID, DUNNING]) &&
                userCan('clients.subscription.pause') && (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active && 'bg-red-500 text-white'
                          } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                          onClick={() => setIsOpenPause(true)}
                        >
                          Pause Subscription
                        </button>
                      )}
                    </Menu.Item>
                    {(isSalesAdmin() || isAgencySuperUser()) && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active && 'bg-red-500 text-white'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => setIsOpenCancel(true)}
                          >
                            Cancel Subscription
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </>
                )}

              {status.nonRenewing() && userCan('clients.subscription.update') && (
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active && 'bg-red-500 text-white'
                      } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                      onClick={() => setIsOpenCancelImmediately(true)}
                    >
                      Cancel Immediately
                    </button>
                  )}
                </Menu.Item>
              )}
            </div>
          </DropdownMenu>
        ) : (
          ''
        )}
      </div>
      {userCan('clients.subscription.activities.view') && (
        <div>
          <ButtonLink onClick={() => setIsOpenRecentActivities(true)}>
            <AnnotationIcon className="w-5 h-5 inline mr-1" /> Recent Activities
          </ButtonLink>
        </div>
      )}
    </div>
  );
};
export default MenuButtons;
