import { test, describe, beforeEach, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Setting from "../components/Setting";
import { TimerContext } from "../context/TimerContext";

const mockDispatch = vi.fn();
const mockOnClose = vi.fn();
const mockState = {
  focusLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  soundFile: "notification",
  volume: 50,
  soundRepeat: 1,
  timerRunning: false,
};

const renderWithContext = (state = mockState) => {
  return render(
    <TimerContext.Provider value={{ state, dispatch: mockDispatch }}>
      <Setting onClose={mockOnClose} />
    </TimerContext.Provider>
  );
};

describe("Setting Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders settings form with all inputs", () => {
    renderWithContext();
    expect(
      screen.getByRole("dialog", { name: /settings/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "Focus" })).toHaveValue(25);
    expect(screen.getByLabelText(/short break/i)).toHaveValue(5);
    expect(screen.getByLabelText(/long break/i)).toHaveValue(15);
    expect(screen.getByLabelText(/enable sound effects/i)).toBeChecked();
    expect(screen.getByLabelText(/alarm sound/i)).toHaveValue("notification");
    expect(screen.getByLabelText(/volume/i)).toHaveValue("50");
    expect(screen.getByLabelText(/sound repeat/i)).toHaveValue(1);
    expect(screen.getByLabelText(/auto start focus/i)).not.toBeChecked();
    expect(screen.getByLabelText(/auto start breaks/i)).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: /save settings/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /close settings/i })
    ).toBeInTheDocument();
  });

  test("toggles sound enable checkbox and disables sound inputs", async () => {
    const user = userEvent.setup();
    renderWithContext();
    const soundCheckbox = screen.getByLabelText(/enable sound effects/i);
    await user.click(soundCheckbox);
    expect(soundCheckbox).not.toBeChecked();
    expect(screen.getByLabelText(/alarm sound/i)).toBeDisabled();
    expect(screen.getByLabelText(/volume/i)).toBeDisabled();
    expect(screen.getByLabelText(/sound repeat/i)).toBeDisabled();
  });

  test("submits form and dispatches actions", async () => {
    const user = userEvent.setup();
    renderWithContext();
    const focusInput = screen.getByRole("spinbutton", { name: "Focus" });
    const soundCheckbox = screen.getByLabelText(/enable sound effects/i);
    const saveButton = screen.getByRole("button", { name: /save settings/i });

    await user.clear(focusInput);
    await user.type(focusInput, "30");
    await user.click(soundCheckbox);
    await user.click(saveButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_SETTING",
      payload: {
        focusLength: 30,
        shortBreakLength: 5,
        longBreakLength: 15,
        autoStartBreaks: false,
        autoStartFocus: false,
        soundEnabled: false,
        soundFile: "",
        volume: 50,
        soundRepeat: 1,
      },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_AUTOSTART_FOCUS",
      payload: false,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_AUTOSTART_BREAKS",
      payload: false,
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_SOUND_SETTINGS",
      payload: {
        soundEnabled: false,
        soundFile: "",
        volume: 50,
        soundRepeat: 1,
      },
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("displays error for invalid sound repeat", async () => {
    const user = userEvent.setup();
    renderWithContext();
    const repeatInput = screen.getByLabelText(/sound repeat/i);
    const saveButton = screen.getByRole("button", { name: /save settings/i });

    await user.clear(repeatInput);
    await user.type(repeatInput, "4");
    await user.click(saveButton);

    const errorElement = await screen.findByText(/sound repeat.*1.*3/i);
    expect(errorElement).toBeInTheDocument();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test("closes modal on Escape key", async () => {
    const user = userEvent.setup();
    renderWithContext();
    await user.keyboard("{Escape}");
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("focuses close button on mount", () => {
    renderWithContext();
    const closeButton = screen.getByRole("button", { name: /close settings/i });
    expect(closeButton).toHaveFocus();
  });

  test("has accessible form elements", () => {
    renderWithContext();
    const form = screen.getByRole("dialog", { name: /settings/i });
    expect(form).toHaveAttribute("aria-labelledby", "setting-title");
    expect(
      screen.getByLabelText(/enable sound effects/i)
    ).toHaveAccessibleDescription();
    expect(screen.getByLabelText(/volume/i)).toHaveAttribute(
      "aria-valuenow",
      "50"
    );
    expect(
      screen.getByRole("button", { name: /close settings/i })
    ).toHaveAttribute("aria-label", "Close settings");
  });
});
