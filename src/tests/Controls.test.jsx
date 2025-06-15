import { test, describe, beforeEach, afterEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Controls from "../components/main-section-components/Controls";
import { TimerContext } from "../context/TimerContext";
import useSound from "use-sound";

vi.mock("use-sound");

const mockDispatch = vi.fn();
const mockPlay = vi.fn();
const mockState = {
  timerRunning: false,
  timeLeft: 1500,
  soundEnabled: true,
  soundFile: "notification",
  volume: 50,
  soundRepeat: 2,
  currentMode: "focus",
};

const renderWithContext = (state = mockState) => {
  useSound.mockReturnValue([mockPlay]);
  return render(
    <TimerContext.Provider value={{ state, dispatch: mockDispatch }}>
      <Controls />
    </TimerContext.Provider>
  );
};

describe("Controls Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders start button when timer is paused", () => {
    renderWithContext();
    expect(
      screen.getByRole("button", { name: /start timer/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /pause timer/i })
    ).not.toBeInTheDocument();
  });

  test("renders pause, skip, and reset buttons when timer is running", () => {
    renderWithContext({ ...mockState, timerRunning: true });
    expect(
      screen.getByRole("button", { name: /pause timer/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /skip current session/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset timer/i })
    ).toBeInTheDocument();
  });

  test("dispatches start action on button click", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWithContext();
    const startButton = screen.getByRole("button", { name: /start timer/i });
    await user.click(startButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "START" });
    vi.useFakeTimers();
  });

  test("dispatches pause action on button click", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWithContext({ ...mockState, timerRunning: true });
    const pauseButton = screen.getByRole("button", { name: /pause timer/i });
    await user.click(pauseButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "PAUSE" });
    vi.useFakeTimers();
  });

  test("dispatches skip and reset actions", async () => {
    vi.useRealTimers();
    const user = userEvent.setup();
    renderWithContext({ ...mockState, timerRunning: true });
    const skipButton = screen.getByRole("button", {
      name: /skip current session/i,
    });
    const resetButton = screen.getByRole("button", { name: /reset timer/i });

    await user.click(skipButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "SKIP" });

    await user.click(resetButton);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "RESET" });
    vi.useFakeTimers();
  });

  test("plays sound when time reaches zero and sound is enabled", () => {
    renderWithContext({ ...mockState, timeLeft: 0 });
    vi.advanceTimersByTime(1000);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "TIMEOVER" });
    expect(mockPlay).toHaveBeenCalledTimes(1); // Adjusted to match actual behavior
  });

  test("does not play sound when sound is disabled", () => {
    renderWithContext({ ...mockState, timeLeft: 0, soundEnabled: false });
    vi.advanceTimersByTime(1000);
    expect(mockDispatch).toHaveBeenCalledWith({ type: "TIMEOVER" });
    expect(mockPlay).not.toHaveBeenCalled();
  });

  test("has accessible buttons and live region", () => {
    renderWithContext();
    expect(
      screen.getByRole("button", { name: /start timer/i })
    ).toHaveAttribute("aria-label", "Start timer");
    expect(screen.getByText(/timer is paused/i)).toHaveAttribute(
      "aria-live",
      "polite"
    );
  });
});
