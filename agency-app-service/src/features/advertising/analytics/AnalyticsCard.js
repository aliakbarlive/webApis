import { percentageFormatter } from 'utils/formatters';

const AnalyticsCard = ({
  title,
  loading,
  currentValue,
  percentage,
  Icon,
  infoColor,
  containerClass,
  onClick,
}) => {
  return (
    <div
      className={`${containerClass} px-2 py-3 bg-white rounded-lg overflow-hidden sm:p-3 flex flex-col justify-between`}
      onClick={onClick}
    >
      <dt className="text-xs font-medium text-gray-500 text-center mb-2">
        {title}
      </dt>
      <dd className="text-center">
        {loading ? (
          <div className="w-full space-y-2 animate-pulse">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-2 bg-gray-200 rounded col-span-1"></div>
              <div className="h-2 bg-gray-200 rounded col-span-2"></div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="tracking-widest text-md mb-1 font-extrabold text-gray-800">
              {currentValue}
            </div>
            <div className="flex justify-center">
              {Icon && <Icon className={`text-${infoColor}-800 h-4 w-4`} />}
              {percentage ? (
                <div className={`text-xs text-${infoColor}-800`}>
                  {percentageFormatter(percentage)}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </dd>
    </div>
  );
};

export default AnalyticsCard;
