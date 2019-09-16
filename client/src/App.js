import React, { useContext } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Foods from './pages/Foods';
import SignIn from './pages/SignIn';
import ResponsiveDrawer from './components/ResponsiveDrawer';

import { AuthProvider } from './context/auth';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ResponsiveDrawer />
        {/* <Route exact path="/" component={Foods}></Route> */}
        <Route exact path="/signin" component={SignIn}></Route>

        <Route exact path="/foods" component={Foods}></Route>
      </Router>
    </AuthProvider>
  );
};

export default App;
