import React from 'react';
import SignupForm from '../components/SignupForm';

const Signup = (props) => {
  let setIsLoggedIn = props.setIsLoggedIn;
  return (
    <div>
      <SignupForm setIsLoggedIn={setIsLoggedIn} />
    </div>
  );
};

export default Signup;
