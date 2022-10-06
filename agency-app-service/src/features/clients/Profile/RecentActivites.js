import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';
import { dateFormatter } from 'utils/formatters';
import { fetchRecentActivites } from '../subscriptionsSlice';
import { Card } from 'components';
import { CalendarIcon } from '@heroicons/react/outline';

const RecentActivities = ({ client }) => {
  const { subscriptionId } = client.account.subscription;
  const { recentActivities } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRecentActivites(subscriptionId)).then(() => {
      setLoading(false);
    });
  }, [subscriptionId, dispatch]);

  return (
    <Card>
      {loading ? (
        <Loading />
      ) : recentActivities ? (
        <div className="flow-root sm:w-1/2 mx-auto">
          <ul className="-mb-8">
            {recentActivities.activities &&
              recentActivities.activities.map((recentActivity, index) => {
                return (
                  <li key={index}>
                    <div className="relative pb-8">
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      ></span>
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-red-400 flex items-center justify-center ring-8 ring-white">
                            <CalendarIcon className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {recentActivity.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              by&nbsp;{recentActivity.commented_by}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time>
                              {dateFormatter(recentActivity.activity_time)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ) : (
        ''
      )}
    </Card>
  );
};
export default RecentActivities;
