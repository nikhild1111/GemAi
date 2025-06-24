import React, { useState, useRef, useEffect } from 'react';

const VoiceQnA = ({ question, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setAnswer(result);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const handleVoice = () => {
    recognitionRef.current && recognitionRef.current.start();
  };

  return (
    <div>
      <p>{question}</p>
      <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={3} />
      <br />
      <button onClick={handleVoice}>🎤 Start Voice</button>
      <button onClick={() => onSubmit(answer)}>Submit</button>
    </div>
  );
};

export default VoiceQnA;