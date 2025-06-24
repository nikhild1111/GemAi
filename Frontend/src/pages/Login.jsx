import React from 'react';
import LoginForm from '../Components/LoginForm';

const Login = (props) => {
  const setIsLoggedIn = props.setIsLoggedIn;
  return (
    <div>
      <LoginForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Login;
