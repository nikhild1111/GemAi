// === Timer.jsx ===
import React, { useEffect, useState } from 'react';

const Timer = ({ duration, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEnd();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return <p>Time left: {timeLeft}s</p>;
};

export default Timer;