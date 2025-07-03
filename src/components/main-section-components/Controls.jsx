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
  const startTimeRef = useRef(null); // Store the start time of the timer
  const initialDurationRef = useRef(null); // Store the initial session duration
  const soundMap = {
    notification: notificationSound,
    birds: birdsSound,
    bell: bellSound,
  };
  const [play] = useSound(soundMap[state.soundFile] || notificationSound, {
    volume: state.volume / 100,
    soundEnabled: state.soundEnabled && !!state.soundFile,
  });

  // Helper function to reset startTimeRef and initialDurationRef
  const resetStartTime = () => {
    startTimeRef.current = null;
    initialDurationRef.current = null;
  };

  useEffect(() => {
    if (state.timerRunning) {
      // Record the start time if not already set
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        // Calculate elapsed time since the timer started
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

        // Update timeLeft for display
        dispatch({ type: "TICK" });

        // Check if the session should end based on elapsed time
        if (
          initialDurationRef.current &&
          elapsed >= initialDurationRef.current
        ) {
          dispatch({ type: "TIMEOVER" });
          clearInterval(intervalRef.current);
          resetStartTime();
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      // Update startTimeRef and initialDurationRef to account for paused time
      if (startTimeRef.current && initialDurationRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        startTimeRef.current = Date.now();
        initialDurationRef.current = initialDurationRef.current - elapsed; // Adjust remaining duration
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [state.timerRunning, dispatch]);

  useEffect(() => {
    if (state.timeLeft === 0 && sessionEndRef.current === 0) {
      sessionEndRef.current = Date.now();
      dispatch({ type: "TIMEOVER" });
      resetStartTime();
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
    dispatch({
      type: state.timerRunning ? "PAUSE" : "START",
      payload: state.timerRunning ? undefined : state.timeLeft,
    });
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
            onClick={() => {
              dispatch({ type: "SKIP" });
              resetStartTime();
            }}
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
            onClick={() => {
              dispatch({ type: "RESET" });
              resetStartTime();
            }}
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
