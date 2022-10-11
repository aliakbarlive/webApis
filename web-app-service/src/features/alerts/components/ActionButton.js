import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { markAlertAsync } from 'features/alerts/alertsSlice';
import {
  selectCurrentAccount,
  selectCurrentMarketplace,
} from 'features/accounts/accountsSlice';

const ActionButton = ({ alertId, resolvedAt, onChange }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const account = useSelector(selectCurrentAccount);
  const marketplace = useSelector(selectCurrentMarketplace);

  useEffect(() => {
    setResolved(!!resolvedAt);
  }, [alertId, resolvedAt]);

  const onClick = async () => {
    setLoading(true);
    try {
      const action = resolved ? 'unresolve' : 'resolve';

      await dispatch(
        markAlertAsync(alertId, action, {
          accountId: account.accountId,
          marketplace: marketplace.details.countryCode,
        })
      );
      setResolved(!resolved);
      onChange();
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      className="items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
      disabled={loading}
      onClick={onClick}
    >
      {resolved ? 'Unresolve' : 'Resolve'}
    </button>
  );
};

export default ActionButton;
