import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Loading from 'components/Loading';
import { Card } from 'components';
import PlanAddonsTable from './Subscription/PlanAddonsTable';
import {
  buyOneTimeAddon,
  cancelSubscription,
  changeSubscription,
  changeSubscriptionStatus,
  dropScheduledChanges,
  extendBillingCycle,
  reactivateSubscription,
  updateAutoCollect,
  updateCard,
} from '../subscriptionsSlice';
import ConfirmationModal from 'components/ConfirmationModal';
import CancelSubscriptionModal from './Subscription/CancelSubscriptionModal';
import ScheduledChanges from './Subscription/ScheduledChanges';
import MenuButtons from './Subscription/MenuButtons';
import Details from './Subscription/Details';
import Summary from './Subscription/Summary';
import AddAddonModal from './Subscription/AddAddonModal';
import ChangeSubscriptionModal from './Subscription/ChangeSubscriptionModal';
import { setAlert } from 'features/alerts/alertsSlice';
import ExtendBillingCycleModal from './Subscription/ExtendBillingCycleModal';
import Notes from './Subscription/Notes';
import RecentActivitiesSlideOver from './Subscription/RecentActivitiesSlideOver';
import { DUNNING, UNPAID } from 'utils/subscriptions';
import CancelImmediatelyModal from './Subscription/CancelImmediatelyModal';

const Subscription = ({ client, cycleDate }) => {
  const dispatch = useDispatch();
  const { subscriptionId } = client.account.subscription;
  const [subscription, setSubscription] = useState({});
  const [scheduledChanges, setScheduledChanges] = useState({});
  const [pendingInvoices, setPendingInvoices] = useState({});
  const [termination, setTermination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCancel, setIsOpenCancel] = useState(false);
  const [isOpenCancelImmediately, setIsOpenCancelImmediately] = useState(false);
  const [isOpenAddOneTimeAddon, setIsOpenAddOneTimeAddon] = useState(false);
  const [isOpenChangeSubscription, setIsOpenChangeSubscription] =
    useState(false);
  const [isOpenUpdateCardDetails, setIsOpenUpdateCardDetails] = useState(false);
  const [isOpenExtendBillingCycle, setIsOpenExtendBillingCycle] =
    useState(false);
  const [isOpenResume, setIsOpenResume] = useState(false);
  const [isOpenPause, setIsOpenPause] = useState(false);
  const [isOpenRecentActivities, setIsOpenRecentActivities] = useState(false);

  const getSubscription = async () => {
    setLoading(true);
    await axios.get(`/agency/subscription/${subscriptionId}`).then((res) => {
      setSubscription(res.data.subscription);
      setScheduledChanges(res.data.scheduledChanges);
      setPendingInvoices(res.data.pendingInvoices);
      setTermination(res.data.termination);
      setLoading(false);
    });
  };

  useEffect(() => {
    getSubscription();
  }, [subscriptionId]);

  const changeAutoCollect = () => {
    dispatch(
      updateAutoCollect(subscriptionId, !subscription.auto_collect)
    ).then(() => {
      getSubscription();
    });
  };

  const updateCardDetails = () => {
    setLoading(true);
    dispatch(updateCard(subscriptionId, client.defaultContact.email)).then(
      () => {
        setIsOpenUpdateCardDetails(false);
        setLoading(false);
      }
    );
  };

  const dropChanges = () => {
    dispatch(dropScheduledChanges(subscriptionId)).then(() => {
      setIsOpen(false);
      getSubscription();
    });
  };

  const onCancelSubscription = (cancelAtEnd) => {
    setLoading(true);
    dispatch(cancelSubscription(subscriptionId, cancelAtEnd)).then(() => {
      if (cancelAtEnd) {
        setIsOpenCancel(false);
      } else {
        setIsOpenCancelImmediately(false);
      }
      setLoading(false);
      getSubscription();
    });
  };

  const onReactivateSubscription = () => {
    dispatch(reactivateSubscription(subscriptionId)).then(() => {
      getSubscription();
    });
  };

  const onAddOneTimeAddon = (formData) => {
    setLoading(true);
    dispatch(buyOneTimeAddon(subscriptionId, formData)).then((res) => {
      if (res && res.output.code === 0) {
        setIsOpenAddOneTimeAddon(false);
      }
      setLoading(false);
    });
  };

  const onExtendBillingCycle = (billingCycle) => {
    setLoading(true);
    dispatch(extendBillingCycle(subscriptionId, billingCycle)).then((res) => {
      if (res.output.code === 0) {
        setIsOpenExtendBillingCycle(false);
        getSubscription();
      }
      setLoading(false);
    });
  };

  const onEditSubscription = () => {
    if (pendingInvoices.invoices.length > 0) {
      dispatch(
        setAlert(
          'error',
          'There is a pending invoice for this subscription. Please verify it before updating.'
        )
      );
    } else {
      setIsOpenChangeSubscription(true);
    }
  };

  const onSaveSubscription = (formData) => {
    setLoading(true);
    dispatch(changeSubscription(subscriptionId, formData)).then((res) => {
      if (res?.output.code === 0) {
        dispatch(setAlert('success', `Subscription updated`));
        setIsOpenChangeSubscription(false);
        getSubscription();
      } else {
        if (res?.output) {
          dispatch(setAlert('error', res?.output.message));
        }
      }
      setLoading(false);
    });
  };

  const onPauseSubscription = () => {
    setLoading(true);
    dispatch(changeSubscriptionStatus(subscriptionId, 'pause')).then(() => {
      setLoading(true);
      setIsOpenPause(false);
      getSubscription();
    });
  };

  const onResumeSubscription = () => {
    setLoading(true);
    dispatch(changeSubscriptionStatus(subscriptionId, 'resume')).then(() => {
      setLoading(true);
      setIsOpenResume(false);
      getSubscription();
    });
  };

  return (
    <Card overflowHidden={false}>
      <div className="sm:grid sm:grid-cols-3 sm:gap-4">
        {loading && Object.entries(subscription).length <= 0 ? (
          <Loading />
        ) : (
          subscription && (
            <>
              <MenuButtons
                subscription={subscription}
                termination={termination}
                onEditSubscription={onEditSubscription}
                setIsOpenUpdateCardDetails={setIsOpenUpdateCardDetails}
                onReactivateSubscription={onReactivateSubscription}
                setIsOpenChangeSubscription={setIsOpenChangeSubscription}
                setIsOpenCancel={setIsOpenCancel}
                setIsOpenCancelImmediately={setIsOpenCancelImmediately}
                setIsOpenAddOneTimeAddon={setIsOpenAddOneTimeAddon}
                onCancelSubscription={onCancelSubscription}
                onAddOneTimeAddon={onAddOneTimeAddon}
                setIsOpenPause={setIsOpenPause}
                setIsOpenResume={setIsOpenResume}
                setIsOpenRecentActivities={setIsOpenRecentActivities}
              />

              <Details
                subscription={subscription}
                termination={termination}
                cycleDate={cycleDate}
                changeAutoCollect={changeAutoCollect}
                updateCardDetails={() => setIsOpenUpdateCardDetails(true)}
              />

              <div className="sm:col-span-2 sm:border-l">
                <Summary
                  subscription={subscription}
                  setIsOpenExtendBillingCycle={setIsOpenExtendBillingCycle}
                  getSubscription={getSubscription}
                />
                {scheduledChanges && scheduledChanges.code === 0 && (
                  <ScheduledChanges
                    open={isOpen}
                    setOpen={setIsOpen}
                    scheduledChanges={scheduledChanges}
                    onDropChanges={dropChanges}
                  />
                )}
                <div className="sm:p-5 overflow-auto">
                  <PlanAddonsTable
                    subscription={subscription}
                    setSubscription={setSubscription}
                  />
                </div>
                <div className="sm:p-5">
                  <Notes
                    subscription={subscription}
                    setSubscription={setSubscription}
                  />
                </div>
              </div>
              <ConfirmationModal
                title="Update payment details"
                content={`This will send an email to ${client.defaultContact.email} with instructions to update their payment details`}
                open={isOpenUpdateCardDetails}
                setOpen={setIsOpenUpdateCardDetails}
                onOkClick={updateCardDetails}
                onCancelClick={() => setIsOpenUpdateCardDetails(false)}
                okLoading={loading}
                showOkLoading={true}
              />
              <ConfirmationModal
                title="Pause Subscription?"
                content={
                  subscription.status === UNPAID ||
                  subscription.status === DUNNING ? (
                    <>
                      This subscription's status is {subscription.status}.
                      <br /> To pause this subscription,{' '}
                      <i>
                        we'll have to set their payment mode to offline
                      </i>. <br />
                      Do you want to continue?
                    </>
                  ) : (
                    `You will be able to resume this subscription manually`
                  )
                }
                open={isOpenPause}
                setOpen={setIsOpenPause}
                onOkClick={onPauseSubscription}
                onCancelClick={() => setIsOpenPause(false)}
                okLoading={loading}
                showOkLoading={true}
              />
              <ConfirmationModal
                title="Resume Subscription"
                content={`Reactivate this subscription?`}
                open={isOpenResume}
                setOpen={setIsOpenResume}
                onOkClick={onResumeSubscription}
                onCancelClick={() => setIsOpenResume(false)}
                okLoading={loading}
                showOkLoading={true}
              />
              <CancelSubscriptionModal
                open={isOpenCancel}
                setOpen={setIsOpenCancel}
                onChange={onCancelSubscription}
                subscription={subscription}
                pendingInvoices={pendingInvoices}
                loading={loading}
              />
              <CancelImmediatelyModal
                open={isOpenCancelImmediately}
                setOpen={setIsOpenCancelImmediately}
                onChange={onCancelSubscription}
                pendingInvoices={pendingInvoices}
                loading={loading}
              />

              <AddAddonModal
                subscription={subscription}
                open={isOpenAddOneTimeAddon}
                setOpen={setIsOpenAddOneTimeAddon}
                onAddOneTimeAddon={onAddOneTimeAddon}
                loading={loading}
              />

              <ChangeSubscriptionModal
                subscription={subscription}
                scheduledChanges={scheduledChanges}
                open={isOpenChangeSubscription}
                setOpen={setIsOpenChangeSubscription}
                onChange={onSaveSubscription}
                loading={loading}
              />
              <ExtendBillingCycleModal
                subscription={subscription}
                open={isOpenExtendBillingCycle}
                setOpen={setIsOpenExtendBillingCycle}
                onExtend={onExtendBillingCycle}
                loading={loading}
              />
              <RecentActivitiesSlideOver
                open={isOpenRecentActivities}
                setOpen={setIsOpenRecentActivities}
                subscription={subscription}
              />
            </>
          )
        )}
      </div>
    </Card>
  );
};
export default Subscription;
