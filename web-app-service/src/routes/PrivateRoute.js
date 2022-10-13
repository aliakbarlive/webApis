import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { selectAuth } from '../features/auth/authSlice';
import { selectCurrentAccount } from 'features/accounts/accountsSlice';
import PageLoader from 'components/PageLoader';

const redirectUser = (accountName) => {
  switch (accountName) {
    case 'free':
    case 'basic':
    case 'pro':
      return <Redirect to="/profit" />;
    case 'application':
      return <Redirect to="/plan" />;
    default:
      return <Redirect to="/profit" />;
  }
};

const PrivateRoute = ({
  component: Component,
  restricted = false,
  module = '',
  access = ['agency', 'free', 'basic', 'pro'],
  ...rest
}) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);
  const account = useSelector(selectCurrentAccount);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) return <PageLoader />;

        if (isAuthenticated) {
          if (access.includes(account.plan.name)) {
            return <Component {...props} />;
          } else {
            return redirectUser(account.plan.name);
          }
        }

        if (!isAuthenticated) return <Redirect to="/sign-in" />;
      }}
    />
  );
};

export default PrivateRoute;
