import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function TimerDisplay() {
  const { state } = useContext(TimerContext);
  const { timeLeft } = state;

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  return (
    <div className="timer-display">
      <div className="minutes">{minutes}:</div>
      <div className="minutes">{seconds}</div>
    </div>
  );
}
