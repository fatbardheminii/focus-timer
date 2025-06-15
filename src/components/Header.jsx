import { FaClock, FaGear } from "react-icons/fa6";

export default function Header({ setIsSettingOpen }) {
  return (
    <nav aria-label="Main navigation">
      <header>
        <FaClock aria-hidden="true" />
        <h1>Focus Timer</h1>
        <button
          className="settings-btn"
          onClick={setIsSettingOpen}
          aria-label="Open settings"
        >
          <FaGear aria-hidden="true" />
          <span className="setting">Settings</span>
        </button>
      </header>
    </nav>
  );
}
