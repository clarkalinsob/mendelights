import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else initialState.user = decodedToken;
}

const AuthContext = createContext({
  user: null,
  signin: userData => {},
  signout: () => {}
});

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return {
        ...state,
        user: action.payload
      };
    case 'SIGNOUT': {
      return {
        ...state,
        user: null
      };
    }
    default:
      return state.break;
  }
};

const AuthProvider = props => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signin = userData => {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'SIGNIN',
      payload: userData
    });
  };

  const signout = () => {
    localStorage.removeItem('jwtToken');
    dispatch({
      type: 'SIGNOUT'
    });
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, signin, signout }}
      {...props}
    ></AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
