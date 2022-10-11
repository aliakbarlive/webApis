import React from 'react';
import { useSelector } from 'react-redux';

import { selectAccounts } from 'features/accounts/accountsSlice';

import { Card } from 'components';
import AccountItem from './AccountItem';

const Accounts = () => {
  const accounts = useSelector(selectAccounts);

  return (
    <Card>
      <h2 className="text-lg leading-6 font-medium text-gray-700 mb-3">
        Accounts
      </h2>
      {accounts.length ? (
        <div>
          <ul className="divide-y divide-gray-200">
            {accounts.map((account) => (
              <AccountItem key={account.accountId} account={account} />
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-5 text-sm text-gray-500 text-center">
          You haven’t added any accounts yet.
        </p>
      )}
    </Card>
  );
};

export default Accounts;
