
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import { getAuthHeaders } from "../utils/authHeader";
// const Backend_url = import.meta.env.VITE_BACKEND_URL;

// const Saved = () => {
//   let [topic, setTopic] = useState({});
//   let [definition, setDefinition] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
//   const [loadingQuiz, setLoadingQuiz] = useState(false);  // Track quiz loading state
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const topicKeys = Object.keys(topics);


//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ You are not logged in.");

//         const response = await axios.get(`${Backend_url }/api/getTopics`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setTopics(response.data.topics || {});
//       } catch (error) {
//         console.error("Error fetching saved topics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopics();
//   }, []);

//   const handleTopicClick = (index) => {
//     setSelectedTopicIndex(index);
//   };

//   const handleBackToTopics = () => {
//     setSelectedTopicIndex(null);
//   };

//   const handleNext = () => {
//     if (selectedTopicIndex < topicKeys.length - 1) {
//       setSelectedTopicIndex((prev) => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (selectedTopicIndex > 0) {
//       setSelectedTopicIndex((prev) => prev - 1);
//     }
//   };

//   const handleAskMe = () => {
//     navigate("/ask");
//   };

//   const handleQuizMe = async () => {
//     setLoadingQuiz(true);  // Set loading state to true when quiz is being fetched



//     try {


//       const response = await axios.post(`${Backend_url }/api/quiz`, {
//         topic:selectedTopic,
//         definition:topicData[0],
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

//   const selectedTopic = topicKeys[selectedTopicIndex];
//   const topicData = topics[selectedTopic];

// if(selectedTopicIndex !== null){
//     topic=selectedTopic;
//     if(typeof topicData[0] === "string"){
//      definition=topicData[0];
//     }
     
// }
 

// return (
//   <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
//     {selectedTopicIndex === null ? (
//       <>
//         <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-blue-700">
//           📚 Your Saved Topics
//         </h1>
//         {loading ? (
//           <p className="text-center text-gray-500">Loading topics...</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {topicKeys.map((topic, index) => (
//               <button
//                 key={index}
//                 className="bg-white w-full text-blue-800 px-4 py-3 rounded-xl shadow hover:bg-blue-50 border border-blue-200 transition-all text-center"
//                 onClick={() => handleTopicClick(index)}
//               >
//                 {topic}
//               </button>
//             ))}
//           </div>
//         )}
//       </>
//     ) : (
//       <>
//         <button
//           onClick={handleBackToTopics}
//           className="mb-4 text-blue-600 hover:text-blue-800 underline"
//         >
//           ← Back to Saved Topics
//         </button>

//         <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-2 break-words">
//           Topic: <span className="text-black">{selectedTopic}</span>
//         </h2>

//         {topicData && (
//           <>
//             {typeof topicData[0] === "string" && (
//               <div className="bg-yellow-100 p-4 rounded-md mb-6 border-l-4 border-yellow-500 text-yellow-900">
//                 <strong>Definition:</strong> {topicData[0]}
//               </div>
//             )}

//             {topicData.slice(1).map((section, index) => (
//               <div
//                 key={index}
//                 className="bg-white border rounded-xl shadow-sm p-4 mb-4"
//               >
//                 <h3 className="text-lg font-semibold text-blue-700 mb-2">
//                   {section.heading}
//                 </h3>
//                 <ul className="list-disc pl-5 space-y-1 text-gray-800">
//                   {section.points?.map((point, i) => (
//                     <li key={i}>{point}</li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </>
//         )}

//         <div className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-4 mt-6">
//           <button
//             onClick={handlePrevious}
//             disabled={selectedTopicIndex === 0}
//             className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${selectedTopicIndex === 0
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600 text-white shadow"
//               }`}
//           >
//             ⬅ Previous
//           </button>

//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center">
//             <button
//               onClick={handleQuizMe}
//               disabled={loadingQuiz}
//               className={`${loadingQuiz
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-yellow-500 hover:bg-yellow-600'
//                 } text-white px-6 py-2 rounded-md w-full`}
//             >
//               {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
//             </button>
//             <button
//               onClick={handleAskMe}
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow transition w-full"
//             >
//               Ask Me
//             </button>
//           </div>

//           <button
//             onClick={handleNext}
//             disabled={selectedTopicIndex === topicKeys.length - 1}
//             className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${selectedTopicIndex === topicKeys.length - 1
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-green-500 hover:bg-green-600 text-white shadow"
//               }`}
//           >
//             Next ➡
//           </button>
//         </div>
//       </>
//     )}
//   </div>
// );

// };

// export default Saved;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BookOpen, Trash2, ChevronRight, Loader2 } from "lucide-react";
import { getAuthHeaders } from "../utils/authHeader";
const Backend_url = import.meta.env.VITE_BACKEND_URL;

const Saved = () => {
  const [topics, setTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  const topicKeys = Object.keys(topics);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not logged in");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${Backend_url}/api/getTopics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTopics(response.data.topics || {});
      } catch (error) {
        console.error("Error fetching saved topics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  const handleTopicClick = (topicName) => {
    const topicData = topics[topicName];
    const definition = typeof topicData[0] === "string" ? topicData[0] : "";

    navigate("/saved/view", {
      state: {
        topic: topicName,
        definition,
        sections: topicData.slice(1),
        allTopics: topicKeys,
        currentIndex: topicKeys.indexOf(topicName),
      },
    });
  };

  const handleDeleteTopic = async (topicName) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.delete(`${Backend_url}/api/deleteTopic/${topicName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newTopics = { ...topics };
      delete newTopics[topicName];
      setTopics(newTopics);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert("Failed to delete topic");
    }
  };

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Saved Topics</h1>
          <p className="text-gray-600">Your collection of saved flashcards</p>
        </div>

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Delete Topic</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this topic? This action cannot be undone.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium text-gray-900">{deleteConfirm}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteTopic(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : topicKeys.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <BookOpen className="w-16 h-16" />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">No saved topics</h3>
              <p className="text-gray-400 text-center mb-4">
                Start creating flashcards to save them here
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Flashcards
              </button>
            </div>
          ) : (
            topicKeys.map((topicName, index) => {
              const topicData = topics[topicName];
              const definition = typeof topicData[0] === "string" ? topicData[0] : "";
              const sectionCount = topicData.slice(1).length;

              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-blue-600">
                        <BookOpen className="w-5 h-5 flex-shrink-0" />
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {topicName}
                        </h3>
                      </div>
                    </div>

                    {definition && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                        {truncateText(definition, 100)}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                        {sectionCount} {sectionCount === 1 ? "section" : "sections"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTopicClick(topicName)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(topicName);
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Saved;