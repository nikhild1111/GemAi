import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = (props) => {
  const setIsLoggedIn = props.setIsLoggedIn;
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Login;
