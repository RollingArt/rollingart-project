import { useState, useRef, useCallback } from "react";

export default function useTimer(initialTime) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const startTimeRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const intervalTimeRef = useRef(null);

  const startTimer = useCallback(() => {
    if (isTimeRunning) return;

    setIsTimeRunning(true);
    startTimeRef.current = Date.now();
    intervalTimeRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000 + accumulatedTimeRef.current;
      const newTimeLeft = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(Math.floor(newTimeLeft));

      if (newTimeLeft === 0) {
        clearInterval(intervalTimeRef.current);
        setIsTimeRunning(false);
      }
    }, 100);
  }, [isTimeRunning, initialTime]);

  const stopTimer = useCallback(() => {
    if (!isTimeRunning) return;

    clearInterval(intervalTimeRef.current);
    accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
    setIsTimeRunning(false);
  }, [isTimeRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalTimeRef.current);
    accumulatedTimeRef.current = 0;
    setTimeLeft(initialTime);
    setIsTimeRunning(false);
    startTimer();
  }, [initialTime, startTimer]);

  return { timeLeft, isTimeRunning, startTimer, stopTimer, resetTimer };
}
