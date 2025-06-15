import { FaClock, FaX } from "react-icons/fa6";
import { MdVolumeUp } from "react-icons/md";
import { useContext, useState, useEffect } from "react";
import { TimerContext } from "../context/TimerContext";

export default function Setting({ onClose }) {
  const { state, dispatch } = useContext(TimerContext);
  const [autoStartBreaks, setAutoStartBreaks] = useState(state.autoStartBreaks);
  const [autoStartFocus, setAutoStartFocus] = useState(state.autoStartFocus);
  const [soundFile, setSoundFile] = useState(state.soundFile);
  const [volume, setVolume] = useState(state.volume);
  const [soundRepeat, setSoundRepeat] = useState(state.soundRepeat);
  const [focus, setFocus] = useState(state.focusLength);
  const [shortBreak, setShortBreak] = useState(state.shortBreakLength);
  const [longBreak, setLongBreak] = useState(state.longBreakLength);

  useEffect(() => {
    setFocus(state.focusLength);
    setShortBreak(state.shortBreakLength);
    setLongBreak(state.longBreakLength);
    setAutoStartBreaks(state.autoStartBreaks);
    setAutoStartFocus(state.autoStartFocus);
    setSoundFile(state.soundFile);
    setVolume(state.volume);
    setSoundRepeat(state.soundRepeat);
  }, [
    state.focusLength,
    state.shortBreakLength,
    state.longBreakLength,
    state.autoStartBreaks,
    state.autoStartFocus,
    state.soundFile,
    state.volume,
    state.soundRepeat,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validatedRepeat = Math.max(1, Math.min(3, Number(soundRepeat)));
    dispatch({
      type: "UPDATE_SETTING",
      payload: {
        focusLength: focus,
        shortBreakLength: shortBreak,
        longBreakLength: longBreak,
        autoStartBreaks,
        autoStartFocus,
        soundFile,
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
      payload: { soundFile, volume, soundRepeat: validatedRepeat },
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
      <h3 className="form-sub-title">
        <MdVolumeUp /> Sound
      </h3>
      <div className="checkbox-container">
        <label htmlFor="sound-enabled">Alarm Sound:</label>
        <div className="select-wrapper">
          <select
            id="sound-enabled"
            value={soundFile}
            onChange={(e) => setSoundFile(e.target.value)}
            disabled={state.timerRunning}
          >
            <option value="">None</option>
            <option value="notification">Notification</option>
            <option value="birds">Birds</option>
            <option value="bell">Bell</option>
          </select>
          {state.timerRunning && (
            <span className="tooltip">
              Cannot change sound while timer is running
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
        />
        <span>{volume}%</span>
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
        />
      </div>
      <h3 className="form-sub-title">
        <FaClock /> Focus Timer
      </h3>
      <div className="checkbox-container">
        <label htmlFor="auto-start-focus">Auto Start Focus:</label>
        <input
          type="checkbox"
          id="auto-start-focus"
          checked={autoStartFocus}
          onChange={(e) => setAutoStartFocus(e.target.checked)}
        />
      </div>
      <div className="checkbox-container">
        <label htmlFor="auto-start-breaks">Auto Start Breaks:</label>
        <input
          type="checkbox"
          id="auto-start-breaks"
          checked={autoStartBreaks}
          onChange={(e) => setAutoStartBreaks(e.target.checked)}
        />
      </div>
      <div className="form-btn-container">
        <button type="submit">OK</button>
      </div>
    </form>
  );
}
