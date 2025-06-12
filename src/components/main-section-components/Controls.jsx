import { useContext, useRef, useEffect } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function Controls() {
  const { state, dispatch } = useContext(TimerContext);

  const intervalRef = useRef();

  useEffect(() => {
    if (state.timerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [state.timerRunning, dispatch]);

  useEffect(() => {
    if (state.timeLeft === 0) {
      dispatch({ type: "TIMEOVER" });
    }
  }, [state.timeLeft, dispatch]);

  return (
    <div className="controls">
      <button className="start-btn" onClick={() => dispatch({ type: "START" })}>
        Start
      </button>
      <button className="pause-btn" onClick={() => dispatch({ type: "PAUSE" })}>
        Pause
      </button>
      <button className="reset-btn" onClick={() => dispatch({ type: "RESET" })}>
        Reset
      </button>
    </div>
  );
}
