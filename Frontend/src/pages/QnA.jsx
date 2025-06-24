
// === QnA.jsx ===
import React, { useState } from 'react';
import VoiceQnA from '../components/VoiceQnA';
import Timer from '../components/Timer';
import { saveSession, downloadPDF } from '../utils/reportUtils';

const QnA = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const handleAnswerSubmit = (answer) => {
    const updated = [...answers, { question: questions[current], answer }];
    setAnswers(updated);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setSessionComplete(true);
      saveSession(updated);
    }
  };

  const handleTimeUp = () => {
    setSessionComplete(true);
    saveSession(answers);
  };

  return (
    <div>
      <Timer duration={300} onEnd={handleTimeUp} />
      {!sessionComplete ? (
        <VoiceQnA
          question={questions[current]}
          onSubmit={handleAnswerSubmit}
        />
      ) : (
        <div>
          <h2>Session Complete</h2>
          <button onClick={() => downloadPDF(answers)}>Download Report</button>
        </div>
      )}
    </div>
  );
};

export default QnA;
