import { useContext, useRef, useEffect } from "react";
import { TimerContext } from "../../context/TimerContext";
import { FaStepForward, FaRedo } from "react-icons/fa";
import useSound from "use-sound";
import notificationSound from "../../assets/sounds/notification.wav";
import birdsSound from "../../assets/sounds/birds.wav";
import bellSound from "../../assets/sounds/bell.wav";

export default function Controls() {
  const { state, dispatch } = useContext(TimerContext);
  const intervalRef = useRef();
  const timeoutRefs = useRef([]);
  const sessionEndRef = useRef(0);
  const soundMap = {
    notification: notificationSound,
    birds: birdsSound,
    bell: bellSound,
  };
  const [play] = useSound(soundMap[state.soundFile] || notificationSound, {
    volume: state.volume / 100,
    soundEnabled: state.soundEnabled && !!state.soundFile,
  });

  useEffect(() => {
    if (state.timerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: "TICK" });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.timerRunning, dispatch]);

  useEffect(() => {
    if (state.timeLeft === 0 && sessionEndRef.current === 0) {
      sessionEndRef.current = Date.now();
      dispatch({ type: "TIMEOVER" });
    } else if (state.timeLeft !== 0) {
      sessionEndRef.current = 0;
    }
  }, [state.timeLeft, dispatch]);

  useEffect(() => {
    if (
      state.timeLeft === 0 &&
      state.soundEnabled &&
      state.soundFile &&
      sessionEndRef.current !== 0
    ) {
      const soundDurations = {
        notification: 3000,
        birds: 2000,
        bell: 4000,
      };
      const soundDelay = soundDurations[state.soundFile] || 3000;
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];
      for (let i = 0; i < state.soundRepeat; i++) {
        timeoutRefs.current.push(
          setTimeout(() => {
            play();
          }, i * soundDelay)
        );
      }
    }

    return () => {
      if (sessionEndRef.current === 0) {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
      }
    };
  }, [
    state.timeLeft,
    state.soundEnabled,
    state.soundFile,
    state.soundRepeat,
    play,
  ]);

  const handleStartPause = () => {
    dispatch({ type: state.timerRunning ? "PAUSE" : "START" });
  };

  return (
    <div className="controls">
      <div aria-live="polite" className="sr-only">
        {state.timerRunning ? "Timer is running" : "Timer is paused"}
      </div>
      <button
        className={`main-btn ${state.timerRunning ? "pause" : "start"}`}
        onClick={handleStartPause}
        aria-label={state.timerRunning ? "Pause timer" : "Start timer"}
      >
        {state.timerRunning ? "Pause" : "Start"}
      </button>

      {state.timerRunning && (
        <>
          <button
            className="icon-button skip-btn"
            onClick={() => dispatch({ type: "SKIP" })}
            aria-label="Skip current session"
            aria-describedby="skip-tooltip"
          >
            <FaStepForward />
            <span id="skip-tooltip" className="sr-only">
              Skip to next session
            </span>
          </button>

          <button
            className="icon-button reset-btn"
            onClick={() => dispatch({ type: "RESET" })}
            aria-label="Reset timer"
            aria-describedby="reset-tooltip"
          >
            <FaRedo />
            <span id="reset-tooltip" className="sr-only">
              Reset timer to initial state
            </span>
          </button>
        </>
      )}
    </div>
  );
}
