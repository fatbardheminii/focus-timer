import { FaClock, FaGear } from "react-icons/fa6";

export default function Header () {
  return (
    <header>
        <FaClock></FaClock>
      <h1>Focus Drill</h1>
      <button className="settings-btn"><FaGear></FaGear> <div className="setting">Settings</div></button>
    </header>
  );
};