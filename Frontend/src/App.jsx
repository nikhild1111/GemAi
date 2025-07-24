
import React, { useState } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Ask from "./pages/Ask";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Flashcards from "./pages/Flashcards";
import Premium from "./pages/Premium";
import Saved from "./pages/Saved";
import Quiz from "./pages/Quiz";
import Timer from './components/Timer';
import QnA from './pages/QnA';
import UploadResume from './pages/UploadResume';
import { useContext } from "react";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import Notes from "./components/Notes";
// import jwt_decode from 'jwt-decode'; // This should work for your case

// import { useEffect } from "react";
import { useAppContext } from "./context/AppContext";
// If AuthProvider is not implemented, comment this for now
// import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  
  const {isLogin,setIsLoggedIn, token } = useAppContext();
  // useEffect(() => {
  //   // Check if token is expired on app load
  //   function getTokenExpiry(token) {
  //     if (!token) return null;
  //     const decoded = jwt_decode(token);
  //     return decoded.exp * 1000;
  //   }

  //   function checkTokenAndLogout() {
  //     const token = localStorage.getItem('token');
  //     if (!token) return;

  //     const expiryTime = getTokenExpiry(token);
  //     const currentTime = Date.now();

  //     if (currentTime >= expiryTime) {
  //       localStorage.removeItem('token');
  //       alert('Session expired. Please login again.');
  //       window.location.href = '/login'; // Navigate to login page
  //     }
  //   }

  //   // Check token expiry immediately
  //   checkTokenAndLogout();

  //   // Check every 10 seconds (optional, if you want to keep checking)
  //   const interval = setInterval(checkTokenAndLogout, 10000);

  //   // Cleanup interval on component unmount
  //   return () => clearInterval(interval);

  // }, []); // Empty dependency array, so it runs once when component is mounted

  return (

    <GoogleOAuthProvider clientId="200817370819-89i7fql6ptplhu0th3q3c92jctefu53g.apps.googleusercontent.com">
    {/* // <AuthProvider> // Uncomment this only when AuthContext is set up */}
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />
      <Routes>
        <Route path="/" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
          <Route path="/timer" element={<Timer />} />
 <Route path="/uploadresume" element={<UploadResume />} />
          <Route path="/qna" element={<QnA questions={[]} />} /> {/* Replace [] with context value later */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/ask" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/verify" element={<VerifyOtpPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
       </GoogleOAuthProvider>
    // </AuthProvider>
  );
};

export default App;
