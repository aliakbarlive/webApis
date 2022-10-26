import { PencilIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { Popover } from '@headlessui/react';

import { currencyFormatter } from 'utils/formatters';
import { useDispatch, useSelector } from 'react-redux';
import { updateCampaignAsync } from 'features/advertising/advertisingSlice';
import { selectAuthenticatedUser } from 'features/auth/authSlice';

import { userCan } from 'utils/permission';

const CampaignBudgetEditor = ({
  accountId,
  marketplace,
  campaignId,
  currentBudget,
  editable = false,
  onSuccess,
  recommendedBudget,
}) => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthenticatedUser);
  const [dailyBudget, setDailyBudget] = useState(currentBudget);
  const [saving, setSaving] = useState(false);

  const onUpdateBudget = async () => {
    setSaving(true);

    await dispatch(
      updateCampaignAsync(campaignId, {
        accountId,
        marketplace,
        data: { dailyBudget },
      })
    );

    setSaving(false);

    onSuccess();
  };

  return (
    <div className="flex justify-between">
      <div className="">
        <span>{currencyFormatter(currentBudget)}</span>
        {recommendedBudget && (
          <span className="text-xs mx-2 text-red-500">
            ({currencyFormatter(recommendedBudget.suggestedBudget)})
          </span>
        )}
      </div>
      {editable &&
        userCan(
          user,
          'ppc.campaign.updateDailyBudget.noApproval|ppc.campaign.updateDailyBudget.requireApproval'
        ) && (
          <Popover className="relative">
            <Popover.Button>
              <PencilIcon className="h-5 w-5 cursor-pointer" />
            </Popover.Button>

            <Popover.Panel className="absolute z-50 w-60">
              {({ close }) => (
                <div className="shadow-md border p-2 bg-gray-50 rounded ">
                  <div className="flex">
                    <input
                      type="number"
                      className="px-2 py-2 border focus:outline-none focus:ring-0 focus:border-gray-300 block w-full text-xs border-gray-300 rounded-md"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(e.target.value)}
                      disabled={saving}
                    />

                    <Popover.Button
                      as="button"
                      className="ml-2 px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded rounded-r-none text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      disabled={saving}
                    >
                      Cancel
                    </Popover.Button>

                    <button
                      className="px-2.5 py-1.5 border-transparent rounded rounded-l-none shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={saving}
                      onClick={async () => {
                        await onUpdateBudget();
                        close();
                      }}
                    >
                      {saving ? 'Saving' : 'Save'}
                    </button>
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Popover>
        )}
    </div>
  );
};

export default CampaignBudgetEditor;
