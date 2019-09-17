import React, { useContext, Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../context/auth';

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route {...rest} render={props => (user ? <Redirect to="/" /> : <Component {...props} />)} />
  );
};

const ClientProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        user && user.role === 'Customer' ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

const AdminProtectedRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        user && user.role === 'Admin' ? <Component {...props} /> : <Redirect to="/signin" />
      }
    />
  );
};

export { AuthRoute, ClientProtectedRoute, AdminProtectedRoute };
