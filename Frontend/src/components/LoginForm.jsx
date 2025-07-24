
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';
import Cookies from 'js-cookie';
import { GoogleLogin } from '@react-oauth/google';

import { getAuthHeaders } from "../utils/authHeader";
const Backend_url = import.meta.env.VITE_BACKEND_URL;
const LoginForm = () => {

  const { setIsLoggedIn, setToken } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|int)$/i.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/.test(password);

  const submitHandler = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!isValidEmail(email)) return toast.error('Invalid email format');
    if (!isValidPassword(password)) return toast.error('Password must be strong');

    try {
      const response = await axios.post(`${Backend_url}/api/v1/login`, { email, password }, getAuthHeaders());

      const token = Cookies.get('token');
      // alert('Token:', token);

      if (response.data.success) {
        // Assuming the backend sends a token in response
        const { token } = response.data;

        // Save the token in localStorage (or sessionStorage)
        localStorage.setItem("token", token);

        setIsLoggedIn(true);
        setToken(token);
        toast.success(response.data.message);
        navigate('/ask');
      } else {

        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome Back!</h2>
          <span onClick={() => navigate('/')} className="text-gray-600 text-lg cursor-pointer hover:text-gray-800">X</span>
        </div>
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="text-gray-600 text-sm">Email <span className="text-red-600">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="text-sm mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
              value={formData.email}
              onChange={changeHandler}
            />
          </div>
          <div>
            <label className="text-gray-600 text-sm">Password <span className="text-red-600">*</span></label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter Password"
              className="text-sm mt-1 p-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              required
              value={formData.password}
              onChange={changeHandler}
            />
            <p
              className="text-sm text-blue-600 mt-1 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </p>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </button>
        </form>
         {/* Divider */}
  <div className="flex items-center my-4">
    <hr className="flex-grow border-t border-gray-300" />
    <span className="mx-4 text-gray-400 text-sm">OR</span>
    <hr className="flex-grow border-t border-gray-300" />
  </div>

  {/* GOOGLE LOGIN BUTTON */}
  <div className="flex justify-center">
    <GoogleLogin
      onSuccess={credentialResponse => {
        console.log(credentialResponse);

        axios.post(`${Backend_url}/api/v1/google-login`, {
          token: credentialResponse.credential,
        }, { withCredentials: true })
        .then(response => {
          console.log(response.data);

          localStorage.setItem('token', response.data.token);
          setIsLoggedIn(true);
          setToken(response.data.token);
          toast.success('Login successful!');
          navigate('/ask');
        })
        .catch(error => {
          console.error(error);
          toast.error('Google login failed');
        });
      }}
      onError={() => {
        console.log('Login Failed');
        toast.error('Google login failed');
      }}
    />
  </div>
      </div>
    </div>
  );
};

export default LoginForm;
