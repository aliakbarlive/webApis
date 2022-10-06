import usePermissions from 'hooks/usePermissions';
import { stringify } from 'qs';
import React from 'react';
import { useSelector } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import Items from './Items';
import Orders from './Orders';
import OrderDetails from './OrderDetails';
import Overview from './Overview';
import BillingPreview from './BillingPreview';

const Upsells = ({ match }) => {
  const { path } = match;
  const { userCan } = usePermissions();
  const {
    upsellsPaginationParams: u,
    ordersPaginationParams: o,
    itemsPaginationParams: i,
  } = useSelector((state) => state.upsells);

  const tabs = [
    {
      name: 'Requests',
      href: `/upsells`,
      exact: true,
      visible: userCan('upsells.list'),
      query: () => {
        return {
          page: u.page ?? 1,
          status: u.status ?? 'pending',
          pageSize: u.pageSize ?? 30,
          sort: u.sort ?? 'createdAt:asc',
          client: u.client ?? '',
        };
      },
    },
    {
      name: 'Orders',
      href: `/upsells/orders`,
      exact: true,
      visible: userCan('upsells.orders.list'),
      query: () => {
        return {
          page: o.page ?? 1,
          status: o.status ?? 'pending',
          pageSize: o.pageSize ?? 30,
          sort: o.sort ?? 'createdAt:asc',
          client: o.client ?? '',
        };
      },
    },
    {
      name: 'Items',
      href: `/upsells/items`,
      exact: true,
      visible: userCan('upsells.items.list'),
      query: () => {
        return {
          page: 1,
          sizePerPage: 50,
          status: 'ONETIME',
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
          render={(props) => <Overview tabs={tabs} {...props} />}
          exact
        />
        <Route
          path={`${path}/orders`}
          render={(props) => <Orders tabs={tabs} {...props} />}
          exact
        />
        <Route
          path={`${path}/orders/details/:id`}
          render={(props) => <OrderDetails tabs={tabs} {...props} />}
          exact
        />
        <Route
          path={`${path}/items`}
          render={(props) => <Items tabs={tabs} {...props} />}
          exact
        />
      </Switch>
    </>
  );
};

export default withRouter(Upsells);
