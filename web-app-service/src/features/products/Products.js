import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch, Route } from 'react-router-dom';
import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import Overview from './Overview';
import Profit from './Profit';
import KeywordRanking from './keywords/KeywordRanking';
import Inventory from './inventory/Inventory';

const Products = ({ match }) => {
  const { t } = useTranslation();
  const { path } = match;

  const tabs = [
    {
      name: 'Overview',
      href: `${path}`,
      exact: true,
    },
    { name: 'Profit', href: `${path}/profit` },
    {
      name: 'Keyword Ranking',
      href: `${path}/keyword-ranking`,
    },
    { name: 'Inventory', href: `${path}/inventory` },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Product.ProductManager")} tabs={tabs} />

      <Switch>
        {/* Overview Tab */}
        <Route path={`${path}`} exact component={Overview} />

        {/* Profit Tab */}
        <Route path={`${path}/profit`} component={Profit} />

        {/* Keyword Ranking Tab */}
        <Route path={`${path}/keyword-ranking`} component={KeywordRanking} />

        {/* Inventory Tab */}
        <Route path={`${path}/inventory`} component={Inventory} />
      </Switch>
    </DashboardLayout>
  );
};

export default Products;
