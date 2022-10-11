import { startCase } from 'lodash';

import AccountCredential from './AccountCredential';
import AccountMarketplace from './AccountMarketplace';

const AccountItem = ({ account }) => {
  return (
    <li
      key={account.accountId}
      className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div className="">
        <p className="text-sm font-medium text-gray-600">{account.name}</p>

        {account.sellingPartnerId && (
          <p className="text-xs mt-1 text-gray-500">
            Selling Partner ID: {account.sellingPartnerId}
          </p>
        )}

        <p className="text-xs mt-1 text-gray-500">
          Plan: {startCase(account.plan.name)}
        </p>

        <div className="flex mt-1">
          {account.marketplaces.map((marketplace) => {
            return (
              <AccountMarketplace
                key={marketplace.marketplaceId}
                accountId={account.accountId}
                marketplace={marketplace}
              />
            );
          })}
        </div>
      </div>

      <div className="">
        <AccountCredential credentials={account.credentials} />
      </div>
    </li>
  );
};

export default AccountItem;
