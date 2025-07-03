import { useContext, useEffect, useState } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function TimerDisplay() {
  const { state } = useContext(TimerContext);
  const { timeLeft, timerRunning, currentMode } = state;
  const [announceTime, setAnnounceTime] = useState(timeLeft);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  useEffect(() => {
    if (timerRunning) {
      // Set dynamic title when timer is running
      const message =
        currentMode === "focus" ? "Time to focus!" : "Time for a break!";
      document.title = `${minutes}:${seconds} - ${message}`;
    } else {
      // Set static title when timer is not running
      document.title = "Focus Timer";
    }
  }, [timerRunning, timeLeft, currentMode, minutes, seconds]);

  useEffect(() => {
    if (timeLeft % 10 === 0) {
      setAnnounceTime(timeLeft);
    }
  }, [timeLeft]);

  return (
    <div className="timer-display">
      <time
        aria-live="polite"
        aria-label={`Time remaining: ${minutes} minutes ${seconds} seconds`}
      >
        <span className="minutes">{minutes}:</span>
        <span className="seconds">{seconds}</span>
      </time>
      <span className="sr-only" aria-live="polite">
        {announceTime === timeLeft && `Time remaining: ${minutes}:${seconds}`}
      </span>
    </div>
  );
}
