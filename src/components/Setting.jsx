import { FaClock, FaX } from "react-icons/fa6";

export default function Setting({ onClose }) {
  return (
    <form>
      <h2 className="form-title">
        Setting
        <span className="close-icon" onClick={onClose}>
          <FaX />
        </span>
      </h2>
      <h3 className="form-sub-title">
        <FaClock /> Focus Timer
      </h3>
      <div className="duration-input-container">
        <div className="duration-input-card">
          <label htmlFor="focus-duration">Focus</label>
          <input
            type="number"
            name="focus-duration"
            id="focus-duration"
            value={25}
          />
        </div>
        <div className="duration-input-card">
          <label htmlFor="short-brake-duration">Short Brake</label>
          <input
            type="number"
            name="short-brake-duration"
            id="short-brake-duration"
            value={5}
          />
        </div>
        <div className="duration-input-card">
          <label htmlFor="long-brake-duration">Long Brake</label>
          <input
            type="number"
            name="long-brake-duration"
            id="long-brake-duration"
            value={15}
          />
        </div>
      </div>
      <div className="form-btn-container">
        <button type="submit">OK</button>
      </div>
    </form>
  );
}
