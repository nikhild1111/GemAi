// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Card from "../components/Card";

// const Saved = () => {
//   const [topics, setTopics] = useState({});
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ You are not logged in.");

//         const response = await axios.get("http://localhost:3000/api/getTopics", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setTopics(response.data.topics || {});
//       } catch (error) {
//         console.error("Error fetching saved topics:", error);
//       }
//     };

//     fetchTopics();
//   }, []);

//   const handleNext = () => {
//     if (currentCardIndex < topics[selectedTopic].length - 1) {
//       setCurrentCardIndex(prev => prev + 1);
//     }
//   };

//   const handleBack = () => {
//     if (currentCardIndex > 0) {
//       setCurrentCardIndex(prev => prev - 1);
//     }
//   };

//   if (!selectedTopic) {
//     return (
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-4">📚 Saved Topics</h2>
//         <div className="grid gap-3">
//           {Object.keys(topics).map((topic, index) => (
//             <button
//               key={index}
//               className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow hover:bg-blue-200 transition"
//               onClick={() => {
//                 setSelectedTopic(topic);
//                 setCurrentCardIndex(0);
//               }}
//             >
//               {topic}
//             </button>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const cards = topics[selectedTopic] || [];

//   return (
//     <div className="p-6">
//       <button
//         className="mb-4 text-blue-600 underline"
//         onClick={() => setSelectedTopic(null)}
//       >
//         ← Go Back to Topics
//       </button>

//       <h2 className="text-xl font-bold mb-3 text-blue-800">{selectedTopic}</h2>

//       {cards.length > 0 && (
//         <Card card={cards[currentCardIndex]} />
//       )}

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={handleBack}
//           disabled={currentCardIndex === 0}
//           className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
//         >
//           ⬅ Go Back
//         </button>
//         <button
//           onClick={handleNext}
//           disabled={currentCardIndex === cards.length - 1}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
//         >
//           Next ➡
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Saved;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Card from "../components/Card";
// import { useNavigate } from "react-router-dom";

// const Saved = () => {
//   const [topics, setTopics] = useState({});
//   const [selectedTopic, setSelectedTopic] = useState(null);
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const topicKeys = Object.keys(topics);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ You are not logged in.");

//         const response = await axios.get("http://localhost:3000/api/getTopics", {
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

//   const handleNextTopic = () => {
//     const currentIndex = topicKeys.indexOf(selectedTopic);
//     if (currentIndex < topicKeys.length - 1) {
//       const nextTopic = topicKeys[currentIndex + 1];
//       setSelectedTopic(nextTopic);
//       setCurrentCardIndex(0);
//     }
//   };

//   const handlePreviousTopic = () => {
//     const currentIndex = topicKeys.indexOf(selectedTopic);
//     if (currentIndex > 0) {
//       const previousTopic = topicKeys[currentIndex - 1];
//       setSelectedTopic(previousTopic);
//       setCurrentCardIndex(0);
//     }
//   };

//   const handleAskMe = () => {
//     navigate("/ask");
//   };

//   const cards = topics[selectedTopic] || [];

//   return (
//     <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
//       {!selectedTopic ? (
//         <>
//           <h1 className="text-3xl font-semibold text-center mb-6 text-blue-700">
//             📚 Your Saved Topics
//           </h1>
//           {loading ? (
//             <p className="text-center text-gray-500">Loading topics...</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {topicKeys.map((topic, index) => (
//                 <button
//                   key={index}
//                   className="bg-white text-blue-800 px-4 py-3 rounded-xl shadow hover:bg-blue-50 border border-blue-200 transition-all"
//                   onClick={() => {
//                     setSelectedTopic(topic);
//                     setCurrentCardIndex(0);
//                   }}
//                 >
//                   {topic}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         <>
//           <button
//             onClick={() => setSelectedTopic(null)}
//             className="mb-4 text-blue-600 hover:text-blue-800 underline"
//           >
//             ← Back to Saved Topics
//           </button>

//           <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">
//             Topic: <span className="text-black">{selectedTopic}</span>
//           </h2>

//           {cards.length > 0 ? (
//             <>
//               <Card card={cards[currentCardIndex]} />

//               <div className="flex justify-center gap-4 mt-8 flex-wrap">
//                 <button
//                   onClick={handlePreviousTopic}
//                   disabled={topicKeys.indexOf(selectedTopic) === 0}
//                   className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
//                 >
//                   ⬅ Back
//                 </button>

//                 <button
//                   disabled
//                   className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg opacity-70 cursor-not-allowed"
//                 >
//                   🧠 Quiz Me (Coming Soon)
//                 </button>

//                 <button
//                   onClick={handleAskMe}
//                   className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   🤔 Ask Me
//                 </button>

//                 <button
//                   onClick={handleNextTopic}
//                   disabled={topicKeys.indexOf(selectedTopic) === topicKeys.length - 1}
//                   className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 disabled:opacity-50"
//                 >
//                   Next ➡
//                 </button>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-gray-600">No cards found for this topic.</p>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Saved;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Saved = () => {
//   const [topics, setTopics] = useState({});
//   const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const topicKeys = Object.keys(topics);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return alert("⚠️ You are not logged in.");

//         const response = await axios.get("http://localhost:3000/api/getTopics", {
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

//   const handleQuizMe = () => {
//     alert("🧠 Quiz feature coming soon!");
//   };

//   const selectedTopic = topicKeys[selectedTopicIndex];
//   const topicData = topics[selectedTopic];
//   // const  [definition, subtopics]=topicData;
//   console.log(topicData);

//   return (
//     <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
//       {selectedTopicIndex === null ? (
//         <>
//           <h1 className="text-3xl font-semibold text-center mb-6 text-blue-700">
//             📚 Your Saved Topics
//           </h1>
//           {loading ? (
//             <p className="text-center text-gray-500">Loading topics...</p>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {topicKeys.map((topic, index) => (
//                 <button
//                   key={index}
//                   className="bg-white text-blue-800 px-4 py-3 rounded-xl shadow hover:bg-blue-50 border border-blue-200 transition-all"
//                   onClick={() => handleTopicClick(index)}
//                 >
//                   {topic}
//                 </button>
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         <>
//           <button
//             onClick={handleBackToTopics}
//             className="mb-4 text-blue-600 hover:text-blue-800 underline"
//           >
//             ← Back to Saved Topics
//           </button>

//           <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
//             Topic: <span className="text-black">{selectedTopic}</span>
//           </h2>

//           {/* <div className="bg-yellow-100 p-4 rounded-md mb-6 border-l-4 border-yellow-500">
//             <strong>Definition:</strong> {topicData.definition}
//           </div>

//           {topicData.points?.map((section, index) => (
//             <div
//               key={index}
//               className="bg-white border rounded-xl shadow-sm p-4 mb-4"
//             >
//               <h3 className="text-lg font-semibold text-blue-700 mb-2">
//                 {section.heading}
//               </h3>
//               <ul className="list-disc pl-5 space-y-1 text-gray-800">
//                 {section.bullets.map((point, i) => (
//                   <li key={i}>{point}</li>
//                 ))}
//               </ul>
//             </div>
//           ))} */}

//           <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
//             <button
//               onClick={handlePrevious}
//               disabled={selectedTopicIndex === 0}
//               className={`px-4 py-2 rounded-lg ${
//                 selectedTopicIndex === 0
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-gray-300 hover:bg-gray-400"
//               }`}
//             >
//               ⬅ Previous
//             </button>

//             <div className="flex gap-2">
//               <button
//                 onClick={handleQuizMe}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//               >
//                 Quiz Me
//               </button>
//               <button
//                 onClick={handleAskMe}
//                 className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Ask Me
//               </button>
//             </div>

//             <button
//               onClick={handleNext}
//               disabled={selectedTopicIndex === topicKeys.length - 1}
//               className={`px-4 py-2 rounded-lg ${
//                 selectedTopicIndex === topicKeys.length - 1
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               Next ➡
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Saved;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  let [topic, setTopic] = useState({});
  let [definition, setDefinition] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);  // Track quiz loading state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const topicKeys = Object.keys(topics);


  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return alert("⚠️ You are not logged in.");

        const response = await axios.get("http://localhost:3000/api/getTopics", {
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

  const handleTopicClick = (index) => {
    setSelectedTopicIndex(index);
  };

  const handleBackToTopics = () => {
    setSelectedTopicIndex(null);
  };

  const handleNext = () => {
    if (selectedTopicIndex < topicKeys.length - 1) {
      setSelectedTopicIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedTopicIndex > 0) {
      setSelectedTopicIndex((prev) => prev - 1);
    }
  };

  const handleAskMe = () => {
    navigate("/ask");
  };

  const handleQuizMe = async () => {
    setLoadingQuiz(true);  // Set loading state to true when quiz is being fetched



    try {
      const response = await axios.post("http://localhost:3000/api/quiz", {
        topic:selectedTopic,
        definition:topicData[0],
      });

      const quizData = response.data.quiz;

      // ✅ Navigate and pass quizData
      navigate("/quiz", { state: { topic, quizData } });

      setLoadingQuiz(false);  // Reset loading state after navigating
    } catch (error) {
      console.error("Quiz generation failed:", error);
      alert("❌ Failed to generate quiz");
      setLoadingQuiz(false);  // Reset loading state in case of an error
    }
  };

  const selectedTopic = topicKeys[selectedTopicIndex];
  const topicData = topics[selectedTopic];

if(selectedTopicIndex !== null){
    topic=selectedTopic;
    if(typeof topicData[0] === "string"){
     definition=topicData[0];
    }
     
}
 

return (
  <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
    {selectedTopicIndex === null ? (
      <>
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-blue-700">
          📚 Your Saved Topics
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading topics...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topicKeys.map((topic, index) => (
              <button
                key={index}
                className="bg-white w-full text-blue-800 px-4 py-3 rounded-xl shadow hover:bg-blue-50 border border-blue-200 transition-all text-center"
                onClick={() => handleTopicClick(index)}
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </>
    ) : (
      <>
        <button
          onClick={handleBackToTopics}
          className="mb-4 text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Saved Topics
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-2 break-words">
          Topic: <span className="text-black">{selectedTopic}</span>
        </h2>

        {topicData && (
          <>
            {typeof topicData[0] === "string" && (
              <div className="bg-yellow-100 p-4 rounded-md mb-6 border-l-4 border-yellow-500 text-yellow-900">
                <strong>Definition:</strong> {topicData[0]}
              </div>
            )}

            {topicData.slice(1).map((section, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl shadow-sm p-4 mb-4"
              >
                <h3 className="text-lg font-semibold text-blue-700 mb-2">
                  {section.heading}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-800">
                  {section.points?.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between items-stretch gap-4 mt-6">
          <button
            onClick={handlePrevious}
            disabled={selectedTopicIndex === 0}
            className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${selectedTopicIndex === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow"
              }`}
          >
            ⬅ Previous
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:justify-center">
            <button
              onClick={handleQuizMe}
              disabled={loadingQuiz}
              className={`${loadingQuiz
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600'
                } text-white px-6 py-2 rounded-md w-full`}
            >
              {loadingQuiz ? 'Generating Quiz...' : 'Quiz Me'}
            </button>
            <button
              onClick={handleAskMe}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md shadow transition w-full"
            >
              Ask Me
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={selectedTopicIndex === topicKeys.length - 1}
            className={`w-full sm:w-auto px-4 py-2 rounded-md font-medium transition ${selectedTopicIndex === topicKeys.length - 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow"
              }`}
          >
            Next ➡
          </button>
        </div>
      </>
    )}
  </div>
);

};

export default Saved;
