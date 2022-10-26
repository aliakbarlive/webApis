import { Route, Switch } from 'react-router';

import PageHeader from 'components/PageHeader';
import ChangeRequestTable from './components/ChangeRequestTable';
import ChangeRequestItems from './components/ChangeRequestItems';

const ChangeRequests = () => {
  const tabs = [
    {
      name: 'All',
      href: `/change-requests`,
      exact: true,
      filters: {},
    },
    {
      name: 'Pending',
      href: `/change-requests/pending`,
      exact: true,
      filters: { status: 'pending' },
    },
    {
      name: 'Approved',
      href: `/change-requests/approved`,
      exact: true,
      filters: { status: 'approved' },
    },
    {
      name: 'Rejected',
      href: `/change-requests/rejected`,
      exact: true,
      filters: { status: 'rejected' },
    },
  ];

  return (
    <>
      <Switch>
        <Route
          path={'/change-requests'}
          exact={true}
          render={() => <ChangeRequestTable />}
        />

        <Route
          path={'/change-requests/:changeRequestId'}
          exact={true}
          render={() => <ChangeRequestItems />}
        />
      </Switch>
    </>
  );
};

export default ChangeRequests;
