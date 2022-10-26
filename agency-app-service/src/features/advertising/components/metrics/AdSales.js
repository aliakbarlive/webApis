import PercentageChange from './PercentageChange';
import LoadingMetric from './LoadingMetric';
import { numberFormatter } from 'utils/formatters';

const AdSales = ({
  value,
  previousValue,
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
        <p className="font-normal text-sm text-gray-500">Ad Sales</p>
        <p className="font-normal text-lg xl:text-2xl 2xl:text-4xl text-gray-600">
          <span className="text-gray-400">$</span>
          {numberFormatter(value)}
        </p>
      </div>

      <PercentageChange currentValue={value} previousValue={previousValue} />

      <div className="border-solid border-gray-300 border-t py-4 mt-2"></div>
    </div>
  );
};

export default AdSales;
