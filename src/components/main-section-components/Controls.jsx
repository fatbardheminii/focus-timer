import { useContext, useRef, useEffect } from "react";
import { TimerContext } from "../../context/TimerContext";
import { FaStepForward, FaRedo } from "react-icons/fa";

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

  const handleStartPause = () => {
    dispatch({ type: state.timerRunning ? "PAUSE" : "START" });
  };

  return (
    <div className="controls">
      <button
        className={`main-btn ${state.timerRunning ? "pause" : "start"}`}
        onClick={handleStartPause}
      >
        {state.timerRunning ? "Pause" : "Start"}
      </button>

      {state.timerRunning && (
        <>
          <button
            className="icon-button skip-btn"
            onClick={() => dispatch({ type: "SKIP" })}
          >
            <FaStepForward />
            <span className="tooltip">Skip Session</span>
          </button>

          <button
            className="icon-button reset-btn"
            onClick={() => dispatch({ type: "RESET" })}
          >
            <FaRedo />
            <span className="tooltip">Reset Timer</span>
          </button>
        </>
      )}
    </div>
  );
}
