import { useState, useRef, useCallback, useEffect } from "react";
import { AppState } from "react-native";

export default function useTimer(initialTime) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isTimeRunning, setIsTimeRunning] = useState(false);
  const startTimeRef = useRef(null);
  const intervalIdRef = useRef(null);
  const accumulatedTimeRef = useRef(0);
  const appState = useRef(AppState.currentState);

  const startTimer = useCallback(() => {
    if (isTimeRunning) return;

    setIsTimeRunning(true);
    startTimeRef.current = Date.now();
    intervalIdRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedTime = (now - startTimeRef.current) / 1000 + accumulatedTimeRef.current;
      const newTimeLeft = Math.max(initialTime - elapsedTime, 0);
      setTimeLeft(Math.floor(newTimeLeft));

      if (newTimeLeft === 0) {
        clearInterval(intervalIdRef.current);
        setIsTimeRunning(false);
      }
    }, 100);
  }, [isTimeRunning, initialTime]);

  const stopTimer = useCallback(() => {
    if (!isTimeRunning) return;

    clearInterval(intervalIdRef.current);
    accumulatedTimeRef.current += (Date.now() - startTimeRef.current) / 1000;
    setIsTimeRunning(false);
  }, [isTimeRunning]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalIdRef.current);
    accumulatedTimeRef.current = 0;
    setTimeLeft(initialTime);
    setIsTimeRunning(false);
    startTimer();
  }, [initialTime, startTimer]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        if (isTimeRunning) {
          stopTimer();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        if (isTimeRunning) {
          startTimer();
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [isTimeRunning, startTimer, stopTimer]);

  return { timeLeft, setTimeLeft, startTimer, stopTimer, resetTimer };
}
