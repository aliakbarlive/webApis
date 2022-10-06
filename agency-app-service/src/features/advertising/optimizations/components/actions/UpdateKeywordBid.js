import axios from 'axios';
import { keys } from 'lodash';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import Checkbox from 'components/Forms/Checkbox';

import { selectReport } from '../../optimizationSlice';
import { optimizeBid } from 'features/advertising/utils/optimization';
import { currencyFormatter } from 'utils/formatters';

const UpdateKeywordBid = ({
  accountId,
  marketplace,
  option,
  item,
  onUpdate,
  checked,
}) => {
  const report = useSelector(selectReport);

  const [errors, setErrors] = useState({});
  const [bid, setBid] = useState(
    option.data.bid
      ? option.data.bid
      : optimizeBid(item.values.bid, option.rule.actionData)
  );

  const onChangeChecked = async (e) => {
    const reportId = report.advOptimizationReportId;
    const optionId = option.advOptimizationReportItemOptionId;
    const itemId = option.advOptimizationReportItemId;

    const { checked } = e.target;

    await axios
      .put(
        `/ppc/optimizations/reports/${reportId}/items/${itemId}/options/${optionId}`,
        {
          accountId,
          marketplace,
          selected: checked,
          data: { bid },
        }
      )
      .then(() => {
        setErrors({});
        onUpdate(optionId, checked);
      })
      .catch((error) => setErrors(error.response.data.errors));
  };

  const onChange = (e) => {
    const { value } = e.target;
    setBid(value !== '' ? parseFloat(value) : '');
  };

  return (
    <div className="flex items-center">
      <Checkbox checked={checked} onChange={onChangeChecked} />

      <div className="ml-3">
        <p className="font-medium">{option.rule.name}</p>
        <div className="mt-1 flex rounded-md shadow-sm w-64">
          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs">
            Current Bid {currencyFormatter(item.values.bid)}
            <ArrowNarrowRightIcon className="ml-4 h-4 w-4" />
          </span>
          <input
            type="number"
            value={bid}
            onChange={onChange}
            disabled={checked}
            className="flex-1 min-w-0 block px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 text-xs border-gray-300"
          />
        </div>
        {keys(errors).map((key) =>
          errors[key].map((error) => {
            return (
              <p
                key={error}
                className="mt-2 text-xs text-red-600"
                id="email-error"
              >
                {error}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpdateKeywordBid;
