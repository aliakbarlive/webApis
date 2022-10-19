import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from 'components/Loader';

const PublicRoute = ({
  layout: Layout,
  component: Component,
  auth: { isAuthenticated, loading },
  restricted,
  ...rest
}) => {
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      {...rest}
      render={(props) =>
        loading ? (
          <Loader />
        ) : isAuthenticated && restricted ? (
          <Redirect to="/dashboard" />
        ) : (
          <Layout>
            <Component {...props} />
          </Layout>
        )
      }
    />
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PublicRoute);
