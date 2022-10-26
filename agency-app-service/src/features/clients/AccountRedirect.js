import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import PageHeader from 'components/PageHeader';
import PageLoader from 'components/PageLoader';
import Loading from 'components/Loading';

const AccountRedirect = ({ match, history }) => {
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      setLoading(false);
      await axios.get(`/agency/client/account/${id}`).then((res) => {
        setClient(res.data.data);
        setTimeout(() => {
          history.replace(`/clients/profile/${res.data.data.agencyClientId}`);
        }, 400);
      });
    }

    getData();
  }, [id]);

  return loading && Object.entries(client).length > 0 ? (
    <>
      <PageHeader title={client.client} />
      <Loading />
    </>
  ) : (
    <PageLoader />
  );
};

export default AccountRedirect;
