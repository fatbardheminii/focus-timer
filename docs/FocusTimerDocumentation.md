# Focus Timer Project Documentation

## Overview

The Focus Timer is a React-based web application implementing the Pomodoro technique to boost productivity. It allows users to manage focus sessions and breaks with customizable durations, sound notifications, and auto-start options. Built with modern JavaScript, Vite, and React, it features a responsive design and includes unit tests for reliability.

This documentation details each file in the project, explaining its purpose, functionality, and role within the application. It’s designed to help developers—especially those new to parts of the codebase—understand and maintain the project effectively.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Core Files](#core-files)
   - [main.jsx](#mainjsx)
   - [App.jsx](#appjsx)
   - [App.css](#appcss)
   - [index.css](#indexcss)
3. [State Management](#state-management)
   - [timerReducer.jsx](#timerreducerjsx)
   - [TimerContext.jsx](#timercontextjsx)
4. [Components](#components)
   - [Header.jsx](#headerjsx)
   - [MainSection.jsx](#mainsectionjsx)
   - [Setting.jsx](#settingjsx)
   - [Footer.jsx](#footerjsx)
   - [Controls.jsx](#controlsjsx)
   - [FocusMode.jsx](#focusmodejsx)
   - [FocusStatus.jsx](#focusstatusjsx)
   - [TimerDisplay.jsx](#timerdisplayjsx)
5. [Configuration](#configuration)
   - [package.json](#packagejson)
   - [vite.config.js](#viteconfigjs)
6. [Testing](#testing)
   - [Setting.test.jsx](#settingtestjsx)
   - [App.test.jsx](#apptestjsx)
   - [timeReducer.test.jsx](#timereducertestjsx)
   - [Controls.test.jsx](#controlstestjsx)
   - [setupTests.js](#setuptestsjs)
7. [Conclusion](#conclusion)

---

## Project Structure

The Focus Timer project follows a standard React application structure:

- **Core Files**: Entry point and top-level components (`main.jsx`, `App.jsx`, `App.css`, `index.css`).
- **State Management**: Reducer and context for timer state (`timerReducer.jsx`, `TimerContext.jsx`).
- **Components**: Modular UI pieces (`Header.jsx`, `MainSection.jsx`, `Setting.jsx`, etc.).
- **Configuration**: Build and dependency management (`package.json`, `vite.config.js`).
- **Tests**: Unit tests for components and logic (`*.test.jsx`, `setupTests.js`).

---

## Core Files

### main.jsx

**Purpose**: The entry point of the React application.

**Responsibilities**:
- Initializes the React app and renders the root component (`App.jsx`).
- Uses `StrictMode` to catch potential issues during development.

**How It Works**:
- Imports `createRoot` from `react-dom/client` to create a root DOM node.
- Renders the `App` component inside `StrictMode` into an HTML element with the ID `root`.

**Code Example**:
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Why It’s Important**: This file bootstraps the entire application, ensuring the React component tree is mounted correctly.

---

### App.jsx

**Purpose**: The root component that orchestrates the application’s layout and state.

**Responsibilities**:
- Renders the main UI components: `Header`, `MainSection`, and `Footer`.
- Manages the settings modal state using `useState`.
- Wraps child components in `TimerProvider` to provide timer state access.

**How It Works**:
- Uses `useState` to toggle the settings modal (`isSettingOpen`).
- Passes the modal state and toggle function to `Header` and `Setting`.
- Structures the app layout with semantic HTML and CSS classes.

**Code Example**:
```jsx
import { useState } from 'react';
import { TimerProvider } from './TimerContext.jsx';
import Header from './Header.jsx';
import MainSection from './MainSection.jsx';
import Footer from './Footer.jsx';
import Setting from './Setting.jsx';
import './App.css';

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  return (
    <TimerProvider>
      <div className="app">
        <Header setIsSettingOpen={setIsSettingOpen} />
        <MainSection />
        <Footer />
        {isSettingOpen && <Setting onClose={() => setIsSettingOpen(false)} />}
      </div>
    </TimerProvider>
  );
}

export default App;
```

**Why It’s Important**: Acts as the central hub, coordinating UI and state management.

---

### App.css

**Purpose**: Defines application-wide styles.

**Responsibilities**:
- Sets CSS variables for theming (colors, fonts, etc.).
- Styles the layout, buttons, and forms.
- Includes media queries for responsiveness.

**How It Works**:
- Uses `:root` for global CSS variables.
- Applies styles to `.app` and child elements.
- Adjusts layout for mobile devices.

**Code Example**:
```css
:root {
  --primary-bg-color: #e6f3e6;
  --button-bg-color: #4caf50;
  --text-color: #333;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .app {
    padding: 10px;
  }
}
```

**Why It’s Important**: Ensures a consistent and responsive design across the app.

---

### index.css

**Purpose**: Applies global base styles.

**Responsibilities**:
- Resets browser defaults (e.g., margins, padding).
- Sets font family, background color, and text color.

**How It Works**:
- Targets universal selectors (`*`) and `body` for foundational styles.

**Code Example**:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background-color: var(--primary-bg-color);
  color: var(--text-color);
}
```

**Why It’s Important**: Provides a clean slate for custom styling.

---

## State Management

### timerReducer.jsx

**Purpose**: Manages the timer’s state logic.

**Responsibilities**:
- Defines the initial state (durations, mode, etc.).
- Handles actions to update state (start, pause, skip, etc.).

**How It Works**:
- Uses a reducer function with a switch statement to process actions.
- Updates state immutably based on action types and payloads.

**Initial State Example**:
```jsx
const initialState = {
  focusLength: 25,
  shortBreakLength: 5,
  longBreakLength: 15,
  currentMode: 'focus',
  timerRunning: false,
  timeLeft: 25 * 60,
  focusCount: 0,
  autoStartFocus: false,
  autoStartBreaks: false,
  soundEnabled: true,
  soundFile: 'default.mp3',
  volume: 0.5,
  soundRepeat: 1,
};
```

**Reducer Example**:
```jsx
function timerReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, timerRunning: true };
    case 'PAUSE':
      return { ...state, timerRunning: false };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft - 1 };
    case 'SET_MODE':
      return {
        ...state,
        currentMode: action.payload,
        timeLeft: state[`${action.payload}Length`] * 60,
        timerRunning: false,
      };
    // Additional cases...
    default:
      return state;
  }
}

export default timerReducer;
```

**Why It’s Important**: Centralizes timer logic, making state changes predictable and maintainable.

---

### TimerContext.jsx

**Purpose**: Provides timer state and dispatch function to components.

**Responsibilities**:
- Creates a React context using `createContext`.
- Uses `useReducer` to manage state with `timerReducer`.

**How It Works**:
- Wraps the app in a `TimerProvider` component.
- Exposes `state` and `dispatch` via context.

**Code Example**:
```jsx
import { createContext, useReducer } from 'react';
import timerReducer from './timerReducer.jsx';

const TimerContext = createContext();

export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export default TimerContext;
```

**Why It’s Important**: Eliminates prop drilling, allowing any component to access timer state.

---

## Components

### Header.jsx

**Purpose**: Displays the app title and settings button.

**Responsibilities**:
- Renders a header with an icon, title, and button.
- Toggles the settings modal via a prop.

**How It Works**:
- Uses the `FaClock` icon from `react-icons`.
- Calls `setIsSettingOpen(true)` when the button is clicked.

**Code Example**:
```jsx
import { FaClock } from 'react-icons/fa';

function Header({ setIsSettingOpen }) {
  return (
    <header>
      <FaClock />
      <h1>Focus Timer</h1>
      <button onClick={() => setIsSettingOpen(true)}>Settings</button>
    </header>
  );
}

export default Header;
```

**Why It’s Important**: Provides navigation and branding.

---

### MainSection.jsx

**Purpose**: Houses the core timer functionality.

**Responsibilities**:
- Renders `FocusMode`, `TimerDisplay`, `Controls`, and `FocusStatus`.

**How It Works**:
- Acts as a container with a simple layout.

**Code Example**:
```jsx
import FocusMode from './FocusMode.jsx';
import TimerDisplay from './TimerDisplay.jsx';
import Controls from './Controls.jsx';
import FocusStatus from './FocusStatus.jsx';

function MainSection() {
  return (
    <main>
      <FocusMode />
      <TimerDisplay />
      <Controls />
      <FocusStatus />
    </main>
  );
}

export default MainSection;
```

**Why It’s Important**: Organizes the primary interactive elements.

---

### Setting.jsx

**Purpose**: Allows users to customize timer settings.

**Responsibilities**:
- Renders a modal with a form for durations, auto-start, and sound options.
- Updates global state on form submission.

**How It Works**:
- Uses local state for form inputs.
- Dispatches actions to update `timerReducer` state.
- Implements focus trapping for accessibility.

**Code Example**:
```jsx
import { useState, useEffect, useContext } from 'react';
import TimerContext from './TimerContext.jsx';

function Setting({ onClose }) {
  const { state, dispatch } = useContext(TimerContext);
  const [formData, setFormData] = useState({ ...state });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'UPDATE_SETTING', payload: formData });
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Focus Length:
          <input
            type="number"
            value={formData.focusLength}
            onChange={(e) => setFormData({ ...formData, focusLength: e.target.value })}
          />
        </label>
        {/* Additional inputs... */}
        <button type="submit">Save</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default Setting;
```

**Why It’s Important**: Enables user customization, enhancing flexibility.

---

### Footer.jsx

**Purpose**: Displays copyright and developer info.

**Responsibilities**:
- Shows the current year and a GitHub link.

**How It Works**:
- Uses `new Date().getFullYear()` for dynamic copyright.

**Code Example**:
```jsx
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>&copy; {currentYear} Fatbardh Emini</p>
      <a href="https://github.com/fatbardheminii">GitHub</a>
    </footer>
  );
}

export default Footer;
```

**Why It’s Important**: Adds attribution and professionalism.

---

### Controls.jsx

**Purpose**: Manages timer controls and logic.

**Responsibilities**:
- Renders start/pause, skip, and reset buttons.
- Handles timer intervals and sound effects.

**How It Works**:
- Uses `useEffect` to set up a ticking interval.
- Plays sound when `timeLeft` reaches zero.

**Code Example**:
```jsx
import { useContext, useEffect, useRef } from 'react';
import TimerContext from './TimerContext.jsx';
import useSound from 'use-sound';

function Controls() {
  const { state, dispatch } = useContext(TimerContext);
  const intervalRef = useRef();
  const [play] = useSound(state.soundFile, { volume: state.volume });

  useEffect(() => {
    if (state.timerRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [state.timerRunning, dispatch]);

  useEffect(() => {
    if (state.timeLeft === 0) {
      dispatch({ type: 'TIMEOVER' });
      if (state.soundEnabled) play();
    }
  }, [state.timeLeft, dispatch, play]);

  return (
    <div>
      <button onClick={() => dispatch({ type: state.timerRunning ? 'PAUSE' : 'START' })}>
        {state.timerRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => dispatch({ type: 'SKIP' })}>Skip</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}

export default Controls;
```

**Why It’s Important**: Drives the timer’s core functionality.

---

### FocusMode.jsx

**Purpose**: Switches between timer modes.

**Responsibilities**:
- Renders buttons for focus, short break, and long break.
- Updates the mode via dispatch.

**How It Works**:
- Dispatches `SET_MODE` with the selected mode.

**Code Example**:
```jsx
import { useContext } from 'react';
import TimerContext from './TimerContext.jsx';

function FocusMode() {
  const { dispatch } = useContext(TimerContext);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'SET_MODE', payload: 'focus' })}>
        Focus
      </button>
      <button onClick={() => dispatch({ type: 'SET_MODE', payload: 'short' })}>
        Short Break
      </button>
      <button onClick={() => dispatch({ type: 'SET_MODE', payload: 'long' })}>
        Long Break
      </button>
    </div>
  );
}

export default FocusMode;
```

**Why It’s Important**: Allows mode flexibility.

---

### FocusStatus.jsx

**Purpose**: Shows session progress.

**Responsibilities**:
- Displays focus count and a mode-specific message.

**How It Works**:
- Uses state to animate session changes.

**Code Example**:
```jsx
import { useContext } from 'react';
import TimerContext from './TimerContext.jsx';

function FocusStatus() {
  const { state } = useContext(TimerContext);
  const message = state.currentMode === 'focus' ? 'Time to focus!' : 'Time for a break!';

  return (
    <div>
      <p>Focus Sessions: {state.focusCount}</p>
      <p>{message}</p>
    </div>
  );
}

export default FocusStatus;
```

**Why It’s Important**: Keeps users informed of their progress.

---

### TimerDisplay.jsx

**Purpose**: Shows remaining time.

**Responsibilities**:
- Formats and displays `timeLeft` in minutes and seconds.
- Announces time for accessibility.

**How It Works**:
- Converts seconds to a readable format.
- Uses `useEffect` for periodic announcements.

**Code Example**:
```jsx
import { useContext, useEffect } from 'react';
import TimerContext from './TimerContext.jsx';

function TimerDisplay() {
  const { state } = useContext(TimerContext);
  const minutes = Math.floor(state.timeLeft / 60);
  const seconds = state.timeLeft % 60;

  useEffect(() => {
    if (state.timeLeft % 10 === 0) {
      // Accessibility announcement logic
    }
  }, [state.timeLeft]);

  return (
    <div>
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default TimerDisplay;
```

**Why It’s Important**: Provides real-time feedback.

---

## Configuration

### package.json

**Purpose**: Manages project metadata and dependencies.

**Responsibilities**:
- Lists dependencies (React, Vite, etc.).
- Defines scripts (start, build, test).

**Key Sections**:
- `"dependencies"`: Core libraries.
- `"devDependencies"`: Development tools.
- `"scripts"`: Build and test commands.

**Why It’s Important**: Ensures consistent setup and execution.

---

### vite.config.js

**Purpose**: Configures the Vite build tool.

**Responsibilities**:
- Sets up React plugin.
- Configures testing environment.

**Code Example**:
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    coverage: { reporter: ['text', 'json'] },
  },
});
```

**Why It’s Important**: Optimizes development and build processes.

---

## Testing

### Setting.test.jsx

**Purpose**: Tests the `Setting` component.

**Responsibilities**:
- Verifies form rendering and submission.

**Why It’s Important**: Ensures settings work correctly.

---

### App.test.jsx

**Purpose**: Tests the `App` component.

**Responsibilities**:
- Checks rendering and modal toggling.

**Why It’s Important**: Validates the app’s core structure.

---

### timeReducer.test.jsx

**Purpose**: Tests the `timerReducer`.

**Responsibilities**:
- Ensures state updates for all actions.

**Why It’s Important**: Confirms state logic reliability.

---

### Controls.test.jsx

**Purpose**: Tests the `Controls` component.

**Responsibilities**:
- Verifies button functionality and timer behavior.

**Why It’s Important**: Guarantees control accuracy.

---

### setupTests.js

**Purpose**: Configures the test environment.

**Responsibilities**:
- Sets up testing utilities and custom assertions.

**Why It’s Important**: Streamlines testing setup.

---

## Conclusion

This documentation provides a thorough breakdown of the Focus Timer project, from its structure to its individual components, state management, styling, configuration, and testing. Each file’s purpose, functionality, and implementation details are explained to empower you and other developers to understand and extend the codebase confidently.