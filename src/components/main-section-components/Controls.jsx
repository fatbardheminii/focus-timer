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
  const sessionEndRef = useRef(0); // Unique timestamp for session end
  const soundMap = {
    notification: notificationSound,
    birds: birdsSound,
    bell: bellSound,
  };
  const [play] = useSound(soundMap[state.soundFile] || notificationSound, {
    volume: state.volume / 100,
    soundEnabled: !!state.soundFile,
  });

  // Timer ticking
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

  // Dispatch TIMEOVER and set session ID
  useEffect(() => {
    if (state.timeLeft === 0 && sessionEndRef.current === 0) {
      sessionEndRef.current = Date.now();
      dispatch({ type: "TIMEOVER" });
    } else if (state.timeLeft !== 0) {
      sessionEndRef.current = 0;
    }
  }, [state.timeLeft, dispatch]);

  // Play sound
  useEffect(() => {
    if (
      state.timeLeft === 0 &&
      state.soundFile &&
      sessionEndRef.current !== 0
    ) {
      const soundDurations = {
        notification: 3000, // 3 seconds
        birds: 2000, // 2 seconds
        bell: 4000, // 4 seconds
      };
      const soundDelay = soundDurations[state.soundFile] || 3000; // Fallback to 3s
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
      // Only clear timeouts on unmount or new session
      if (sessionEndRef.current === 0) {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
      }
    };
  }, [state.timeLeft, state.soundFile, state.soundRepeat, play]);

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
