import { useContext, useEffect, useState } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function TimerDisplay() {
  const { state } = useContext(TimerContext);
  const { timeLeft } = state;
  const [announceTime, setAnnounceTime] = useState(timeLeft);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  useEffect(() => {
    if (timeLeft % 10 === 0) {
      setAnnounceTime(timeLeft);
    }
  }, [timeLeft]);

  return (
    <div className="timer-display">
      <time aria-live="polite" aria-label={`Time remaining: ${minutes} minutes ${seconds} seconds`}>
        <span className="minutes">{minutes}:</span>
        <span className="seconds">{seconds}</span>
      </time>
      <span className="sr-only" aria-live="polite">
        {announceTime === timeLeft && `Time remaining: ${minutes}:${seconds}`}
      </span>
    </div>
  );
}