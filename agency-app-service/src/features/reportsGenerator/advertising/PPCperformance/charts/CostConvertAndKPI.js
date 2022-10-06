import Cpm from 'features/advertising/components/metrics/Cpm';
import ImpressionsPerClick from 'features/advertising/components/metrics/ImpressionsPerClick';
import ClicksPerConversion from 'features/advertising/components/metrics/ClicksPerConversion';
import ConversionsPerUnit from 'features/advertising/components/metrics/ConversionsPerUnit';
import Impressions from 'features/advertising/components/metrics/Impressions';
import CostPerConversion from 'features/advertising/components/metrics/CostPerConversion';
import ACoS from 'features/advertising/components/metrics/ACoS';
import ClickThroughRate from 'features/advertising/components/metrics/ClickThroughRate';
import ConversionRate from 'features/advertising/components/metrics/ConversionRate';
import CostPerClick from 'features/advertising/components/metrics/CostPerClick';
import RoAS from 'features/advertising/components/metrics/RoAS';
import AverageOrderValue from 'features/advertising/components/metrics/AverageOrderValue';

function CostConvertAndKPI({ data }) {
  return (
    <div>
      <div className="font-bold text-lg text-gray-700 text-center mt-12">
        Cost per Converted Unit Decomposition
      </div>

      <div className="grid grid-cols-6 gap-4 mt-8">
        <Cpm
          value={data.current.data.cpm}
          previousValue={data.previous.data.cpm}
          cost={data.current.data.cost}
          impressions={data.current.data.impressions}
        />

        <ImpressionsPerClick
          value={data.current.data.impressionsPerClick}
          previousValue={data.previous.data.impressionsPerClick}
          clicks={data.current.data.clicks}
          impressions={data.current.data.impressions}
        />

        <ClicksPerConversion
          value={data.current.data.clicksPerOrder}
          previousValue={data.previous.data.clicksPerOrder}
          clicks={data.current.data.clicks}
          orders={data.current.data.orders}
        />

        <ConversionsPerUnit
          value={data.current.data.ordersPerUnit}
          previousValue={data.previous.data.ordersPerUnit}
          orders={data.current.data.orders}
          units={data.current.data.unitsSold}
        />

        <Impressions
          value={data.current.data.impressions}
          previousValue={data.previous.data.impressions}
        />

        <CostPerConversion
          value={data.current.data.cpcon}
          previousValue={data.previous.data.cpcon}
          cost={data.current.data.cost}
          orders={data.current.data.orders}
        />
      </div>

      <div className="font-bold text-lg text-gray-700 text-center mt-12">
        Traditional KPI’s
      </div>
      <div className="grid grid-cols-6 gap-4 mt-8">
        <ACoS
          value={data.current.data.acos}
          previousValue={data.previous.data.acos}
          cost={data.current.data.cost}
          sales={data.current.data.sales}
        />
        <ClickThroughRate
          value={data.current.data.ctr}
          previousValue={data.previous.data.ctr}
          clicks={data.current.data.clicks}
          impressions={data.current.data.impressions}
        />

        <ConversionRate
          value={data.current.data.cr}
          previousValue={data.previous.data.cr}
          orders={data.current.data.orders}
          clicks={data.current.data.clicks}
        />

        <CostPerClick
          value={data.current.data.cpc}
          previousValue={data.previous.data.cpc}
          cost={data.current.data.cost}
          clicks={data.current.data.clicks}
        />

        <RoAS
          value={data.current.data.roas}
          previousValue={data.previous.data.roas}
          sales={data.current.data.sales}
          cost={data.current.data.cost}
        />

        <AverageOrderValue
          value={data.current.data.aov}
          previousValue={data.previous.data.aov}
          cost={data.current.data.cost}
          orders={data.current.data.orders}
        />
      </div>
    </div>
  );
}

export default CostConvertAndKPI;
