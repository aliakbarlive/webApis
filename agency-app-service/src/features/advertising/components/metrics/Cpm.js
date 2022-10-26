import { currencyFormatter, numberFormatter } from 'utils/formatters';
import LoadingMetric from './LoadingMetric';
import PercentageChange from './PercentageChange';

const Cpm = ({
  value,
  previousValue,
  cost,
  impressions,
  loading = false,
  showLoading = false,
  className,
  onClick,
}) => {
  return showLoading && loading ? (
    <LoadingMetric />
  ) : (
    <div
      className={`bg-white  py-4 shadow hover:shadow-xl rounded-xl ${className}`}
      onClick={() => onClick && onClick()}
    >
      <div className="text-center pb-5">
        <p className="font-normal text-sm text-gray-500">CPM</p>
        <p className="font-normal text-lg xl:text-2xl 2xl:text-4xl text-gray-600">
          <span className="text-gray-400">$</span>
          {value}
        </p>
      </div>

      <PercentageChange currentValue={value} previousValue={previousValue} />

      <div className="border-solid border-gray-300 border-t pt-2 mt-2 text-gray-500">
        <div className="flex flex-row justify-around py-2">
          <p className="font-normal text-xs">=Ad spend</p>
          <p className="font-normal text-xs">{currencyFormatter(cost)}</p>
        </div>
        <div className="flex flex-row justify-around">
          <p className="font-normal text-xs">=/1k Impressions</p>
          <p className="font-normal text-xs">
            {numberFormatter(Math.round(impressions / 1000))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cpm;
