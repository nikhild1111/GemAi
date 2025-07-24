
// /// Navbar.jsx
// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';
// import {
//   FaBars,
//   FaSignInAlt,
//   FaUserPlus,
//   FaHome,
//   FaBookmark,
//   FaCrown,
//   FaHistory,
//   FaSignOutAlt,
// } from 'react-icons/fa';

// const Navbar = () => {

//   const {isLogin,setIsLoggedIn, token ,showMenu,setShowMenu ,setToken} = useAppContext();
//   const navigate = useNavigate();


//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setToken(null);
//     navigate('/')
//     toast.error("Logged Out");
//   };

//   const handlePopup = (type) => {
//     if (type === 'saved') {
//       toast.success("Flashcard is save ")
//     } else if (type === 'premium') {
//       toast.success("Primium launch soon ")
//     } else if (type === 'history') {
//       toast.success('History feature coming soon!');
//     }
//   };

//   return (
//     <>
//       <nav className="flex justify-between items-center px-6 py-4 bg-blue-700 text-white shadow-md">
//         <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
//           <img
//             src="/logo.png"
//             alt="Logo"
//             className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 
//                object-cover rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
//           />
//         </div>

//         <div className="flex items-center space-x-4">
//           {!isLogin ? (
//             <>
//               <button
//                 onClick={() => navigate('/login')}
//                 className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
//               >
//                 <FaSignInAlt /> Login
//               </button>
//               <button
//                 onClick={() => navigate('/signup')}
//                 className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
//               >
//                 <FaUserPlus /> Signup
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={() => navigate('/')}
//                 className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
//               >
//                 <FaHome /> Home
//               </button>
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="text-white hover:text-gray-200 text-2xl"
//               >
//                 <FaBars />
//               </button>
//             </>
//           )}
//         </div>
//       </nav>

//       {showMenu && isLogin && (
//         <div className="absolute top-16 right-4 bg-white text-black shadow-lg rounded-lg p-4 z-50 w-48">
//           <ul className="space-y-2">
//             <li>
//               <button
//                 className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
//                 onClick={() => navigate('/saved')}
//               >
//                 <FaBookmark /> Saved
//               </button>
//             </li>
//             <li>
//               <button
//                 className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
//                 onClick={() => handlePopup('premium')}
//               >
//                 <FaCrown /> Premium
//               </button>
//             </li>
//             <li>
//               <button
//                 className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
//                 onClick={() => handlePopup('history')}
//               >
//                 <FaHistory /> History
//               </button>
//             </li>
//             <li>
//               <button
//                 className="flex items-center w-full text-left gap-2 hover:bg-red-100 px-2 py-2 rounded text-red-500"
//                 onClick={handleLogout}
//               >
//                 <FaSignOutAlt /> Logout
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </>
//   );
// };

// export default Navbar;




// Navbar.jsx
import React from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { StickyNote } from "lucide-react";

import { useAppContext } from '../context/AppContext';
import {
  FaBars,
  FaSignInAlt,
  FaUserPlus,
  FaHome,
  FaBookmark,
  FaCrown,
  FaHistory,
  FaSignOutAlt,
} from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { BsMicFill } from 'react-icons/bs';
import { BiTimer } from 'react-icons/bi';

const Navbar = () => {
  const { isLogin, setIsLoggedIn, token, showMenu, setShowMenu, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken(null);
    navigate('/');
    toast.error("Logged Out");
  };

  const handlePopup = (type) => {
    if (type === 'saved') {
                navigate('/saved');
    } else if (type === 'premium') {
      toast.success("Premium launching soon");
    } else if (type === 'history') {
      toast.success('History feature coming soon!');
    
    } else if (type === 'qna') {
      toast.success('Q&A feature coming soon!');
    
    } else if (type === 'uploadresume') {
      toast.success('Resume feature coming soon!');
    
    } else if (type === 'notes') {
      navigate('/notes');
    }
  };

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-blue-700 text-white shadow-md">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 
              object-cover rounded-full shadow-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className="flex items-center space-x-4">
          {!isLogin ? (
            <>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
              >
                <FaSignInAlt /> Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
              >
                <FaUserPlus /> Signup
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1 px-4 py-2 bg-white text-blue-700 rounded hover:bg-gray-100 transition"
              >
                <FaHome /> Home
              </button>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-white hover:text-gray-200 text-2xl"
              >
                <FaBars />
              </button>
            </>
          )}
        </div>
      </nav>

      {showMenu && isLogin && (
        <div className="absolute top-16 right-4 bg-white text-black shadow-lg rounded-lg p-4 z-50 w-48">
          <ul className="space-y-2">
            {/* <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() => handlePopup('uploadresume')}
              >
                <FiUpload /> Upload Resume
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() =>  handlePopup('qna')}
              >
                <BsMicFill /> Voice Q&A
              </button>
            </li> */}
               <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() =>  handlePopup('notes')}
              >
              <StickyNote size={24} color="#4A4A4A" /> Notes
              </button>
            </li> 
         
            <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() => handlePopup('saved')}
              >
                <FaBookmark /> Saved
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() => handlePopup('premium')}
              >
                <FaCrown /> Premium
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-gray-100 px-2 py-2 rounded"
                onClick={() => handlePopup('history')}
              >
                <FaHistory /> History
              </button>
            </li>
            <li>
              <button
                className="flex items-center w-full text-left gap-2 hover:bg-red-100 px-2 py-2 rounded text-red-500"
                onClick={handleLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
