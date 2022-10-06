import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice';
import PageLoader from 'components/PageLoader';
import { userCan } from 'utils/permission';

const PrivateRoute = ({
  component: Component,
  layout: Layout,
  access = ['application', 'agency'],
  permissions,
  ...rest
}) => {
  const { isAuthenticated, loading, user } = useSelector(selectAuth);

  const redirectUser = (roleLevel) => {
    if (roleLevel === 'agency') {
      return <Redirect to="/clients" />;
    } else {
      return <Redirect to="/plan" />;
    }
  };

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <PageLoader />;
        } else if (isAuthenticated) {
          if (access.includes(user.role.level)) {
            if (!permissions || userCan(user, permissions)) {
              return Layout ? (
                <Layout>
                  <Component {...props} />
                </Layout>
              ) : (
                <Component {...props} />
              );
            } else {
              return <Redirect to="/permission-denied" />;
            }
          } else {
            return redirectUser(user.role.level);
          }
        } else {
          return <Redirect to="/sign-in" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
