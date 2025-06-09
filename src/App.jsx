import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MainSection from "./components/MainSection";
import Setting from "./components/Setting";
import { useState } from "react";

function App() {
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  const openSetting = () => setIsSettingOpen(true);
  const closeSetting = () => setIsSettingOpen(false);

  return (
    <>
      <Header setIsSettingOpen={openSetting}></Header>
      <MainSection></MainSection>
      <Footer></Footer>
      {isSettingOpen && (
        <div className="overlay">
          <Setting onClose={closeSetting} />
        </div>
      )}
    </>
  );
}

export default App;
