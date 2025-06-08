import TimerDisplay from "./main-section-components/TimerDisplay";
import Controls from "./main-section-components/Controls";
import FocusMode from "./main-section-components/FocusMode";
import FocusStatus from "./main-section-components/FocusStatus";

export default function MainSection () {
return (
    <div className="main-section">
        <FocusMode></FocusMode>
        <TimerDisplay></TimerDisplay>
        <Controls></Controls>
        <FocusStatus></FocusStatus>
    </div>
);
};