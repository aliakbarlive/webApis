import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice';
import PageLoader from 'components/PageLoader';
// import Loader from 'components/Loader';

const PublicRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <PageLoader />;
        } else if (isAuthenticated) {
          return <Redirect to="/plan" />;
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
};

export default PublicRoute;
