import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FingerPrintIcon, XIcon } from '@heroicons/react/solid';
import classNames from '../../../../utils/classNames';
import Toggle from 'components/Forms/Toggle';
import Label from 'components/Forms/Label';
import Select from 'components/Forms/Select';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAlert } from 'features/alerts/alertsSlice';
import usePermissions from 'hooks/usePermissions';

const IntegrationList = ({ account }) => {
  const dispatch = useDispatch();
  const { userCan, isAgencySuperUser } = usePermissions();
  const { credentials, accountId, isOnboarding, name, planId, marketplaces } =
    account;
  const defaultMarketplace = marketplaces.filter(
    (m) => m.isDefault === true
  )[0];
  const [onboarding, setOnboarding] = useState(isOnboarding);
  const [marketplace, setMarketplace] = useState(
    defaultMarketplace ? defaultMarketplace.marketplaceId : ''
  );

  const isAPIAuthorized = (service) => {
    if (credentials.length) {
      return credentials.some((credential) => credential.service === service);
    } else {
      return false;
    }
  };

  const onAuthorize = async (service, oAuthUrl) => {
    if (service === 'Advertising API') {
      Cookies.set('accountId', accountId);
    }

    window.location.href = oAuthUrl;
  };

  const integrations = [
    {
      service: 'Selling Partner API',
      authenticated: isAPIAuthorized('spApi'),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
      oAuthUrl: `https://sellercentral.amazon.com/apps/authorize/consent?application_id=${process.env.REACT_APP_SP_API_CLIENT_ID}&state=${accountId}&redirect_uri=${process.env.REACT_APP_SP_API_REDIRECT_URL}&version=beta`,
    },
    {
      service: 'Advertising API',
      authenticated: isAPIAuthorized('advApi'),
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/d/de/Amazon_icon.png',
      oAuthUrl: `https://www.amazon.com/ap/oa?client_id=${process.env.REACT_APP_ADV_API_CLIENT_ID}&scope=cpc_advertising:campaign_management&response_type=code&redirect_uri=${process.env.REACT_APP_ADV_API_REDIRECT_URL}`,
    },
  ];

  const onIsOnboarding = async (value) => {
    try {
      setOnboarding(value);
      await axios.put(`/accounts/${accountId}`, {
        name,
        planId,
        isOnboarding: value,
      });
      dispatch(setAlert('success', 'Account updated'));
    } catch (error) {
      dispatch(setAlert('error', 'Cannot update account'));
      console.log(error);
    }
  };

  const onChangeMarketplace = async (value) => {
    try {
      setMarketplace(value);
      await axios.put(`/accounts/${accountId}/marketplaces/${value}`, {
        isDefault: true,
      });
      dispatch(
        setAlert(
          'success',
          `Default account marketplace ${
            value === '-' ? 'unassigned' : 'updated'
          }`
        )
      );
    } catch (error) {
      dispatch(setAlert('error', 'Cannot update account marketplace'));
      console.log(error);
    }
  };

  return (
    <>
      <h3 className="mb-4 text-xl font-bold">Integrations</h3>

      <ul role="list" className="grid grid-cols-1 gap-6">
        {integrations.map((integration) => (
          <li
            key={integration.service}
            className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
          >
            <div className="w-full flex items-center justify-between p-6 space-x-6">
              <img
                className="w-10 h-10 shadow rounded-full flex-shrink-0"
                src={integration.imageUrl}
                alt=""
              />
              <div className="flex-1 truncate">
                <h3 className="text-gray-900 text-sm font-semibold truncate">
                  {integration.service}
                </h3>
                <span
                  className={classNames(
                    integration.authenticated
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                    'flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full'
                  )}
                >
                  {integration.authenticated ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="w-0 flex-1 flex">
                  {!integration.authenticated ? (
                    <button
                      className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                      onClick={() =>
                        onAuthorize(integration.service, integration.oAuthUrl)
                      }
                    >
                      <FingerPrintIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="ml-3">Authenticate</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isAgencySuperUser() && (
        <>
          <h3 className="mt-6 mb-4 text-xl font-bold">Account</h3>
          <ul role="list" className="grid grid-cols-1 gap-6">
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <div className="w-full p-6 text-sm">
                <div className="flex justify-between">
                  <Label>Is Onboarding</Label>
                  <span className="flex items-center">
                    <Toggle
                      checked={onboarding}
                      onChange={() => onIsOnboarding(!onboarding)}
                    />
                  </span>
                </div>
                {defaultMarketplace && (
                  <div className="flex mt-2  items-center justify-between">
                    <Label>Default Marketplace</Label>
                    <span>
                      <Select
                        id="defmarketplace"
                        value={marketplace}
                        onChange={(e) => {
                          onChangeMarketplace(e.target.value);
                        }}
                      >
                        <option value="-">-</option>
                        {marketplaces.map((m) => {
                          return (
                            <option
                              value={m.marketplaceId}
                              key={m.marketplaceId}
                            >
                              {m.details.countryCode}
                            </option>
                          );
                        })}
                      </Select>
                    </span>
                  </div>
                )}
              </div>
            </li>
          </ul>
        </>
      )}
    </>
  );
};

export default IntegrationList;
