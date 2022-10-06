import CampaignTypePerformance from './CampaignTypePerformance';

const CampaignTypePerformanceSummary = ({
  accountId,
  marketplace,
  startDate,
  endDate,
}) => {
  const attributes = ['sales', 'acos', 'cost'];
  const campaignTypes = [
    { title: 'Sponsored Products', key: 'sponsoredProducts' },
    { title: 'Sponsored Brands', key: 'sponsoredBrands' },
    { title: 'Sponsored Display', key: 'sponsoredDisplay' },
  ];

  return (
    <div
      id="campaign-type-performance-summary"
      className="grid lg:grid-cols-3 gap-4 mt-4"
    >
      {campaignTypes.map((campaignType) => (
        <CampaignTypePerformance
          key={campaignType.key}
          accountId={accountId}
          marketplace={marketplace}
          startDate={startDate}
          endDate={endDate}
          attributes={attributes}
          title={campaignType.title}
          campaignType={campaignType.key}
        />
      ))}
    </div>
  );
};

export default CampaignTypePerformanceSummary;
