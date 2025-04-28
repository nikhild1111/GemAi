
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
