import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice';
import PageLoader from 'components/PageLoader';

const LoggedInRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading } = useSelector(selectAuth);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <PageLoader />;
        } else if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          if (props.history.action === 'PUSH')
            return <Redirect to="/sign-in" />;
          else
            return <Redirect to={`/sign-in?ref=${props.location.pathname}`} />;
        }
      }}
    />
  );
};

export default LoggedInRoute;
