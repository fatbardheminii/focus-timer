import { test, describe, expect } from "vitest";
import { initialState, timerReducer } from "../reducer/timerReducer";

describe("timerReducer", () => {
  test("handles START action", () => {
    const state = timerReducer(initialState, { type: "START" });
    expect(state.timerRunning).toBe(true);
  });

  test("handles PAUSE action", () => {
    const state = timerReducer(
      { ...initialState, timerRunning: true },
      { type: "PAUSE" }
    );
    expect(state.timerRunning).toBe(false);
  });

  test("handles SKIP action", () => {
    const state = timerReducer(initialState, { type: "SKIP" });
    expect(state.timeLeft).toBe(0);
  });

  test("handles RESET action", () => {
    const modifiedState = {
      ...initialState,
      timeLeft: 0,
      soundEnabled: false,
      soundFile: "",
      volume: 0,
      soundRepeat: 0,
    };
    const state = timerReducer(modifiedState, { type: "RESET" });
    expect(state).toEqual({
      ...initialState,
      timeLeft: initialState.focusLength * 60,
      soundEnabled: false,
      soundFile: "",
      volume: 0,
      soundRepeat: 0,
    });
  });

  test("handles TICK action", () => {
    const state = timerReducer(
      { ...initialState, timeLeft: 1500 },
      { type: "TICK" }
    );
    expect(state.timeLeft).toBe(1499);
  });

  test("handles SET_MODE action", () => {
    const state = timerReducer(initialState, {
      type: "SET_MODE",
      payload: "short",
    });
    expect(state.currentMode).toBe("short");
    expect(state.timeLeft).toBe(initialState.shortBreakLength * 60);
  });

  test("handles UPDATE_SETTING action", () => {
    const payload = {
      focusLength: 30,
      shortBreakLength: 10,
      longBreakLength: 20,
      autoStartBreaks: true,
      autoStartFocus: true,
      soundEnabled: false,
      soundFile: "",
      volume: 0,
      soundRepeat: 0,
    };
    const state = timerReducer(initialState, {
      type: "UPDATE_SETTING",
      payload,
    });
    expect(state).toEqual({
      ...initialState,
      ...payload,
      timeLeft: 30 * 60, // Updates based on currentMode: 'focus'
    });
  });

  test("handles UPDATE_SOUND_SETTINGS action", () => {
    const payload = {
      soundEnabled: false,
      soundFile: "",
      volume: 0,
      soundRepeat: 0,
    };
    const state = timerReducer(initialState, {
      type: "UPDATE_SOUND_SETTINGS",
      payload,
    });
    expect(state.soundEnabled).toBe(false);
    expect(state.soundFile).toBe("");
    expect(state.volume).toBe(0);
    expect(state.soundRepeat).toBe(0);
  });
});
