import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function FocusMode() {
  const { dispatch } = useContext(TimerContext);
  return (
    <div className="focus-mode">
      <button
        className="focus-btn"
        onClick={() => dispatch({ type: "SET_MODE", payload: "focus" })}
      >
        Focus
      </button>
      <button
        className="short-brake-btn"
        onClick={() => dispatch({ type: "SET_MODE", payload: "short" })}
      >
        Short Break
      </button>
      <button
        className="long-brake-btn"
        onClick={() => dispatch({ type: "SET_MODE", payload: "long" })}
      >
        Long Break
      </button>
    </div>
  );
}
