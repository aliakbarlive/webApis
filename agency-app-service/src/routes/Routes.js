import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AgencyLayout from 'layouts/agency/AgencyLayout';
import AccountLayout from 'layouts/account/AccountLayout';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import SignIn from 'features/auth/SignIn';
import Register from 'features/auth/Register';
import Clients from 'features/clients/Clients';
import Assignments from 'features/clients/Assignments';
import Employees from 'features/employees/Employees';
import Invoices from 'features/invoices/Invoices';
import UpdateCardSuccess from 'features/clients/UpdateCardSucess';
// import Zoho from 'features/zoho/Settings';
import Settings from 'features/settings/Settings';
import ReviewManager from 'features/reviews/ReviewManager';
import ProductAlertsManager from 'features/productAlerts/ProductAlertsManager';
import PermissionsManager from 'features/permissions/PermissionsManager';
import RolesManager from 'features/roles/RolesManager';
import AmazonCallback from 'features/auth/AmazonCallback';
import Subscription from 'features/subscription/Subscription';
import Confirmation from 'features/subscription/Confirmation';
import Onboarding from 'features/onboarding/Onboarding';
import Plan from 'features/plans/Plan';
import ClientMigration from 'features/clientMigration/ClientMigration';
import CreditNotes from 'features/creditNotes/CreditNotes';
import UpdateCard from 'features/clients/UpdateCard';
import ForgotPassword from 'features/auth/ForgotPassword';
import ForgotPasswordSuccess from 'features/auth/ForgotPasswordSuccess';
import ResetPasswordSuccess from 'features/auth/ResetPasswordSuccess';
import ResetPassword from 'features/auth/ResetPassword';
import Churn from 'features/churn/Churn';
import AdvertisingManager from 'features/advertising/AdvertisingManager';
import ProfitManger from 'features/profit/ProfitManger';
import ProductManager from 'features/products/ProductManager';
import OrderManager from 'features/orders/OrderManager';
import ChangeRequests from 'features/changeRequests/ChangeRequests';
import PermissionDenied from 'features/static/PermissionDenied';
import Upsells from 'features/upsells/Upsells';
import Leads from 'features/leads/Leads';
import Metrics from 'features/leads/Metrics';
import LeadsData from 'features/leads/LeadsData';
import LeadsSettings from 'features/leads/LeadsSettings';
import LeadsArchive from 'features/leads/LeadsArchive';
import DataSyncManager from 'features/dataSync/DataSyncManager';
import BillingPreview from 'features/upsells/BillingPreview';
import Reports from 'features/reports/Reports';
import LoggedInRoute from './LoggedInRoute';
import InvalidRequest from 'features/static/InvalidRequest';
import Error404 from 'features/static/404';
import ReportsGenerator from 'features/reportsGenerator/ReportsGenerator';
import Dashboard from 'features/leads/Dashboard';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/sign-in" />
      </Route>

      {/* Auth Routes */}
      <PublicRoute path="/sign-in" component={SignIn} />
      <PublicRoute path="/register/:inviteToken" component={Register} exact />
      <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
      <PublicRoute
        path="/forgot-password/success"
        component={ForgotPasswordSuccess}
        exact
      />
      <PublicRoute
        path="/reset-password/success"
        component={ResetPasswordSuccess}
        exact
      />
      <PublicRoute
        path="/reset-password/:resetToken"
        component={ResetPassword}
        exact
      />
      <PublicRoute path="/sign-out" exact>
        <Redirect to="/sign-in" />
      </PublicRoute>

      {/* General Routes */}
      <PrivateRoute
        path="/settings"
        component={Settings}
        access={['agency', 'application']}
      />

      {/* Client Routes */}
      <PrivateRoute
        path="/subscription"
        component={Subscription}
        access={['application']}
        exact
      />
      <PrivateRoute
        path="/subscription/confirmation"
        component={Confirmation}
        access={['application']}
        exact
      />
      <PrivateRoute
        path="/onboarding"
        component={Onboarding}
        access={['application']}
        exact
      />
      <PrivateRoute
        path="/plan"
        restricted={true}
        component={Plan}
        module="plan"
        access={['application']}
      />

      {/* Agency Routes */}
      <PrivateRoute
        path="/callback/amazon"
        component={AmazonCallback}
        access={['agency']}
      />

      <PrivateRoute
        path="/clients"
        component={Clients}
        layout={AgencyLayout}
        access={['agency']}
        permissions="clients.view.all"
      />

      <PrivateRoute
        path="/client-assignments"
        component={Assignments}
        layout={AgencyLayout}
        access={['agency']}
        permissions="clients.assignment.list"
      />

      <PrivateRoute path="/invoices" component={Invoices} access={['agency']} />
      <PrivateRoute
        path="/credit-notes"
        component={CreditNotes}
        access={['agency']}
        permissions="creditNotes.list"
      />
      <PrivateRoute
        path="/employees"
        layout={AgencyLayout}
        component={Employees}
        access={['agency']}
      />
      <PrivateRoute
        path="/churn"
        layout={AgencyLayout}
        component={Churn}
        access={['agency']}
      />

      <PrivateRoute
        path="/change-requests"
        layout={AgencyLayout}
        component={ChangeRequests}
        access={['agency']}
        permissions="ppc.changeRequest.list"
      />

      <PrivateRoute
        path="/data-sync"
        layout={AgencyLayout}
        component={DataSyncManager}
        access={['agency']}
      />

      <PrivateRoute
        path="/accounts/:accountId/advertising"
        component={AdvertisingManager}
        layout={AccountLayout}
        access={['agency']}
        permissions="ppc.view"
      />

      <PrivateRoute
        path="/accounts/:accountId/profit"
        layout={AccountLayout}
        component={ProfitManger}
        access={['agency']}
        permissions="profits.view"
      />

      <PrivateRoute
        path="/accounts/:accountId/products"
        layout={AccountLayout}
        component={ProductManager}
        access={['agency']}
        permissions="products.view"
      />

      <PrivateRoute
        path="/accounts/:accountId/orders"
        layout={AccountLayout}
        component={OrderManager}
        access={['agency']}
        permissions="orders.view"
      />

      <PrivateRoute
        path="/accounts/:accountId/reviews"
        layout={AccountLayout}
        component={ReviewManager}
        access={['agency']}
        permissions="reviews.view"
      />

      <PrivateRoute
        path="/accounts/:accountId/alerts"
        layout={AccountLayout}
        component={ProductAlertsManager}
        access={['agency']}
        permissions="alerts.view"
      />

      <PrivateRoute
        path="/permissions"
        layout={AgencyLayout}
        component={PermissionsManager}
        access={['agency']}
      />

      <PrivateRoute
        path="/roles"
        layout={AgencyLayout}
        component={RolesManager}
        permissions="roles.manage"
        access={['agency']}
      />

      <PrivateRoute
        path="/permission-denied"
        layout={AgencyLayout}
        component={PermissionDenied}
        access={['agency']}
      />

      <PrivateRoute
        path="/upsells"
        component={Upsells}
        layout={AgencyLayout}
        access={['agency']}
        permissions="clients.view.all"
      />

      <PrivateRoute
        path="/leads"
        component={Leads}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.list"
      />

      <PrivateRoute
        path="/leads-metrics"
        component={Metrics}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.list"
      />

      <PrivateRoute
        path="/leads-archived"
        //aaaa+++
        component={LeadsArchive}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.list"
      />

      <PrivateRoute
        path="/leads-dashboard/:userId"
        component={Dashboard}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.profile"
      />

      <PrivateRoute
        path="/leads-dashboard"
        component={Dashboard}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.profile"
      />

      <PrivateRoute
        path="/leads-data"
        component={LeadsData}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.list"
      />

      <PrivateRoute
        path="/leads-settings"
        component={LeadsSettings}
        layout={AgencyLayout}
        access={['agency']}
        permissions="leads.list"
      />

      <Route path="/update-card/permit/:token" component={UpdateCard} exact />
      <Route path="/update-card-success" component={UpdateCardSuccess} exact />

      <LoggedInRoute
        path="/upsells-billing-preview/:id"
        component={BillingPreview}
        access={['application']}
        exact
      />

      <Route
        path="/invalid-request"
        component={InvalidRequest}
        access={['application']}
        exact
      />

      <Route
        path="/client-migration/:token"
        component={ClientMigration}
        exact
      />

      <PrivateRoute
        path="/reports"
        component={Reports}
        layout={AgencyLayout}
        access={['agency']}
      />

      <Route path="/reports-generator" component={ReportsGenerator} />

      {/* 404 Route */}
      <Route render={() => <Error404 />} />
    </Switch>
  );
};

export default Routes;
