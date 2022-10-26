import { startCase } from 'lodash';
import { useTranslation } from 'react-i18next';

import BidAdjustmentDisplay from './campaignBidStrategy/BidAdjustmentDisplay';

const CampaignBidStrategyForm = ({ form, updateForm }) => {
  const { t } = useTranslation();

  const biddingStrategies = [
    {
      value: 'legacyForSales',
      display: t('Advertising.CampaignBuilder.BiddingStrategy.Legacy.Display'),
      description: t(
        'Advertising.CampaignBuilder.BiddingStrategy.Legacy.Description'
      ),
    },
    {
      value: 'autoForSales',
      display: t('Advertising.CampaignBuilder.BiddingStrategy.Auto.Display'),
      description: t(
        'Advertising.CampaignBuilder.BiddingStrategy.Auto.Description'
      ),
    },
    {
      value: 'manual',
      display: t('Advertising.CampaignBuilder.BiddingStrategy.Manual.Display'),
      description: t(
        'Advertising.CampaignBuilder.BiddingStrategy.Manual.Description'
      ),
    },
  ];

  const onChange = (e) => {
    const { name, value } = e.target;
    const key = name.replace('campaign.bidding.', '');
    const currentBidding = form.bidding;

    updateForm({
      ...form,
      bidding: { ...currentBidding, [key]: value },
    });
  };

  const onChangeAdjustment = (e) => {
    const currentBidding = form.bidding;
    const { id, value } = e.target;
    let newBiddingAdjustments = form.bidding.adjustments.map(
      (adjustment, idx) => {
        let newAdjustment = { ...adjustment };
        if (idx === parseInt(id)) {
          newAdjustment.percentage = value ? parseInt(value) : 0;
        }
        return newAdjustment;
      }
    );

    updateForm({
      ...form,
      bidding: { ...currentBidding, adjustments: newBiddingAdjustments },
    });
  };

  return (
    <div className="border rounded-md mt-4 text-gray-700 text-xs">
      <div className="border-b p-4">
        <h3 className="text-sm font-medium">
          {t('Advertising.CampaignBuilder.BiddingStrategy')}
        </h3>
      </div>

      <div className="p-4">
        <fieldset>
          <div className="mt-2 space-y-4">
            {biddingStrategies.map((biddingStrategy) => (
              <div key={biddingStrategy.value} className="flex items-center">
                <input
                  value={biddingStrategy.value}
                  name="campaign.bidding.strategy"
                  type="radio"
                  className="focus:outline-none focus:ring-0 h-4 w-4 text-red-600 border-gray-300"
                  checked={form.bidding.strategy === biddingStrategy.value}
                  onChange={onChange}
                />
                <div className="ml-3">
                  <label className="">{biddingStrategy.display}</label>
                  <p className="text-gray-500">{biddingStrategy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="ml-7 mt-4">
          <p>{t('Advertising.CampaignBuilder.BiddingStrategy.Adjustment')}</p>

          {form.bidding.adjustments.map((adjustment, idx) => {
            return (
              <div
                key={adjustment.predicate}
                className="grid grid-cols-12 gap-4 mt-2"
              >
                <p className="flex col-span-2 items-center">
                  {startCase(adjustment.predicate)}
                </p>
                <div className="flex rounded-md shadow-sm col-span-2 w-full">
                  <input
                    id={idx}
                    type="number"
                    min="0"
                    max="900"
                    value={adjustment.percentage}
                    onChange={onChangeAdjustment}
                    className="flex-1 min-w-0 px-3 py-2 rounded-none rounded-l-md shadow-sm block w-full text-xs border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500">
                    %
                  </span>
                </div>
                <BidAdjustmentDisplay
                  currentBid={0.78}
                  type={form.bidding.strategy}
                  percentage={adjustment.percentage}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CampaignBidStrategyForm;
