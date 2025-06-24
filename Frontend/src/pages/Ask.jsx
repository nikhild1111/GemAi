
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { useLocation } from "react-router-dom";


const Ask = () => {
  const location = useLocation();
  useEffect(() => {
    // Clear the topic when this page loads
    setTopic("");
  }, []);
    // Clear topic when this page loads
  const {isLogin,topic,setTopic} = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!isLogin) {
      toast.error('Please login to access this feature.');
      return null; // or return to a login component, or redirect
    }
    
    if (!topic.trim()) {

toast.error("Please Enter a text")
      return;
    }
        localStorage.setItem('topic', topic);
        navigate('/flashcards');
  };

  const handleSurprise = async () => {
    if (!isLogin) {
      toast.error('Please login to access this feature.');
      return null; // or return to a login component, or redirect
    }

    //  small issue: you're setting topic using setTopic(...) and immediately using it in localStorage.setItem(...), which won't work correctly because setTopic is asynchronous — the topic value won't update instantly.
    // setTopic('Give me best 5 quotes and their examples');
    const surpriseTopic = 'Give me the todays 5 most important news stories from around the world  with some description. ';
    setTopic(surpriseTopic);
    localStorage.setItem('topic', surpriseTopic);
    navigate('/flashcards');
  };
  
   
  

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="w-full max-w-2xl">
        {/* Title + Surprise Button */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg sm:text-xl font-medium text-gray-800">
            What do you want to know?
          </span>
          <button
            onClick={handleSurprise}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded shadow-sm"
          >
            Surprise me
          </button>
        </div>

        {/* Input + Ask me Button */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <input
            type="text"
            placeholder="When is Christmas...?"
            className="flex-1 border border-gray-300 rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md disabled:opacity-50 w-full sm:w-auto"
          >
            {loading ? 'Asking...' : 'Ask me'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ask;
