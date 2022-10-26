import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from 'components/Loading';
import { useTranslation } from 'react-i18next';

const CycleDate = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
    axios.get(`/agency/client/store-cycle-dates`).then(() => {
      setLoading(true);
    });
  }, []);

  return (
    <>
      {loading ? (
        <p>{t('Profile.Subscription.SubscriptionCycleDateStored')}</p>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default CycleDate;
