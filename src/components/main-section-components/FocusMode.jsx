import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function FocusMode() {
  const { state, dispatch } = useContext(TimerContext);
  const { currentMode } = state;

  return (
    <div className="focus-mode" role="tablist">
      <button
        className={`focus-btn ${currentMode === "focus" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "focus" })}
        aria-label="Switch to Focus mode"
        aria-current={currentMode === "focus" ? "true" : "false"}
        role="tab"
      >
        Focus
      </button>
      <button
        className={`short-brake-btn ${currentMode === "short" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "short" })}
        aria-label="Switch to Short Break mode"
        aria-current={currentMode === "short" ? "true" : "false"}
        role="tab"
      >
        Short Break
      </button>
      <button
        className={`long-brake-btn ${currentMode === "long" ? "active" : ""}`}
        onClick={() => dispatch({ type: "SET_MODE", payload: "long" })}
        aria-label="Switch to Long Break mode"
        aria-current={currentMode === "long" ? "true" : "false"}
        role="tab"
      >
        Long Break
      </button>
    </div>
  );
}
