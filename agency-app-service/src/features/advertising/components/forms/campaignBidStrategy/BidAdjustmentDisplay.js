import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const BidAdjustmentDisplay = ({ currentBid, percentage, type }) => {
  const { t } = useTranslation();
  const [adjustedBid, setAdjustedBid] = useState(currentBid);

  useEffect(() => {
    const newAdjustedBid = (1 + percentage / 100) * currentBid;
    setAdjustedBid(Math.round(newAdjustedBid * 100) / 100);
  }, [currentBid, percentage]);

  return (
    <div className="col-span-8 flex items-center">
      {t('Advertising.CampaignBuilder.BidAdjustmentExample', {
        currentBid,
        adjustedBid,
      })}
      {type === 'autoForSales' && (
        <span className="ml-1">
          {t('Advertising.CampaignBuilder.DynamicBidAdjustmentExample', {
            adjustedBid: adjustedBid * 2,
          })}
        </span>
      )}
    </div>
  );
};

export default BidAdjustmentDisplay;
