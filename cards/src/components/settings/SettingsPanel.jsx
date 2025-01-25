import  { useEffect, useState } from "react";
import skyImg from '../../assets/desktop/darck/sky.jpg'
import "@/components/settings/SettingsPanel.scss";
import { NavLink } from "react-router-dom";

const SettingsPanel = () => {
  const [sound, setSound] = useState(() => JSON.parse(localStorage.getItem('sound')) ?? true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? "light");
  const [language, setLanguage] = useState(localStorage.getItem('language') ?? "ua");
  const [backgroundOption, setBackgroundOption] = useState(Number(localStorage.getItem('backgroundOption')) ?? 1);
  const [buttonColor, setButtonColor] = useState(localStorage.getItem('buttonColor') ?? "red");
  const [selectedPhoto, setSelectedPhoto] = useState(localStorage.getItem('selectedPhoto') ?? 1);

  useEffect(() => {
    localStorage.setItem('sound', JSON.stringify(sound));
  }, [sound]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('backgroundOption', backgroundOption);
  }, [backgroundOption]);

  useEffect(() => {
    localStorage.setItem('buttonColor', buttonColor);
  }, [buttonColor]);

  useEffect(() => {
    localStorage.setItem('selectedPhoto', selectedPhoto);
  }, [selectedPhoto]);

  useEffect(() => {
    document.documentElement.setAttribute('background-theme', `${backgroundOption}-${theme}`);
    document.documentElement.setAttribute('button-theme', `${buttonColor}-${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
  }, [backgroundOption, theme, buttonColor]);
  
  return (
    <div className="settings-panel">
      <div className="settings-header">
        <NavLink to={'/'}>beack</NavLink>
        <div className="avatar">Славік</div>
      </div>

      <div className="divider"></div>

      <div className="settings-sector">
        <label className="sector-title">Звук</label>
        <div className="toggle">
          <input
            type="checkbox"
            id="soundToggle"
            checked={sound}
            onChange={() => setSound(!sound)}
          />
          <label htmlFor="soundToggle"></label>
        </div>
      </div>


      <div className="settings-sector">
        <label className="sector-title">Вибір теми</label>
        <select
          className="select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Світла</option>
          <option value="dark">Темна</option>
        </select>
      </div>


      <div className="settings-sector">
        <label className="sector-title">Вибір мови</label>
        <select
          className="select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="ua">Українська</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="divider"></div>

      <div className="settings-sector">
        <label className="sector-title">Колір кнопок</label>
      </div>

      <div className="radio-group">
        <div className="button-group">
          <div
            className={buttonColor === "red" ? "button active red" : "button red"}
            onClick={() => setButtonColor("red")}
          >
            <span className="inner-circle"></span>
          </div>
          <div
            className={buttonColor === "blue" ? "button active blue" : "button blue"}
            onClick={() => setButtonColor("blue")}
          >
            <span className="inner-circle"></span>
          </div>
          <div
            className={buttonColor === "green" ? "button active green" : "button green"}
            onClick={() => setButtonColor("green")}
          >
            <span className="inner-circle"></span>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="settings-sector">
        <label className="sector-title">Вибір заднього фону</label>
      </div>

      <div className="settings-sector">
        <button
          className={backgroundOption === 1 ? "button activeTeable" : "button"}
          onClick={() => setBackgroundOption(1)}
        >
          <div className="photo one"></div>
        </button>

        <button
          className={backgroundOption === 2 ? "button activeTeable" : "button"}
          onClick={() => setBackgroundOption(2)}
        >
          <div className="photo twoo"></div>
        </button>          
        {/* <button
          className={backgroundOption === 3 ? "button activeTeable" : "button"}
          onClick={() => setBackgroundOption(3)}
        >
          <img className="photo" src={bleckImg} alt="err" />
        </button>         */}
      </div>

      <div className="divider"></div>

      <div className="settings-sector">
        <label className="sector-title">Вибір заднього фону</label>
      </div>

      <div className="settings-sector">
        <button
          className={selectedPhoto === 1 ? "button activePhoto" : "button"}
          onClick={() => setSelectedPhoto(1)}
        >
          <img className="photo" src={skyImg} alt="err" />
        </button>

        <button
          className={selectedPhoto === 2 ? "button activePhoto" : "button"}
          onClick={() => setSelectedPhoto(2)}
        >
          <img className="photo" src={skyImg} alt="err" />
        </button>          
        <button
          className={selectedPhoto === 3 ? "button activePhoto" : "button"}
          onClick={() => setSelectedPhoto(3)}
        >
          <img className="photo" src={skyImg} alt="err" />
        </button>        
      </div>

      <div className="divider"></div>

      <div className="settings-footer">
        <span>Версія гри: Бета</span>
      </div>
    </div>
  );
};

export default SettingsPanel;
