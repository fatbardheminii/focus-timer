import { useContext, useState, useEffect } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function FocusStatus() {
  const { state } = useContext(TimerContext);
  const { currentMode, focusCount } = state;
  const message =
    currentMode === "focus" ? "Time to focus!" : "Time for a break!";
  const [isSessionEnd, setIsSessionEnd] = useState(false);

  useEffect(() => {
    setIsSessionEnd(true);
    const timeout = setTimeout(() => setIsSessionEnd(false), 1000);
    return () => clearTimeout(timeout);
  }, [currentMode]);

  return (
    <div className={`focus-status ${isSessionEnd ? "session-end" : ""}`}>
      <div className="focus-count">#{focusCount}</div>
      <div className="focus-message">{message}</div>
    </div>
  );
}
