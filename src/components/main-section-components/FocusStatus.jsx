export default function FocusStatus( {focusCount = 0} ) {
    return (
        <div className="focus-status">
            <div className="focus-count">{focusCount}</div>
            <div className="focus-message">Time to focus!</div>
        </div>
    );
};