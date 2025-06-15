import { FaClock, FaX } from "react-icons/fa6";
import { MdVolumeUp } from "react-icons/md";
import { useContext, useState, useEffect, useRef } from "react";
import { TimerContext } from "../context/TimerContext";

export default function Setting({ onClose }) {
  const { state, dispatch } = useContext(TimerContext);
  const [autoStartBreaks, setAutoStartBreaks] = useState(state.autoStartBreaks);
  const [autoStartFocus, setAutoStartFocus] = useState(state.autoStartFocus);
  const [soundEnabled, setSoundEnabled] = useState(state.soundEnabled);
  const [soundFile, setSoundFile] = useState(state.soundFile || "notification");
  const [volume, setVolume] = useState(state.volume);
  const [soundRepeat, setSoundRepeat] = useState(state.soundRepeat);
  const [focus, setFocus] = useState(state.focusLength);
  const [shortBreak, setShortBreak] = useState(state.shortBreakLength);
  const [longBreak, setLongBreak] = useState(state.longBreakLength);
  const [repeatError, setRepeatError] = useState("");
  const formRef = useRef(null);
  const firstFocusableRef = useRef(null);

  useEffect(() => {
    setFocus(state.focusLength);
    setShortBreak(state.shortBreakLength);
    setLongBreak(state.longBreakLength);
    setAutoStartBreaks(state.autoStartBreaks);
    setAutoStartFocus(state.autoStartFocus);
    setSoundEnabled(state.soundEnabled);
    setSoundFile(state.soundFile || "notification");
    setVolume(state.volume);
    setSoundRepeat(state.soundRepeat);
  }, [
    state.focusLength,
    state.shortBreakLength,
    state.longBreakLength,
    state.autoStartBreaks,
    state.autoStartFocus,
    state.soundEnabled,
    state.soundFile,
    state.volume,
    state.soundRepeat,
  ]);

  // Focus trapping
  useEffect(() => {
    const form = formRef.current;
    const focusableElements = form.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstFocusableRef.current = firstElement;

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    form.addEventListener("keydown", handleKeyDown);
    firstElement.focus();

    return () => form.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedRepeat = Math.max(1, Math.min(3, Number(soundRepeat)));
    if (Number(soundRepeat) !== validatedRepeat) {
      setRepeatError("Sound repeat must be between 1 and 3.");
      return;
    }
    setRepeatError("");
    dispatch({
      type: "UPDATE_SETTING",
      payload: {
        focusLength: focus,
        shortBreakLength: shortBreak,
        longBreakLength: longBreak,
        autoStartBreaks,
        autoStartFocus,
        soundEnabled,
        soundFile: soundEnabled ? soundFile : "",
        volume,
        soundRepeat: validatedRepeat,
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
    dispatch({
      type: "UPDATE_SOUND_SETTINGS",
      payload: {
        soundEnabled,
        soundFile: soundEnabled ? soundFile : "",
        volume,
        soundRepeat: validatedRepeat,
      },
    });
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={formRef}
      role="dialog"
      aria-labelledby="setting-title"
    >
      <h2 className="form-title" id="setting-title">
        Settings
        <button
          className="close-icon"
          onClick={onClose}
          aria-label="Close settings"
        >
          <FaX />
        </button>
      </h2>
      <div aria-live="polite" className="sr-only">
        {repeatError || "Settings updated successfully"}
      </div>
      <h3 className="form-sub-title">
        <FaClock /> Timer (minutes)
      </h3>
      <div className="duration-input-container">
        <div className="duration-input-card">
          <label htmlFor="focus-duration">Focus</label>
          <input
            type="number"
            id="focus-duration"
            value={focus}
            onChange={(e) => setFocus(Number(e.target.value))}
            min={1}
            aria-describedby="focus-desc"
          />
          <span id="focus-desc" className="sr-only">
            Focus session duration in minutes
          </span>
        </div>
        <div className="duration-input-card">
          <label htmlFor="short-break-duration">Short Break</label>
          <input
            type="number"
            id="short-break-duration"
            value={shortBreak}
            onChange={(e) => setShortBreak(Number(e.target.value))}
            min={1}
            aria-describedby="short-break-desc"
          />
          <span id="short-break-desc" className="sr-only">
            Short break duration in minutes
          </span>
        </div>
        <div className="duration-input-card">
          <label htmlFor="long-break-duration">Long Break</label>
          <input
            type="number"
            id="long-break-duration"
            value={longBreak}
            onChange={(e) => setLongBreak(Number(e.target.value))}
            min={1}
            aria-describedby="long-break-desc"
          />
          <span id="long-break-desc" className="sr-only">
            Long break duration in minutes
          </span>
        </div>
      </div>
      <div className="checkbox-container">
        <label htmlFor="auto-start-focus">Auto Start Focus:</label>
        <input
          type="checkbox"
          id="auto-start-focus"
          checked={autoStartFocus}
          onChange={(e) => setAutoStartFocus(e.target.checked)}
          aria-describedby="auto-focus-desc"
        />
        <span id="auto-focus-desc" className="sr-only">
          Automatically start focus sessions
        </span>
      </div>
      <div className="checkbox-container">
        <label htmlFor="auto-start-breaks">Auto Start Breaks:</label>
        <input
          type="checkbox"
          id="auto-start-breaks"
          checked={autoStartBreaks}
          onChange={(e) => setAutoStartBreaks(e.target.checked)}
          aria-describedby="auto-breaks-desc"
        />
        <span id="auto-breaks-desc" className="sr-only">
          Automatically start break sessions
        </span>
      </div>
      <h3 className="form-sub-title">
        <MdVolumeUp /> Sound
      </h3>
      <div className="checkbox-container">
        <label htmlFor="sound-enabled">Enable Sound Effects:</label>
        <input
          type="checkbox"
          id="sound-enabled"
          checked={soundEnabled}
          onChange={(e) => setSoundEnabled(e.target.checked)}
          aria-describedby="sound-enabled-desc"
        />
        <span id="sound-enabled-desc" className="sr-only">
          Toggle sound effects on or off
        </span>
      </div>
      <div className="checkbox-container">
        <label htmlFor="sound-select">Alarm Sound:</label>
        <div className="select-wrapper">
          <select
            id="sound-select"
            value={soundFile}
            onChange={(e) => setSoundFile(e.target.value)}
            disabled={!soundEnabled || state.timerRunning}
            aria-describedby={
              !soundEnabled || state.timerRunning
                ? "sound-disabled-desc"
                : undefined
            }
          >
            <option value="notification">Notification</option>
            <option value="birds">Birds</option>
            <option value="bell">Bell</option>
          </select>
          {(!soundEnabled || state.timerRunning) && (
            <span id="sound-disabled-desc" className="sr-only">
              {soundEnabled
                ? "Sound selection is disabled while timer is running"
                : "Sound selection is disabled because sound effects are turned off"}
            </span>
          )}
        </div>
      </div>
      <div className="checkbox-container">
        <label htmlFor="volume">Volume:</label>
        <input
          type="range"
          id="volume"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          min={0}
          max={100}
          step={1}
          disabled={!soundEnabled}
          aria-valuenow={volume}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-describedby="volume-desc"
        />
        <span id="volume-desc" className="sr-only">
          Volume level: {volume}%
        </span>
      </div>
      <div className="checkbox-container">
        <label htmlFor="sound-repeat">Sound Repeat (1-3):</label>
        <input
          type="number"
          id="sound-repeat"
          value={soundRepeat}
          onChange={(e) => setSoundRepeat(Number(e.target.value))}
          min={1}
          max={3}
          step={1}
          disabled={!soundEnabled}
          aria-describedby="repeat-desc"
        />
        <span id="repeat-desc" className="sr-only">
          Number of times to repeat sound (1 to 3)
        </span>
        {repeatError && (
          <span className="error" aria-live="assertive">
            {repeatError}
          </span>
        )}
      </div>
      <div className="form-btn-container">
        <button type="submit" aria-label="Save settings">
          OK
        </button>
      </div>
    </form>
  );
}
