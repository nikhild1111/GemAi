
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, quizData } = location.state;
// console.log(quizData);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const parseQuizData = () => {
        const blocks = quizData
          .split(/Q\d+:/)
          .map(b => b.trim())
          .filter(Boolean);
      
        const parsed = blocks.map((block) => {
          // Separate the Answer line from the rest
          const [mainPart, answerLine] = block.split(/Answer:\s*/i);
          const questionMatch = mainPart.match(/^(.*?)\s*A\./s);
          const question = questionMatch ? questionMatch[1].trim() : "";
      
          const optionsMatch = [...mainPart.matchAll(/([A-D])\.\s(.*?)(?=(?:\n[A-D]\.|$))/gs)];
          const options = optionsMatch.map(([, , option]) => option.trim());
      
          const answerLetter = answerLine?.trim()?.[0];
          const correctIndex = "ABCD".indexOf(answerLetter);
          const answer = options[correctIndex];
      
          return {
            question,
            options,
            answer,
          };
        });
      
        setQuestions(parsed);
      };
      

    parseQuizData();
  }, [quizData]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [currentQ]: option,
    }));
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowScore(true);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      return selectedOptions[idx] === q.answer ? score + 1 : score;
    }, 0);
  };

  const handleAsk = () => navigate("/ask");
  const handleSaved = () => navigate("/saved");

  if (questions.length === 0) {
    return <p className="p-4 text-red-500">⚠️ Invalid or empty quiz data.</p>;
  }

  const currentQuestion = questions[currentQ];
  const selected = selectedOptions[currentQ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto text-white">
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 text-center">
          Quiz on:
        </h2>
        <h2 className="text-2xl sm:text-3xl font-bold text-black text-center">
          {topic}
        </h2>
      </div>
  
      {!showScore ? (
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <p className="text-base sm:text-lg font-semibold mb-4">
            Q{currentQ + 1}: {currentQuestion.question}
          </p>
  
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              const isCorrect = option === currentQuestion.answer;
              const isSelected = option === selected;
              let bg = "bg-gray-700 hover:bg-gray-600";
  
              if (selected) {
                if (isCorrect) bg = "bg-green-600 text-white";
                else if (isSelected) bg = "bg-red-600 text-white";
              }
  
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`block w-full text-left px-4 py-2 rounded transition duration-200 ease-in-out ${bg}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
  
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={handlePrev}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white disabled:opacity-50"
              disabled={currentQ === 0}
            >
              Previous
            </button>
  
            <button
              onClick={handleNext}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
            >
              {currentQ === questions.length - 1 ? "Show Score" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400">
            🎉 Quiz Completed!
          </h2>
          <p className="text-lg sm:text-xl">
            Your Score: <span className="font-bold">{calculateScore()}</span> / {questions.length}
          </p>
  
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
            <button
              onClick={handleAsk}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Ask Me
            </button>
            <button
              onClick={handleSaved}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Saved
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Quiz;
