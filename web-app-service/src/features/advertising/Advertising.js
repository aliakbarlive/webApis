import React from 'react';
import { useTranslation } from "react-i18next";
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectCurrentMarketplace } from 'features/accounts/accountsSlice';

import DashboardLayout from 'layouts/dashboard/DashboardLayout';
import PageHeader from 'components/PageHeader';
import NoProfileFound from './NoProfileFound';
import SponsoredDisplay from './SponsoredDisplay';
import SponsoredBrands from './SponsoredBrands';
import SponsoredProducts from './SponsoredProducts';

import CampaignDetail from './components/CampaignDetail';
import AdGroupDetail from './components/AdGroupDetail';
import Overview from './Overview';

const Advertising = () => {
  const { t } = useTranslation();
  const marketplace = useSelector(selectCurrentMarketplace);

  const tabs = [
    {
      name: 'Overview',
      href: '/advertising',
      exact: true,
      component: Overview,
    },
    {
      name: 'Sponsored Products',
      href: '/advertising/products',
      component: SponsoredProducts,
    },
    {
      name: 'Sponsored Brands',
      href: '/advertising/brands',
      component: SponsoredBrands,
    },
    {
      name: 'Sponsored Display',
      href: '/advertising/display',
      component: SponsoredDisplay,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t("Advertising.AdvertisingManager")} tabs={tabs} />

      {marketplace ? (
        <Switch>
          <Route
            path="/advertising/:campaignType/campaigns/:campaignId"
            component={CampaignDetail}
          />

          <Route
            path="/advertising/:campaignType/ad-groups/:adGroupId"
            component={AdGroupDetail}
          />

          {tabs.map((tab) => (
            <Route
              key={tab.href}
              path={tab.href}
              component={tab.component}
              exact={tab.exact}
            />
          ))}
        </Switch>
      ) : (
        <NoProfileFound />
      )}
    </DashboardLayout>
  );
};

export default Advertising;
