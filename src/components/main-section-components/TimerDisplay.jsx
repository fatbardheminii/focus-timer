export default function TimerDisplay ({ minutes = '00', seconds = '00'}) {
    return (
      <div className="timer-display">
        <div className="minutes">{minutes}:</div>
        <div className="minutes">{seconds}</div>
      </div>
    );
};