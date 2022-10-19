import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { dashboardRoutes, rootRoutes, singlePageRoutes } from './index';

import { useSelector } from 'react-redux';
import { selectisAuthenticated } from 'features/auth/authSlice';

import DashboardLayout from '../layouts/Dashboard';
import SingleLayout from '../layouts/Single';
import AuthLayout from '../layouts/Auth';
import Page404 from '../features/auth/Page404';
import ScrollToTop from '../components/ScrollToTop';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const childRoutes = (Layout, routes) =>
  routes.map(
    (
      { children, path, component: Component, exact, type, restricted },
      index
    ) => {
      return children && children.every((child) => child.component) ? (
        // Route item with children
        children.map(
          ({ path, component: Component, exact, type, restricted }, index) =>
            type === 'public' ? (
              <PublicRoute
                key={index}
                path={path}
                exact={exact}
                layout={Layout}
                component={Component}
                restricted={restricted}
                render={(props) => (
                  <Layout>
                    <Component {...props} />
                  </Layout>
                )}
              />
            ) : (
              <PrivateRoute
                key={index}
                path={path}
                exact={exact}
                layout={Layout}
                component={Component}
              />
            )
        )
      ) : type === 'public' ? (
        // Route item without children
        <PublicRoute
          key={index}
          path={path}
          exact={exact}
          layout={Layout}
          component={Component}
          restricted={restricted}
          render={(props) => (
            <Layout>
              <Component {...props} />
            </Layout>
          )}
        />
      ) : (
        <PrivateRoute
          key={index}
          path={path}
          exact={exact}
          layout={Layout}
          component={Component}
        />
      );
    }
  );

const Routes = () => {
  const isAuthenticated = useSelector(selectisAuthenticated);

  return (
    <Router>
      <ScrollToTop>
        <Switch>
          <Route exact path="/">
            {isAuthenticated ? (
              <Redirect to="/onboarding" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

          {/* {childRoutes(LandingLayout, landingRoutes)} */}
          {childRoutes(DashboardLayout, dashboardRoutes)}
          {childRoutes(AuthLayout, rootRoutes)}
          {childRoutes(SingleLayout, singlePageRoutes)}
          <Route
            render={() => (
              <AuthLayout>
                <Page404 />
              </AuthLayout>
            )}
          />
        </Switch>
      </ScrollToTop>
    </Router>
  );
};

export default Routes;
