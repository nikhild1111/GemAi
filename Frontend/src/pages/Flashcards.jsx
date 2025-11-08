

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useAppContext } from '../context/AppContext';
// import { getAuthHeaders } from "../utils/authHeader";
// const Backend_url = import.meta.env.VITE_BACKEND_URL;

// const Flashcards = () => {
//   const { topic, setTopic } = useAppContext();

//   const [title, setTitle] = useState('');
//   const [definition, setDefinition] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingQuiz, setLoadingQuiz] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const res = await axios.post(`${Backend_url}/api/content`, {
//           question: topic,
//         });

//         const raw = res.data.result;
//         const lines = raw.split('\n').filter(Boolean);

//         let currentTopic = null;
//         const parsedTopics = [];

//         lines.forEach((line, index) => {
//           if (index === 0 && line.toLowerCase().startsWith('title')) {
//             setTitle(line.replace(/^Title:\s*/i, '').trim());
//           } else if (line.toLowerCase().startsWith('definition')) {
//             setDefinition(line.replace(/^Definition:\s*/i, '').trim());
//           } else if (/^\d+\./.test(line)) {
//             if (currentTopic) parsedTopics.push(currentTopic);
//             currentTopic = { heading: line.trim(), points: [] };
//           } else if (line.startsWith('-')) {
//             currentTopic?.points.push(line.replace(/^- /, '').trim());
//           }
//         });

//         if (currentTopic) parsedTopics.push(currentTopic);
//         setTopics(parsedTopics);
//       } catch (err) {
//         console.error('Error:', err);
//         toast.error('⚠️ Please enter topic again.');
//         navigate('/');
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, [topic]);

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return toast.error("⚠️ You are not logged in.");

//       const response = await axios.patch(
//         `${Backend_url }/api/saveTopic`,
//         { topic: title, cards: [definition, ...topics] }, // ✅ use title here
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         toast.success("✅ Flashcards saved successfully!");
//       } else {
//         toast.error(`❌ Failed to save: ${response.data.message}`);
//       }
//     } catch (error) {
//       console.error("Error saving flashcards:", error);
//       toast.error("⚠️ Something went wrong while saving.");
//     }
//   };

//   const handleQuiz = async () => {
//     setLoadingQuiz(true);
//     try {
//       const response = await axios.post(`${Backend_url }/api/quiz`, {
//         topic: title,
//         definition,
//       });

//       const quizData = response.data.quiz;
//       // console.log(quizData)
//       navigate("/quiz", { state: { topic: title, quizData } });
//     } catch (error) {
//       console.error("Quiz generation failed:", error);
//       toast.error("❌ Failed to generate quiz");
//     } finally {
//       setLoadingQuiz(false);
//     }
//   };

//   const handleAsk = () => {
//     navigate('/ask');
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-5xl bg-white rounded-xl shadow-xl">
//       {loading ? (
//         <p className="text-center text-gray-600">Generating flashcards...</p>
//       ) : (
//         <>
//           {/* Title */}
//           {title && (
//             <h1 className="text-4xl font-bold text-center text-blue-700 mb-4">
//               {title}
//             </h1>
//           )}

//           {/* Definition */}
//           {definition && (
//             <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-6 mb-6 rounded-lg shadow-md">
//               <strong className="font-semibold">Definition:</strong> {definition}
//             </div>
//           )}

//           {/* Topics and Subpoints */}
//           <div className="space-y-6">
//             {topics.map((t, index) => (
//               <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//                 <h2 className="text-2xl font-semibold text-blue-800 mb-4">{t.heading}</h2>
//                 <ul className="list-disc list-inside space-y-2 text-gray-700">
//                   {t.points.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* Bottom Buttons */}
//           <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
//             <button
//               onClick={handleSave}
//               className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
//             >
//               Save
//             </button>
//             <button
//               onClick={handleQuiz}
//               disabled={loadingQuiz}
//               className={`${
//                 loadingQuiz ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
//               } text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105`}
//             >
//               {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
//             </button>
//             <button
//               onClick={handleAsk}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition duration-300 transform hover:scale-105"
//             >
//               Ask Me
//             </button>
//           </div>
//         </>
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
import { getAuthHeaders } from "../utils/authHeader";
const Backend_url = import.meta.env.VITE_BACKEND_URL;

const Flashcards = () => {
  const { topic, setTopic } = useAppContext();

  const [title, setTitle] = useState('');
  const [definition, setDefinition] = useState('');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(`${Backend_url}/api/content`, {
          question: topic,
        });

        const raw = res.data.result;
        const lines = raw.split('\n').filter(Boolean);

        let currentTopic = null;
        const parsedTopics = [];

        lines.forEach((line, index) => {
          if (index === 0 && line.toLowerCase().startsWith('title')) {
            setTitle(line.replace(/^Title:\s*/i, '').trim());
          } else if (line.toLowerCase().startsWith('definition')) {
            setDefinition(line.replace(/^Definition:\s*/i, '').trim());
          } else if (/^\d+\./.test(line)) {
            if (currentTopic) parsedTopics.push(currentTopic);
            currentTopic = { heading: line.trim(), points: [] };
          } else if (line.startsWith('-')) {
            currentTopic?.points.push(line.replace(/^- /, '').trim());
          }
        });

        if (currentTopic) parsedTopics.push(currentTopic);
        setTopics(parsedTopics);
      } catch (err) {
        console.error('Error:', err);
        toast.error('Please enter topic again');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [topic]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("You are not logged in");

      const response = await axios.patch(
        `${Backend_url}/api/saveTopic`,
        { topic: title, cards: [definition, ...topics] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Flashcards saved successfully");
      } else {
        toast.error(`Failed to save: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error saving flashcards:", error);
      toast.error("Something went wrong while saving");
    }
  };

  const handleQuiz = async () => {
    setLoadingQuiz(true);
    try {
      const response = await axios.post(`${Backend_url}/api/quiz`, {
        topic: title,
        definition,
      });

      const quizData = response.data.quiz;
      toast.success("Quiz generated successfully");
      navigate("/quiz", { state: { topic: title, quizData } });
    } catch (error) {
      console.error("Quiz generation failed:", error);
      toast.error("Failed to generate quiz");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAsk = () => {
    navigate('/ask');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-center text-gray-600 text-lg font-medium">Generating flashcards...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
                {title}
              </h1>
            )}

            {definition && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-6 mb-8 rounded-lg shadow-sm">
                <strong className="font-semibold text-lg">Definition</strong>
                <p className="mt-2 text-gray-700 leading-relaxed">{definition}</p>
              </div>
            )}

            <div className="space-y-6 mb-10">
              {topics.map((t, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">{t.heading}</h2>
                  <ul className="space-y-3 text-gray-700">
                    {t.points.map((point, i) => (
                      <li key={i} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
              >
                Save
              </button>
              <button
                onClick={handleQuiz}
                disabled={loadingQuiz}
                className={`${
                  loadingQuiz ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2`}
              >
                {loadingQuiz && (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
              </button>
              <button
                onClick={handleAsk}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
              >
                Ask Me
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcards;