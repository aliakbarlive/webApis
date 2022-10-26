import { Route, Switch, Redirect } from 'react-router';

import Breakdown from './trends/Breakdown';
import Snapshot from './trends/Snapshot';

const Trends = ({ account, marketplace, query }) => {
  return (
    <div>
      <Switch>
        <Route
          exact
          path={`/accounts/${account.accountId}/advertising/trends`}
          render={() => (
            <Redirect
              to={`/accounts/${account.accountId}/advertising/trends/snapshot${query}`}
            />
          )}
        />

        <Route
          exact={true}
          path={`/accounts/${account.accountId}/advertising/trends/snapshot`}
          render={() => (
            <Snapshot
              query={query}
              accountId={account.accountId}
              marketplace={marketplace.details.countryCode}
            />
          )}
        />

        <Route
          exact={true}
          path={`/accounts/${account.accountId}/advertising/trends/breakdown`}
          render={() => (
            <Breakdown
              query={query}
              accountId={account.accountId}
              marketplace={marketplace.details.countryCode}
            />
          )}
        />
      </Switch>
    </div>
  );
};

export default Trends;
