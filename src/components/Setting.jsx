import { FaClock, FaX } from "react-icons/fa6";
import { useContext, useState, useEffect } from "react";
import { TimerContext } from "../context/TimerContext";

export default function Setting({ onClose }) {
  const { state, dispatch } = useContext(TimerContext);
  const [autoStartBreaks, setAutoStartBreaks] = useState(state.autoStart);
  const [autoStartFocus, setAutoStartFocus] = useState(state.autoStart);

  // Make sure keys exactly match the reducer state keys!
  const [focus, setFocus] = useState(state.focusLength);
  const [shortBreak, setShortBreak] = useState(state.shortBreakLength);
  const [longBreak, setLongBreak] = useState(state.longBreakLength);

  // Sync local state with global state when modal opens or global values change
  useEffect(() => {
    setFocus(state.focusLength);
    setShortBreak(state.shortBreakLength);
    setLongBreak(state.longBreakLength);
    setAutoStartBreaks(state.autoStartBreaks);
    setAutoStartFocus(state.autoStartFocus);
  }, [state.focusLength, state.shortBreakLength, state.longBreakLength, state.autoStartBreaks, state.autoStartFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({
      type: "UPDATE_SETTING",
      payload: {
        focusLength: focus,
        shortBreakLength: shortBreak,
        longBreakLength: longBreak,
        autoStartBreaks,
        autoStartFocus,
      },
    });

    dispatch({
      type: "UPDATE_AUTOSTART_FOCUS",
      payload: autoStartFocus,
    });

    dispatch({
      type: "UPDATE_AUTOSTART_BREAKS",
      payload: autoStartBreaks,
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="form-title">
        Setting
        <span className="close-icon" onClick={onClose}>
          <FaX />
        </span>
      </h2>
      <h3 className="form-sub-title">
        <FaClock /> Focus Timer
      </h3>
      <div className="auto-start-container">
        <label htmlFor="auto-start-focus">Auto Start Focus:</label>
        <input
          type="checkbox"
          id="auto-start-focus"
          checked={autoStartFocus}
          onChange={(e) => setAutoStartFocus(e.target.checked)}
        />
      </div>

      <div className="auto-start-container">
        <label htmlFor="auto-start-breaks">Auto Start Breaks:</label>
        <input
          type="checkbox"
          id="auto-start-breaks"
          checked={autoStartBreaks}
          onChange={(e) => setAutoStartBreaks(e.target.checked)}
        />
      </div>
      <div className="duration-input-container">
        <div className="duration-input-card">
          <label htmlFor="focus-duration">Focus</label>
          <input
            type="number"
            id="focus-duration"
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="duration-input-card">
          <label htmlFor="short-break-duration">Short Break</label>
          <input
            type="number"
            id="short-break-duration"
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            min={1}
          />
        </div>
        <div className="duration-input-card">
          <label htmlFor="long-break-duration">Long Break</label>
          <input
            type="number"
            id="long-break-duration"
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            min={1}
          />
        </div>
      </div>
      <div className="form-btn-container">
        <button type="submit">OK</button>
      </div>
    </form>
  );
}
