import TimerDisplay from "./main-section-components/TimerDisplay";
import Controls from "./main-section-components/Controls";
import FocusMode from "./main-section-components/FocusMode";
import FocusStatus from "./main-section-components/FocusStatus";

export default function MainSection() {
  return (
    <main className="main-section" aria-labelledby="focus-timer-heading">
      <FocusMode />
      <TimerDisplay />
      <Controls />
      <div className="focus-status-container">
        <FocusStatus />
      </div>
    </main>
  );
}
