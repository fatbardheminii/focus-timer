import { createContext, useReducer } from "react";
import { timerReducer, initialState } from "../reducer/timerReducer";


const TimerContext = createContext();

const TimerProvider = ({ children }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);

    return (
        <TimerContext.Provider value={{state, dispatch}}>
            {children}
        </TimerContext.Provider>
    )
}

export { TimerContext, TimerProvider }