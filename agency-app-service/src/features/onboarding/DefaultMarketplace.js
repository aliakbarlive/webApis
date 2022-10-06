import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { updateAccountMarketplaceAsync } from 'features/accounts/accountsSlice';

const DefaultMarketplace = ({ account, history, marketplaces }) => {
  const dispatch = useDispatch();
  const [marketplaceId, setMarketplaceId] = useState('');

  const onNextClick = () => {
    if (marketplaceId) {
      dispatch(
        updateAccountMarketplaceAsync(account.accountId, marketplaceId, {
          isDefault: true,
        })
      );
    }
  };

  return (
    <>
      <div>
        <h2 className="text-center text-2xl font-extrabold text-gray-900">
          Select your primary Amazon Marketplace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          This marketplace will used as the default for the{' '}
          {account && account.name} account.
        </p>
      </div>

      <div className="mt-8">
        <select
          name="marketplaces"
          id="marketplaces"
          className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md"
          onChange={(e) => setMarketplaceId(e.target.value)}
        >
          <option value="">Select your default marketplace.</option>
          {marketplaces.map((marketplace) => {
            return (
              <option
                value={marketplace.marketplaceId}
                key={marketplace.marketplaceId}
              >
                {marketplace.details.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="mt-6 flex justify-end">
        {/* <button
          type="button"
          className="mr-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Back
        </button> */}
        <button
          type="button"
          className="disabled:opacity-50 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 "
          onClick={onNextClick}
          disabled={marketplaceId ? false : true}
        >
          Save
        </button>
      </div>
    </>
    // <div className="mt-16 px-4">
    //   <p className="text-center text-sm font-medium text-gray-700">
    //     Select your Amazon Seller Central primary marketplace.
    //   </p>

    //   <div className="mt-6">
    //     <div className="my-3">
    //
    //     </div>

    //     <button
    //       className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    //       onClick={onClick}
    //       disabled={isAuthorizing}
    //     >
    //       Finish
    //     </button>
    //   </div>
    // </div>
  );
};

export default withRouter(DefaultMarketplace);
