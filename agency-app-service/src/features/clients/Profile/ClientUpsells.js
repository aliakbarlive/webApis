import Orders from 'features/upsells/Orders';
import OrderDetails from 'features/upsells/OrderDetails';
import Overview from 'features/upsells/Overview';
import usePermissions from 'hooks/usePermissions';
import { stringify } from 'qs';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

const ClientUpsells = ({ client, match }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const { upsellsPaginationParams: u, ordersPaginationParams: o } = useSelector(
    (state) => state.upsells
  );

  const tabs = [
    {
      name: 'Requests',
      href: `${path}`,
      exact: true,
      visible: userCan('clients.upsells.list'),
      query: () => {
        return {
          page: u.page ?? 1,
          status: u.status ?? 'pending',
          pageSize: u.pageSize ?? 30,
          sort: u.sort ?? 'createdAt:asc',
          client: client.agencyClientId,
        };
      },
    },
    {
      name: 'Orders',
      href: `${path}/orders`,
      exact: true,
      visible: userCan('clients.upsells.orders.list'),
      query: () => {
        return {
          page: o.page ?? 1,
          status: o.status ?? 'pending',
          pageSize: o.pageSize ?? 30,
          sort: o.sort ?? 'createdAt:asc',
          client: client.agencyClientId,
        };
      },
    },
  ]
    .filter((tab) => tab.visible)
    .map((item) => {
      let itemQuery = item.query ? item.query() : {};
      item.href = `${item.href}?${stringify(itemQuery)}`;

      return item;
    });

  return (
    <>
      <Switch>
        <Route
          path={`${path}`}
          render={(props) => (
            <Overview tabs={tabs} client={client} {...props} />
          )}
          exact
        />
        <Route
          path={`${path}/orders`}
          render={(props) => <Orders tabs={tabs} client={client} {...props} />}
          exact
        />
        <Route
          path={`${path}/orders/details/:id`}
          render={(props) => (
            <OrderDetails tabs={tabs} client={client} {...props} />
          )}
          exact
        />
      </Switch>
    </>
  );
};
export default ClientUpsells;
