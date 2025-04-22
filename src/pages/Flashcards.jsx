

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const Flashcards = () => {
//   const [definition, setDefinition] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingQuiz, setLoadingQuiz] = useState(false);  // Track quiz loading state
//   const topic = localStorage.getItem('topic') || '';
//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await axios.post('http://localhost:3000/api/content', {
//           question: topic,
//         });

//         const rawCards = res.data.result;
//         const lines = rawCards.split('\n').filter(Boolean);

//         const parsedTopics = [];
//         let currentTopic = null;

//         lines.forEach((line, index) => {
//           if (index === 0 && line.toLowerCase().startsWith("definition")) {
//             setDefinition(line.replace(/^Definition:\s*/i, '').trim());
//           } else if (/^\d+\./.test(line)) {
//             // Matches lines like "1. Machine Learning"
//             if (currentTopic) parsedTopics.push(currentTopic);
//             currentTopic = { heading: line.trim(), points: [] };
//           } else if (line.startsWith('-')) {
//             currentTopic?.points.push(line.replace(/^- /, '').trim());
//           }
//         });

//         if (currentTopic) parsedTopics.push(currentTopic); // Add the last one
//         setTopics(parsedTopics);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error:', err);
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [topic]);
//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return alert("⚠️ You are not logged in.");
  
//       // Using PATCH request instead of POST
//       const response = await axios.patch(
//         "http://localhost:3000/api/saveTopic",
//         { topic, cards: [definition, ...topics] },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
  
//       if (response.status === 200) {
//         toast.success("Flashcards saved successfully!");
//       } else {
//         toast.error(`Failed to save: ${response.data.message}`);
//       }
//     } catch (error) {
//       console.error("Error saving flashcards:", error);
//       alert("⚠️ Something went wrong while saving.");
//     }
//   };
  

//   const handleQuiz = async () => {
//     setLoadingQuiz(true);  // Set loading state to true when quiz is being fetched

//     try {
//       const response = await axios.post("http://localhost:3000/api/quiz", {
//         topic,
//         definition,
//       });

//       const quizData = response.data.quiz;

//       // ✅ Navigate and pass quizData
//       navigate("/quiz", { state: { topic, quizData } });

//       setLoadingQuiz(false);  // Reset loading state after navigating
//     } catch (error) {
//       console.error("Quiz generation failed:", error);
//       alert("❌ Failed to generate quiz");
//       setLoadingQuiz(false);  // Reset loading state in case of an error
//     }
//   };

//   const handleAsk = () => {
//     navigate('/ask');
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-5xl bg-white rounded-xl shadow-xl">
//       <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">
//         Topic: <span className="text-gray-800 font-medium">{topic}</span>
//       </h1>

//       {loading ? (
//         <p className="text-center text-gray-600">Generating flashcards...</p>
//       ) : (
//         <>
//           {/* Definition */}
//           {definition && (
//             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-6 mb-6 rounded-lg shadow-md">
//               <strong className="font-semibold">Definition:</strong> {definition}
//             </div>
//           )}

//           {/* Topics and Subpoints */}
//           <div className="space-y-6">
//             {topics.map((topic, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//                 <h2 className="text-2xl font-semibold text-blue-800 mb-4">{topic.heading}</h2>
//                 <ul className="list-disc list-inside space-y-2 text-gray-700">
//                   {topic.points.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Bottom buttons */}
//       <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
//         <button
//           onClick={handleSave}
//           className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
//         >
//           Save
//         </button>
//         <button
//           onClick={handleQuiz}
//           disabled={loadingQuiz}
//           className={`${
//             loadingQuiz ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
//           } text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105`}
//         >
//           {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
//         </button>
//         <button
//           onClick={handleAsk}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
//         >
//           Ask Me
//         </button>
//       </div>

//       {/* Loading Indicator */}
//       {loadingQuiz && (
//         <div className="flex justify-center mt-4">
//           <div className="spinner-border animate-spin text-yellow-500" role="status">
//             <span className="sr-only">Loading...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Flashcards;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const Flashcards = () => {

const { topic,setTopic }=useAppContext();
  const [definition, setDefinition] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);  // Track quiz loading state

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post('http://localhost:3000/api/content', {
          question: topic,
        });

        const rawCards = res.data.result;
        console.log(rawCards);
        const lines = rawCards.split('\n').filter(Boolean);
// console.log(lines);
        const parsedTopics = [];
        let currentTopic = null;

        lines.forEach((line, index) => {
          if (index === 0 && line.toLowerCase().startsWith("definition")) {
            setDefinition(line.replace(/^Definition:\s*/i, '').trim());
          } else if (/^\d+\./.test(line)) {
            // Matches lines like "1. Machine Learning"
            if (currentTopic) parsedTopics.push(currentTopic);
            currentTopic = { heading: line.trim(), points: [] };
          } else if (line.startsWith('-')) {
            currentTopic?.points.push(line.replace(/^- /, '').trim());
          }
        });

        if (currentTopic) parsedTopics.push(currentTopic); // Add the last one
        setTopics(parsedTopics);
        setLoading(false);
      } catch (err) {
        toast.error('please enter topic again')
        navigate('/');
        console.error('Error:', err);
        setLoading(false);
      }
    }

// console.log(topic);
    fetchData();
  }, [topic]);
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("⚠️ You are not logged in.");
  
      // Using PATCH request instead of POST
      const response = await axios.patch(
        "http://localhost:3000/api/saveTopic",
        { topic, cards: [definition, ...topics] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        toast.success("Flashcards saved successfully!");
      } else {
        toast.error(`Failed to save: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("⚠️ Something went wrong while saving.");
    }
  };
  

  const handleQuiz = async () => {
    setLoadingQuiz(true);  // Set loading state to true when quiz is being fetched

    try {
      const response = await axios.post("http://localhost:3000/api/quiz", {
        topic,
        definition,
      });

      const quizData = response.data.quiz;

      // ✅ Navigate and pass quizData
      navigate("/quiz", { state: { topic, quizData } });

      setLoadingQuiz(false);  // Reset loading state after navigating
    } catch (error) {
      console.error("Quiz generation failed:", error);
      toast.error(" Failed to generate quiz");
      setLoadingQuiz(false);  // Reset loading state in case of an error
    }
  };

  const handleAsk = () => {
    navigate('/ask');
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl bg-white rounded-xl shadow-xl">
      <h1 className="text-3xl font-semibold text-center text-blue-600 mb-8">
        Topic: <span className="text-gray-800 font-medium">{topic}</span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Generating flashcards...</p>
      ) : (
        <>
          {/* Definition */}
          {definition && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-6 mb-6 rounded-lg shadow-md">
              <strong className="font-semibold">Definition:</strong> {definition}
            </div>
          )}

          {/* Topics and Subpoints */}
          <div className="space-y-6">
            {topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">{topic.heading}</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {topic.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Bottom buttons */}
      <div className="mt-8 flex flex-col md:flex-row gap-6 justify-center">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
        >
          Save
        </button>
        <button
          onClick={handleQuiz}
          disabled={loadingQuiz}
          className={`${
            loadingQuiz ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
          } text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105`}
        >
          {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
        </button>
        <button
          onClick={handleAsk}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
        >
          Ask Me
        </button>
      </div>

      {/* Loading Indicator */}
      {loadingQuiz && (
        <div className="flex justify-center mt-4">
          <div className="spinner-border animate-spin text-yellow-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
