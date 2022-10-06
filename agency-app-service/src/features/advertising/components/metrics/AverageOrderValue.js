import PercentageChange from './PercentageChange';
import LoadingMetric from './LoadingMetric';
import { numberFormatter, currencyFormatter } from 'utils/formatters';

const AverageOrderValue = ({
  value,
  previousValue,
  cost,
  orders,
  loading = false,
  showLoading = false,
  className,
  onClick,
}) => {
  return loading && showLoading ? (
    <LoadingMetric />
  ) : (
    <div
      className={`bg-white  py-4 shadow hover:shadow-xl rounded-xl ${className}`}
      onClick={() => onClick && onClick()}
    >
      <div className="text-center pb-5">
        <p className="font-normal text-sm text-gray-500">Average order value</p>
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
          <p className="font-normal text-xs">/Units</p>
          <p className="font-normal text-xs">{numberFormatter(orders)}</p>
        </div>
      </div>
    </div>
  );
};

export default AverageOrderValue;
