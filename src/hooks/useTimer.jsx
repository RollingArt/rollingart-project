import { useState, useRef, useCallback } from "react";

export default function useTimer(initialTime) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const intervalTimeRef = useRef(null);

  const startTimer = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    startTimeRef.current = Date.now();
    intervalTimeRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000 + accumulatedTimeRef.current;
      const newTimeLeft = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(Math.floor(newTimeLeft));

      if (newTimeLeft === 0) {
        clearInterval(intervalTimeRef.current);
        setIsRunning(false);
      }
    }, 100);
  }, [isRunning, initialTime]);

  const stopTimer = useCallback(() => {
    if (!isRunning) return;

    clearInterval(intervalTimeRef.current);
    accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
    setIsRunning(false);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalTimeRef.current);
    accumulatedTimeRef.current = 0;
    setTimeLeft(initialTime);
    setIsRunning(false);
    startTimer();
  }, [initialTime, startTimer]);

  return { timeLeft, isRunning, startTimer, stopTimer, resetTimer };
}
