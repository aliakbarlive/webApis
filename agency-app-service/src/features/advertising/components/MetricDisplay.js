import {
  ArrowNarrowUpIcon,
  ArrowNarrowDownIcon,
} from '@heroicons/react/outline';

const MetricDisplay = ({ attribute, currentData, previousData, formatter }) => {
  const Icon =
    currentData >= previousData ? ArrowNarrowUpIcon : ArrowNarrowDownIcon;

  const arrowColor = () => {
    if (attribute === 'acos' || attribute === 'cpc') {
      return currentData <= previousData ? 'green' : 'red';
    }

    return currentData >= previousData ? 'green' : 'red';
  };

  return (
    <div className="flex justify-end items-center">
      <span title={`Previous: ${formatter(previousData)}`}>
        {formatter(currentData)}
      </span>

      {currentData !== previousData && (
        <Icon className={`h-4 w-3 text-${arrowColor()}-500`} />
      )}
    </div>
  );
};

export default MetricDisplay;
