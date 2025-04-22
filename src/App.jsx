// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useEffect } from "react";
// import Navbar from "./components/Navbar";
// import Ask from "./pages/Ask";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Flashcards from "./pages/Flashcards";
// import Premium from "./pages/Premium";
// import Saved from "./pages/Saved";
// import Quiz from "./pages/Quiz";

// // If AuthProvider is not implemented, comment this for now
// // import { AuthProvider } from "./contexts/AuthContext";

// const App = () => {


//   const [isLogin, setIsLoggedIn] = useState(() => {
//     return localStorage.getItem("isLoggedIn") === "true"; // Check if user is logged in
//   });

//   useEffect(() => {
//     localStorage.setItem("isLoggedIn", isLogin);
//   }, [isLogin]);
//   return (
//     // <AuthProvider> // Uncomment this only when AuthContext is set up
//     <Router>
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Navbar setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />
//       <Routes>
//         <Route path="/" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
//         <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
//         <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
//         <Route path="/ask" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
//         <Route path="/flashcards" element={<Flashcards />} />
//         <Route path="/premium" element={<Premium />} />
//         <Route path="/saved" element={<Saved />} />
//         <Route path="/quiz" element={<Quiz />} />
//       </Routes>
//     </Router>
//     // </AuthProvider>
//   );
// };

// export default App;
import React, { useState } from "react";
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
import { useContext } from "react";
import { useAppContext } from "./context/AppContext";
// If AuthProvider is not implemented, comment this for now
// import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  const {isLogin,setIsLoggedIn, token } = useAppContext();
  // const navigate = useNavigate();
  //   useEffect(() => {
  //     if (token) {
  //       setIsLoggedIn(true);
  //     } else {
  //      navigate('/');
  //       setIsLoggedIn(false);
  //     }
  //   }, [token]);

  return (
    // <AuthProvider> // Uncomment this only when AuthContext is set up
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />
      <Routes>
        <Route path="/" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/ask" element={<Ask setIsLoggedIn={setIsLoggedIn} isLogin={isLogin} />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
    // </AuthProvider>
  );
};

export default App;
