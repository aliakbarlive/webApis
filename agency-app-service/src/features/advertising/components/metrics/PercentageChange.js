import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/outline';

import { percentageFormatter } from 'utils/formatters';

const PercentageChange = ({ currentValue, previousValue, reverse = false }) => {
  let Icon = ChevronUpIcon;
  let percentage = 0;
  let infoColor = 'green';

  if (currentValue !== previousValue && previousValue) {
    Icon = currentValue > previousValue ? ChevronUpIcon : ChevronDownIcon;

    const lessRef = reverse ? currentValue : previousValue;
    const greaterRef = reverse ? previousValue : currentValue;

    infoColor = lessRef < greaterRef ? 'green' : 'red';
    percentage = (currentValue - previousValue) / Math.abs(previousValue);
  }

  return (
    <div className="flex justify-center items-center">
      <Icon className={`text-${infoColor}-800 h-4 w-4 mr-1`} />
      <div className={`text-xs text-${infoColor}-800`}>
        {percentageFormatter(percentage)}{' '}
        <span className="text-gray-400">vs. average</span>
      </div>
    </div>
  );
};

export default PercentageChange;
