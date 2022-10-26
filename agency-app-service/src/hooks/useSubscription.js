import {
  CANCELLED,
  DUNNING,
  EXPIRED,
  FUTURE,
  LIVE,
  NON_RENEWING,
  PAUSED,
  UNPAID,
} from 'utils/subscriptions';

const useSubscription = (subscription) => {
  const live = () => {
    return subscription.status === LIVE;
  };

  const future = () => {
    return subscription.status === FUTURE;
  };

  const unpaid = () => {
    return subscription.status === UNPAID;
  };

  const dunning = () => {
    return subscription.status === DUNNING;
  };

  const nonRenewing = () => {
    return subscription.status === NON_RENEWING;
  };

  const expired = () => {
    return subscription.status === EXPIRED;
  };

  const cancelled = () => {
    return subscription.status === CANCELLED;
  };

  const paused = () => {
    return subscription.status === PAUSED;
  };

  const hasAny = (statuses) => {
    return statuses.some((s) => s === subscription.status);
  };

  return {
    live,
    future,
    unpaid,
    dunning,
    nonRenewing,
    expired,
    cancelled,
    paused,
    hasAny,
  };
};

export default useSubscription;
