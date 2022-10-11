import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import PageNotFound from 'components/PageNotFound';
import SignIn from 'features/auth/SignIn';
import ForgotPassword from 'features/auth/ForgotPassword';
import ForgotPasswordSuccess from 'features/auth/ForgotPasswordSuccess';
import Register from 'features/auth/Register';
import EmailVerification from 'features/auth/EmailVerification';
import Onboarding from 'features/onboarding/Onboarding';
import Products from '../features/products/Products';
import Orders from '../features/orders/Orders';
import Reviews from '../features/reviews/Reviews';
import Profit from '../features/profit/Profit';
import Advertising from 'features/advertising/Advertising';
import Settings from 'features/settings/Settings';
import NewAccount from 'features/onboarding/NewAccount';
import Alerts from 'features/alerts/Alert';
import Subscription from 'features/subscription/Subscription';
import Confirmation from 'features/subscription/Confirmation';
import Plan from 'features/plans/Plan';
import ClientMigration from 'features/client-migration/ClientMigration';
import UpdateCardSuccess from 'features/subscription/UpdateCardSuccess';

const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/sign-in" />
      </Route>

      {/* Auth Routes */}
      <PublicRoute path="/sign-in" component={SignIn} />
      <PublicRoute path="/register" component={Register} exact />
      <PublicRoute path="/register/:inviteToken" component={Register} exact />
      <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
      <PublicRoute
        path="/forgot-password/success"
        component={ForgotPasswordSuccess}
        exact
      />
      <PublicRoute path="/sign-out" exact>
        <Redirect to="/sign-in" />
      </PublicRoute>

      {/* Onboarding Routes */}
      <PrivateRoute
        path="/email-verification"
        component={EmailVerification}
        exact
      />
      <PrivateRoute path="/onboarding/start" component={NewAccount} exact />

      <PrivateRoute path="/onboarding" component={Onboarding} exact />

      <PrivateRoute path="/subscription" component={Subscription} exact />
      <PrivateRoute
        path="/subscription/confirmation"
        component={Confirmation}
        exact
      />

      {/* Dashboard Routes */}
      <PrivateRoute path="/settings" component={Settings} />

      <PrivateRoute
        path="/plan"
        restricted={true}
        component={Plan}
        module="plan"
        access={['agency']}
      />

      <PrivateRoute
        path="/profit"
        restricted={true}
        component={Profit}
        module="profit"
        access={['free']}
      />

      <PrivateRoute
        path="/products"
        component={Products}
        restricted={true}
        module="products"
        access={['free']}
      />

      <PrivateRoute
        path="/orders"
        component={Orders}
        restricted={true}
        module="orders"
        access={['free']}
      />
      <PrivateRoute
        path="/reviews"
        component={Reviews}
        restricted={true}
        module="reviews"
        access={['free']}
      />

      <PrivateRoute
        path="/alerts"
        component={Alerts}
        restricted={true}
        module="alerts"
        access={['free']}
      />

      <PrivateRoute
        path="/advertising"
        component={Advertising}
        module="advertising"
        restricted={true}
        access={['free']}
      />

      <Route
        path="/client-migration/:token"
        component={ClientMigration}
        exact
      />

      <PublicRoute path="/update-card-success" component={UpdateCardSuccess} />

      {/* <Route path="/404" component={PageNotFound} /> */}
      {/* <Route render={() => <Redirect to="/404" />} /> */}
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
