import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckIcon, XIcon, ClockIcon } from '@heroicons/react/outline';

import {
  getPrevOptimizationsAsync,
  selectPrevOptimizations,
} from 'features/advertising/advertisingSlice';

import SlideOver from 'components/SlideOver';
import ActionDisplay from 'features/advertising/components/optimizations/actions/ActionDisplay';

const PreviousOptimization = ({
  accountId,
  marketplace,
  campaignType,
  open,
  setOpen,
  recordType,
  optimizableId,
}) => {
  const dispatch = useDispatch();
  const prevOptimizations = useSelector(selectPrevOptimizations);

  useEffect(() => {
    if (optimizableId && open) {
      dispatch(
        getPrevOptimizationsAsync({
          accountId,
          marketplace,
          campaignType,
          optimizableId: optimizableId.split('-')[1],
          optimizableType: recordType.slice(0, -1),
          sort: 'createdAt',
        })
      );
    }
  }, [
    dispatch,
    open,
    accountId,
    marketplace,
    campaignType,
    recordType,
    optimizableId,
  ]);
  return (
    <SlideOver open={open} setOpen={setOpen} title="Previous Optimizations">
      <div className="flow-root">
        {prevOptimizations.rows.length === 0 && (
          <p className="text-gray-700">You haven't add any optimizations yet</p>
        )}
        <ul className="-mb-8">
          {prevOptimizations.rows.map((po, poIdx) => (
            <li key={po.id}>
              <div className="relative pb-8">
                {poIdx !== prevOptimizations.rows.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div className="flex items-center">
                    {po.status === 'SUCCESS' && (
                      <span className="bg-green-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                        <CheckIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                    {po.status === 'ERROR' && (
                      <span className="bg-red-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                        <XIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                    {po.status === 'Pending' && (
                      <span className="bg-yellow-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                        <ClockIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 pt-1.5">
                    <ActionDisplay
                      action={po.rule.action}
                      options={po.rule.actionData}
                      className="text-xs font-medium text-gray-700"
                    />
                    <p className="text-gray-700 text-xs">{po.rule.name}</p>
                    <p className="text-gray-500 text-xs">
                      {po.batch.user.firstName} {po.batch.user.lastName}
                      {', '}
                      {moment(po.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SlideOver>
  );
};
export default PreviousOptimization;
