import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { Switch, Route } from 'react-router-dom';
import { useParams } from 'react-router';
import { UserIcon, MailIcon, CheckIcon, XIcon } from '@heroicons/react/solid';

import PageHeader from 'components/PageHeader';
import Details from './Profile/details/Details';
import Subscription from './Profile/Subscription';
import InvoiceHistory from './Profile/InvoiceHistory';
import { fetchMarketplaces } from './clientsSlice';
import Checklists from './Profile/Checklists';
import PageLoader from 'components/PageLoader';
import Badge from 'components/Badge';
import usePermissions from 'hooks/usePermissions';
import ClientUpsells from './Profile/ClientUpsells';

const Profile = ({ match }) => {
  const { userCan } = usePermissions();
  const { url } = match;
  const { id } = useParams();
  const [client, setClient] = useState({});
  const [cycleDate, setCycleDate] = useState({});
  const { marketplaces } = useSelector((state) => state.clients);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const tabs = [
    {
      name: 'Details',
      href: `${url}`,
      exact: true,
      visible: true,
    },
    {
      name: 'Subscription',
      href: `${url}/subscription`,
      visible: userCan('clients.subscription.view'),
    },
    {
      name: 'Upsells',
      href: `${url}/upsells`,
      visible: userCan('clients.upsells.list'),
    },
    {
      name: 'Invoice History',
      href: `${url}/invoicehistory`,
      visible: userCan('clients.subscription.invoices.view'),
    },
    {
      name: 'Onboarding',
      href: `${url}/checklists`,
      visible: userCan('clients.subscription.onboarding'),
    },
  ].filter((tab) => tab.visible);

  const getCycleDate = async () => {
    await axios.get(`/agency/client/${id}/store-cycle-dates`).then((res) => {
      setCycleDate(res.data.data);
    });
  };

  const getClient = async () => {
    setLoading(false);
    await axios.get(`/agency/client/${id}`).then((res) => {
      setClient(res.data.data);
      setLoading(true);
    });
  };

  useEffect(() => {
    async function getData() {
      await getClient();
      await getCycleDate();
    }

    getData();
    if (marketplaces.length <= 0) {
      dispatch(fetchMarketplaces());
    }
  }, [id]);

  const isAPIAuthorized = (service) => {
    const credentials = client.account.credentials;

    if (credentials.length) {
      return credentials.some((credential) => credential.service === service);
    } else {
      return false;
    }
  };

  const left = Object.entries(client).length > 0 && (
    <div className="text-xs text-gray-400 flex items-center">
      <span className="sr-only">Default Contact:</span>
      {client.defaultContact && (
        <div className="flex flex-col">
          <span className="flex">
            <UserIcon className="w-4 h-4 font-medium mr-2 " />
            <span className="text-gray-900">
              {client.defaultContact.firstName}&nbsp;
              {client.defaultContact.lastName}
            </span>
          </span>
          <span className="flex">
            <MailIcon className="w-4 h-4 font-medium mr-2" />
            <span className="text-gray-900">{client.defaultContact.email}</span>
          </span>
        </div>
      )}
      <div className="ml-4">
        <Badge
          classes="mr-2 my-1"
          color={isAPIAuthorized('spApi') ? 'green' : 'red'}
          textSize="sm"
        >
          {isAPIAuthorized('spApi') ? (
            <CheckIcon className="w-4 h-4 font-medium mr-1" />
          ) : (
            <XIcon className="w-4 h-4 font-medium mr-1" />
          )}
          Selling Partner API
        </Badge>

        <Badge
          classes="my-1"
          color={isAPIAuthorized('advApi') ? 'green' : 'red'}
          textSize="sm"
        >
          {isAPIAuthorized('advApi') ? (
            <CheckIcon className="w-4 h-4 font-medium mr-1" />
          ) : (
            <XIcon className="w-4 h-4 font-medium mr-1" />
          )}
          Advertising API
        </Badge>
      </div>
    </div>
  );

  return loading && Object.entries(client).length > 0 ? (
    <>
      <PageHeader title={client.client} left={left} tabs={tabs} />

      <Switch>
        <Route
          path={`/clients/profile/${id}`}
          render={(props) => (
            <Details client={client} setClient={setClient} {...props} />
          )}
          exact
        />

        <Route
          path={`/clients/profile/${id}/subscription`}
          render={(props) => (
            <Subscription
              client={client}
              setClient={setClient}
              cycleDate={cycleDate}
              {...props}
            />
          )}
        />
        <Route
          path={`/clients/profile/${id}/upsells`}
          render={(props) => <ClientUpsells client={client} {...props} />}
        />
        <Route
          path={`/clients/profile/${id}/invoicehistory`}
          render={(props) => <InvoiceHistory client={client} {...props} />}
        />
        <Route
          path={`/clients/profile/${id}/checklists`}
          render={(props) => <Checklists client={client} {...props} />}
        />
      </Switch>
    </>
  ) : (
    <PageLoader />
  );
};

export default Profile;
