import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SlideOver from 'components/SlideOver';
import { dateFormatter } from 'utils/formatters';
import { CalendarIcon } from '@heroicons/react/outline';

const RecentActivitiesSlideOver = ({ open, setOpen, invoice }) => {
  const [recentActivities, setRecentActivities] = useState(null);

  useEffect(() => {
    const fetchRecentActivities = async () => {
      await axios
        .get(`/agency/invoice/${invoice.invoice_id}/recentactivities`)
        .then((res) => {
          setRecentActivities(res.data.output);
        });
    };

    if (invoice && open) {
      fetchRecentActivities();
    }
  }, [invoice, open, setRecentActivities]);

  return (
    <SlideOver open={open} setOpen={setOpen} title="History">
      <div className="flow-root sm:w-full mx-auto">
        <ul className="-mb-8">
          {recentActivities &&
            recentActivities.activities.map((recentActivity, index) => {
              return (
                <li key={index}>
                  <div className="relative pb-4">
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
                          <p className="text-xs text-gray-900 whitespace-pre-wrap">
                            {recentActivity.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            by&nbsp;{recentActivity.commented_by}
                          </p>
                        </div>
                        <div className="text-right text-xs whitespace-nowrap text-gray-500">
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
    </SlideOver>
  );
};
export default RecentActivitiesSlideOver;
