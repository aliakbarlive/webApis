import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import { fetchRecentActivites } from 'features/admin/agencyClients/subscriptionsSlice';
import Loading from 'components/Loading';
import { dateFormatter } from 'utils/formatters';

const RecentActivities = ({ subscriptionId }) => {
  const { recentActivities } = useSelector((state) => state.subscriptions);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchRecentActivites(subscriptionId)).then(() => {
      setLoading(false);
    });
  }, [subscriptionId]);

  return (
    <div>
      <Card>
        <CardBody className={'text-dark p-auto p-lg-5'}>
          {loading ? (
            <Loading />
          ) : recentActivities ? (
            <div className="px-2 px-lg-6">
              {recentActivities.activities &&
                recentActivities.activities.map((recentActivity, index) => {
                  return (
                    <div className="activity" key={index}>
                      <sup>{dateFormatter(recentActivity.activity_time)}</sup>
                      <p>{recentActivity.description}</p>
                      <span className="text-muted">
                        by&nbsp;{recentActivity.commented_by}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            ''
          )}
        </CardBody>
      </Card>
    </div>
  );
};
export default RecentActivities;
