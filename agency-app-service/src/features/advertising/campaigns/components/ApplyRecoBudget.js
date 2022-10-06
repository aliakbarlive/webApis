import axios from 'axios';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setAlert } from 'features/alerts/alertsSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';
import { userCan } from 'utils/permission';

const ApplyRecoBudget = ({
  accountId,
  marketplace,
  campaignType,
  campaigns,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const [applyingRecoBudget, setApplyingRecoBudget] = useState(false);

  const onClick = () => {
    setApplyingRecoBudget(true);
    const payload = {
      accountId,
      marketplace,
      campaignType,
      campaignIds: campaigns.map((campaign) => campaign.advCampaignId),
    };

    axios
      .post('/ppc/campaigns/apply-recommended-budget', payload)
      .then((response) => {
        const { status, message } = response.data;
        dispatch(setAlert(status ? 'success' : 'errror', message));
      })
      .catch((err) => {
        dispatch(setAlert('errror', err.response.data.message));
      })
      .finally(() => {
        onSuccess();
        setApplyingRecoBudget(false);
      });
  };

  return (
    <button
      type="submit"
      disabled={
        !campaigns.length ||
        applyingRecoBudget ||
        !userCan(
          user,
          'ppc.campaign.applyRecommendedBudget.noApproval|ppc.campaign.applyRecommendedBudget.requireApproval'
        )
      }
      onClick={onClick}
      className="col-span-6 lg:col-span-3 xl:col-span-2 justify-center w-full rounded-md border border-gray-300 shadow-sm px-1 lg:px-4 py-2 bg-white text-sm lg:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
    >
      {applyingRecoBudget ? 'Saving Budget' : 'Apply Reco. Budget'}
    </button>
  );
};

export default ApplyRecoBudget;
