import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createReportAsync, getReportItemsAsync } from '../optimizationSlice';

import { selectCurrentDateRange } from 'features/datePicker/datePickerSlice';

import Button from 'components/Button';
import { SEARCH_TERMS } from 'features/advertising/utils/constants';
import {
  getAdGroupsAsync,
  getCampaignsAsync,
  getPortfoliosAsync,
} from 'features/advertising/advertisingSlice';

const GenerateReportButton = ({
  accountId,
  marketplace,
  campaignType,
  recordType,
  ruleIds,
}) => {
  const dispatch = useDispatch();
  const selectedDates = useSelector(selectCurrentDateRange);

  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);

    try {
      const report = await dispatch(
        createReportAsync({
          accountId,
          marketplace,
          campaignType,
          recordType,
          ruleIds,
          ...selectedDates,
        })
      );

      await dispatch(
        getReportItemsAsync(report.advOptimizationReportId, {
          accountId,
          marketplace,
        })
      );

      setLoading(false);

      if (recordType === SEARCH_TERMS) {
        await dispatch(
          getPortfoliosAsync({
            pageSize: 1000,
            accountId,
            marketplace,
          })
        );

        const campaigns = await dispatch(
          getCampaignsAsync({
            pageSize: 1000,
            accountId,
            marketplace,
            campaignType,
            ...selectedDates,
            targetingType: 'manual',
            state: 'enabled',
            attributes: 'advCampaignId,name',
          })
        );

        if (campaigns.rows.length) {
          await dispatch(
            getAdGroupsAsync({
              pageSize: 1000,
              accountId,
              marketplace,
              campaignType,
              ...selectedDates,
              advCampaignId: campaigns.rows
                .map((c) => c.advCampaignId)
                .join(','),
              attributes: 'name,advAdGroupId,advCampaignId,defaultBid',
            })
          );
        }
      }
    } catch (error) {
      console.log('here');
      setLoading(false);
    }
  };

  return (
    <Button
      classes="flex justify-center"
      showLoading
      loading={loading}
      onClick={onClick}
    >
      Generate Report
    </Button>
  );
};

export default GenerateReportButton;
