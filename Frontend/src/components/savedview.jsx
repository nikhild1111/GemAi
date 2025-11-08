import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import axios from "axios";
const Backend_url = import.meta.env.VITE_BACKEND_URL;

const SavedView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, definition, sections, allTopics, currentIndex } = location.state || {};

  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(currentIndex);

  if (!topic) {
    navigate("/saved");
    return null;
  }

  const handleQuizMe = async () => {
    setLoadingQuiz(true);
    try {
      const response = await axios.post(`${Backend_url}/api/quiz`, {
        topic,
        definition,
      });

      const quizData = response.data.quiz;
      navigate("/quiz", { state: { topic, quizData } });
    } catch (error) {
      console.error("Quiz generation failed:", error);
      alert("Failed to generate quiz");
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleAskMe = () => {
    navigate("/ask");
  };

  const handlePrevious = () => {
    if (currentTopicIndex > 0) {
      const prevTopic = allTopics[currentTopicIndex - 1];
      navigate(`/saved/view`, {
        state: {
          topic: prevTopic,
          allTopics,
          currentIndex: currentTopicIndex - 1,
        },
      });
    }
  };

  const handleNext = () => {
    if (currentTopicIndex < allTopics.length - 1) {
      const nextTopic = allTopics[currentTopicIndex + 1];
      navigate(`/saved/view`, {
        state: {
          topic: nextTopic,
          allTopics,
          currentIndex: currentTopicIndex + 1,
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => navigate("/saved")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Saved Topics
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
            {topic}
          </h1>

          {definition && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-6 mb-8 rounded-lg shadow-sm">
              <strong className="font-semibold text-lg">Definition</strong>
              <p className="mt-2 text-gray-700 leading-relaxed">{definition}</p>
            </div>
          )}

          <div className="space-y-6 mb-10">
            {sections?.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-blue-800 mb-4">
                  {section.heading}
                </h2>
                <ul className="space-y-3 text-gray-700">
                  {section.points?.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleQuizMe}
              disabled={loadingQuiz}
              className={`${
                loadingQuiz ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2`}
            >
              {loadingQuiz && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loadingQuiz ? "Generating Quiz..." : "Quiz Me"}
            </button>
            <button
              onClick={handleAskMe}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
              Ask Me
            </button>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentTopicIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentTopicIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <span className="text-gray-600 font-medium">
              {currentTopicIndex + 1} / {allTopics.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentTopicIndex === allTopics.length - 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentTopicIndex === allTopics.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md"
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedView;