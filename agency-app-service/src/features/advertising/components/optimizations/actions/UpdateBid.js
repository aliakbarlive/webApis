import { useTranslation } from 'react-i18next';
import { ArrowNarrowRightIcon } from '@heroicons/react/outline';

const UpdateBid = ({ item, optimization, onChangeData }) => {
  const { t } = useTranslation();

  const onChangeBid = (e) => {
    const { value } = e.target;
    onChangeData({ bid: value !== '' ? parseFloat(value) : '' });
  };

  return (
    <div className="mt-1 flex rounded-md shadow-sm w-64">
      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
        {t('Advertising.Optimization.UpdateBid.CurrentBid')} ${item.bid}
        <ArrowNarrowRightIcon className="ml-4 h-4 w-4" />
      </span>
      <input
        type="number"
        value={optimization.data.bid}
        onChange={onChangeBid}
        className="flex-1 min-w-0 block px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 text-xs border-gray-300"
      />
    </div>
  );
};

export default UpdateBid;
