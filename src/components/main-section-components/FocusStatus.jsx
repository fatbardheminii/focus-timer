import { useContext } from "react";
import { TimerContext } from "../../context/TimerContext";

export default function FocusStatus() {
    const { state } = useContext(TimerContext);
    const { currentMode, focusCount } = state;
    const message = currentMode === 'focus' ? 'Time to focus!' : 'Time for a break!';

    return (
        <div className="focus-status">
            <div className="focus-count">{focusCount}</div>
            <div className="focus-message">{message}</div>
        </div>
    );
};