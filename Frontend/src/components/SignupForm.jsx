
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from "axios";
import { useAppContext } from '../context/AppContext';

import { getAuthHeaders } from "../utils/authHeader";
const Backend_url = import.meta.env.VITE_BACKEND_URL;
const SignupForm = () => {


  const {setIsLoggedIn,setToken}=useAppContext();
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    email: "", password: "", name: "", phone: "", confirmpassword: ""
  });

  const changeHandler = (e) => {
    setformData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValidEmail = (email) => /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|int)$/i.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{8,}$/.test(password);
  const isValidPhoneNumber = (phone) => /^\d{10}$/.test(phone);

  const submitHandler = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmpassword, phone } = formData;

    if (!isValidEmail(email)) return toast.error('Invalid email format');
    if (!isValidPassword(password)) return toast.error('Password must contain 8+ characters, with uppercase, lowercase, number, and special symbol');
    if (password !== confirmpassword) return toast.error("Confirm Passwords do not match");
    if (!isValidPhoneNumber(phone)) return toast.error("Phone must be 10 digits");

    try {

      //  fiest go to the otp and check it then come back to the signup page 




      await axios.post(`${Backend_url}/list/api/send-otp`, { email });

      navigate("/verify", { state: { email,name,password,phone } });

      // const response = await axios.post("http://localhost:3000/api/v1/signup", {
      //   name,
      //   email,
      //   password,
      //   phone,
      //   // role: "user", // optional field, or set default in schema
      // });
      // if (response.data.success) {
      //   // Assuming the backend sends a token in response
      // const { token } = response.data;

      // // Save the token in localStorage (or sessionStorage)
      // localStorage.setItem("token", token);
      // setToken(token);
      //   // toast.success(response.data.message);
      //   toast.success("Wellcome to study hub ");
      //   setIsLoggedIn(true);
      //   navigate("/ask");
      // } else {
      //   toast.error(response.data.message || "Signup failed");
      // }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong to send otp");
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex items-center justify-center px-4 sm:px-6">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
          <span onClick={() => navigate("/")} className="text-lg text-gray-600 cursor-pointer hover:text-gray-800">X</span>
        </div>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
            <div className="w-full">
              <label className="text-sm text-gray-600">Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Full name"
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={formData.name}
                onChange={changeHandler}
              />
            </div>
            <div className="w-full">
              <label className="text-sm text-gray-600">Phone <span className="text-red-600">*</span></label>
              <input
                type="text"
                name="phone"
                placeholder="10-digit number"
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={formData.phone}
                onChange={changeHandler}
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email <span className="text-red-600">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              value={formData.email}
              onChange={changeHandler}
            />
          </div>
          <div className="space-y-4 sm:flex sm:gap-4 sm:space-y-0">
            <div className="w-full">
              <label className="text-sm text-gray-600">Password <span className="text-red-600">*</span></label>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={formData.password}
                onChange={changeHandler}
              />
            </div>
            <div className="w-full">
              <label className="text-sm text-gray-600">Confirm Password <span className="text-red-600">*</span></label>
              <input
                type="password"
                name="confirmpassword"
                placeholder="Re-enter password"
                className="text-sm mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
                value={formData.confirmpassword}
                onChange={changeHandler}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700"
          >
            Sign Up
          </button>
          {/* this is divider */}
          {/* <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-full h-[1px] bg-gray-300"></div>
            <p className="text-gray-500 text-sm">OR</p>
            <div className="w-full h-[1px] bg-gray-300"></div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
