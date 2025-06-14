import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function FocusMode() {
  const { state, dispatch } = useContext(TimerContext);
  const { currentMode } = state;

  return (
    <div className="focus-mode">
      <button
        className={`focus-btn ${currentMode === "focus" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "focus" })}
      >
        Focus
      </button>
      <button
        className={`short-brake-btn ${currentMode === "short" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "short" })}
      >
        Short Break
      </button>
      <button
        className={`long-brake-btn ${currentMode === "long" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "long" })}
      >
        Long Break
      </button>
    </div>
  );
}
