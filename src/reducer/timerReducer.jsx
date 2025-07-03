const initialFocusLength = 25;

const initialState = {
  focusLength: initialFocusLength,
  shortBreakLength: 5,
  longBreakLength: 15,
  currentMode: "focus",
  timerRunning: false,
  focusCount: 1,
  timeLeft: initialFocusLength * 60,
  autoStartFocus: false,
  autoStartBreaks: false,
  soundEnabled: true,
  soundFile: "notification",
  volume: 50,
  soundRepeat: 1,
};

const timerReducer = (state, action) => {
  switch (action.type) {
    case "START": {
      return {
        ...state,
        timerRunning: true,
        timeLeft: action.payload || state.timeLeft, // Use payload if provided
      };
    }
    case "PAUSE": {
      return {
        ...state,
        timerRunning: false,
      };
    }
    case "SKIP": {
      return {
        ...state,
        timeLeft: 0,
      };
    }
    case "RESET": {
      return {
        ...initialState,
        timeLeft: state.focusLength * 60,
        soundEnabled: state.soundEnabled,
        soundFile: state.soundEnabled ? state.soundFile : "",
        volume: state.volume,
        soundRepeat: state.soundRepeat,
      };
    }
    case "TICK": {
      return {
        ...state,
        timeLeft: state.timeLeft - 1,
      };
    }
    case "SET_MODE": {
      const newMode = action.payload;
      let newTimeLeft = 0;

      if (newMode === "focus") {
        newTimeLeft = state.focusLength * 60;
      } else if (newMode === "short") {
        newTimeLeft = state.shortBreakLength * 60;
      } else if (newMode === "long") {
        newTimeLeft = state.longBreakLength * 60;
      }

      return {
        ...state,
        currentMode: newMode,
        timeLeft: newTimeLeft,
        timerRunning: false,
      };
    }
    case "TIMEOVER": {
      const updatedFocusCount =
        state.currentMode === "focus" ? state.focusCount + 1 : state.focusCount;

      const nextMode =
        state.currentMode === "focus"
          ? updatedFocusCount % 4 === 0
            ? "long"
            : "short"
          : "focus";

      const newTime =
        nextMode === "focus"
          ? state.focusLength * 60
          : nextMode === "short"
          ? state.shortBreakLength * 60
          : state.longBreakLength * 60;

      const shouldAutoStart =
        (nextMode === "focus" && state.autoStartFocus) ||
        ((nextMode === "short" || nextMode === "long") &&
          state.autoStartBreaks);

      return {
        ...state,
        currentMode: nextMode,
        timeLeft: newTime,
        focusCount: updatedFocusCount,
        timerRunning: shouldAutoStart,
      };
    }
    case "UPDATE_AUTOSTART_BREAKS": {
      return {
        ...state,
        autoStartBreaks: action.payload,
      };
    }
    case "UPDATE_AUTOSTART_FOCUS": {
      return {
        ...state,
        autoStartFocus: action.payload,
      };
    }
    case "UPDATE_SOUND_SETTINGS": {
      return {
        ...state,
        soundEnabled: action.payload.soundEnabled,
        soundFile: action.payload.soundFile,
        volume: action.payload.volume,
        soundRepeat: action.payload.soundRepeat,
      };
    }
    case "UPDATE_SETTING": {
      const {
        focusLength,
        shortBreakLength,
        longBreakLength,
        autoStartBreaks,
        autoStartFocus,
        soundEnabled,
        soundFile,
        volume,
        soundRepeat,
      } = action.payload;

      let updatedTimeLeft = state.timeLeft;

      if (state.currentMode === "focus") {
        updatedTimeLeft = focusLength * 60;
      } else if (state.currentMode === "short") {
        updatedTimeLeft = shortBreakLength * 60;
      } else if (state.currentMode === "long") {
        updatedTimeLeft = longBreakLength * 60;
      }

      return {
        ...state,
        focusLength,
        shortBreakLength,
        longBreakLength,
        autoStartBreaks,
        autoStartFocus,
        soundEnabled,
        soundFile,
        volume,
        soundRepeat,
        timeLeft: updatedTimeLeft,
      };
    }
  }
};

export { initialState, timerReducer };
