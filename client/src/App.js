import React, { useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './pages/Home';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import ResponsiveDrawer from './components/ResponsiveDrawer';

import { AuthProvider } from './context/auth';
import { AuthRoute, ClientProtectedRoute, AdminProtectedRoute } from './util/AuthRoute';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ResponsiveDrawer signinRedirect="dashboard" />

        {/* Unauthenticated Route */}
        <Route exact path="/" component={Home} />
        <AuthRoute exact path="/signin" component={SignIn} />

        {/* ClientProtectedRoute */}
        <ClientProtectedRoute exact path="/orderHistory" component={Orders} />

        {/* AdminProtectedRoute */}
        <AdminProtectedRoute exact path="/dashboard" component={Dashboard} />
        <AdminProtectedRoute exact path="/orders" component={Dashboard} />
        <AdminProtectedRoute exact path="/users" component={Dashboard} />

        {/* AuthRoute */}
      </Router>
    </AuthProvider>
  );
};

export default App;
