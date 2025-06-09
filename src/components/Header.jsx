import { FaClock, FaGear } from "react-icons/fa6";

export default function Header ({setIsSettingOpen}) {
  return (
    <header>
        <FaClock></FaClock>
      <h1>Focus Drill</h1>
      <button className="settings-btn" onClick={setIsSettingOpen}><FaGear></FaGear> <div className="setting">Setting</div></button>
    </header>
  );
};