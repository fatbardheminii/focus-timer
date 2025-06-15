import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainSection from "./components/MainSection";
import Setting from "./components/Setting";
import { useState, useRef } from "react";
import { TimerProvider } from "./context/TimerContext";

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const settingButtonRef = useRef(null);

  const openSetting = () => setIsSettingOpen(true);
  const closeSetting = () => {
    setIsSettingOpen(false);
    settingButtonRef.current?.focus();
  };

  return (
    <div
      className="app-container"
      role="application"
      aria-label="Focus Timer Application"
    >
      <TimerProvider>
        <Header setIsSettingOpen={openSetting} ref={settingButtonRef} />
        <MainSection />
        <Footer />
        {isSettingOpen && (
          <div className="overlay">
            <Setting onClose={closeSetting} />
          </div>
        )}
      </TimerProvider>
    </div>
  );
}

export default App;
