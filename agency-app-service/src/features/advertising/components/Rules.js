import { Route, Switch } from 'react-router';

import ListRule from 'features/advertising/components/rules/ListRule';
import CreateRule from 'features/advertising/components/rules/CreateRule';
import EditRule from 'features/advertising/components/rules/EditRule';

const Rules = ({ accountId, marketplace, campaignType }) => {
  return (
    <Switch>
      <Route
        exact={true}
        path={`/accounts/${accountId}/advertising/products/rules`}
        render={() => (
          <ListRule
            accountId={accountId}
            campaignType={campaignType}
            marketplace={marketplace}
          />
        )}
      />

      <Route
        exact={true}
        path={`/accounts/${accountId}/advertising/products/rules/create`}
        render={() => (
          <CreateRule
            accountId={accountId}
            marketplace={marketplace}
            campaignType={campaignType}
          />
        )}
      />

      <Route
        exact={true}
        path={`/accounts/${accountId}/advertising/products/rules/:ruleId/edit`}
        render={() => (
          <EditRule
            accountId={accountId}
            marketplace={marketplace}
            campaignType={campaignType}
          />
        )}
      />
    </Switch>
  );
};

export default Rules;
