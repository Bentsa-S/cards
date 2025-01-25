import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import "./CreateGameDurack.scss";

export const CreateGameDurack = () => {
  const [deckSize, setDeckSize] = useState(36);
  const [participants, setParticipants] = useState(3);
  const [password, setPassword] = useState("1111");
  const [isPrivate, setIsPrivate] = useState(true);
  // Стани для перемикачів
  const [attackAll, setAttackAll] = useState(true);
  const [draw, setDraw] = useState(true);
  const [cheater, setCheater] = useState(true);
  const [transfer, setTransfer] = useState(true);

  const steps = [10, 20, 50, 100, 200, 500, 1000];
  const [sliderBet, setSliderBet] = useState(steps[0]);

  const navigate = useNavigate();

  const handleSliderChange = (e) => {
    const stepIndex = parseInt(e.target.value, 10);
    setSliderBet(steps[stepIndex]);
  };

  const getData = async (newData) => {
    const response = await axios.post('http://127.0.0.1:8000/create_room/durack/', newData);
    return response.data;
  };
  
  const { mutate, isLoading } = useMutation({
    mutationFn: getData,
    onSuccess: (data) => {
      
      if (data.create === true) {
        const idRoom = data.room_id;
        navigate(`/durack/${participants}/${idRoom}`);
      }
    },
  });

      
  return (
    <div className="create-game">
      {isLoading ? 
      'loading':
      ''
      }
      <div className="create-game-header">Створення гри Дурак</div>
      <div className="create-game-body">
      <div className="header-macket"></div>

        {/* Ставка */}
        <div className="field">
          <label>Ставка</label>
          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max={steps.length - 1} // Кількість кроків
              step="1" // Ривками
              value={steps.indexOf(sliderBet)} // Встановлюємо поточний індекс
              onChange={handleSliderChange}
            />
            <div className="slider-value">{sliderBet}$</div>
          </div>
        </div>

        {/* Перемикачі */}
        <div className="switches">
          <div className="container">
            <div className="switch">
              <span>Атака всіх</span>
              <div className="cheater-options">
                <button
                  className={attackAll ? "active" : ""}
                  onClick={() => setAttackAll(true)}
                >
                  так
                </button>
                <button
                  className={!attackAll ? "active" : ""}
                  onClick={() => setAttackAll(false)}
                >
                  ні
                </button>
              </div>
            </div>
            <div className="switch">
              <span>Нічия</span>
              <div className="cheater-options">
                <button
                  className={draw ? "active" : ""}
                  onClick={() => setDraw(true)}
                >
                  так
                </button>
                <button
                  className={!draw ? "active" : ""}
                  onClick={() => setDraw(false)}
                >
                  ні
                </button>
              </div>
            </div>
          </div>
          <div>
          <div className="container">
            <div className="switch">
              <span>Шулер</span>
                <div className="cheater-options">
                  <button
                    className={cheater ? "active" : ""}
                    onClick={() => setCheater(true)}
                  >
                    так
                  </button>
                  <button
                    className={!cheater ? "active" : ""}
                    onClick={() => setCheater(false)}
                  >
                    ні
                  </button>
                </div>
              </div>
              <div className="switch">
                <span>Перевод</span>
                <div className="cheater-options">
                  <button
                    className={transfer ? "active" : ""}
                    onClick={() => setTransfer(true)}
                  >
                    так
                  </button>
                  <button
                    className={!transfer ? "active" : ""}
                    onClick={() => setTransfer(false)}
                  >
                    ні
                  </button>
                </div>
            
              </div>
            </div>

          </div>
        </div>

        {/* Вибір колоди */}
        <div className="container flex-end">

          <div className="cheater-options">
            <button className={isPrivate ? "button-privete active" : "button-privete"} onClick={() => setIsPrivate(!isPrivate)}>
              {!isPrivate ? "публічна" : "приватна"}
            </button>
          </div>


          <div className="field">
            <label>Колода</label>
            <div className="deck-options">
              <button
                className={deckSize === 24 ? "active" : ""}
                onClick={() => setDeckSize(24)}
              >
                24
              </button>
              <button
                className={deckSize === 36 ? "active" : ""}
                onClick={() => setDeckSize(36)}
              >
                36
              </button>
              <button
                className={deckSize === 54 ? "active" : ""}
                onClick={() => setDeckSize(54)}
              >
                54
              </button>
            </div>
          </div>
        </div>
        

        {/* Кількість гравців */}
        <div className="field">
          <label>Кількість гравців</label>
          <div className="player-options">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={participants === num ? "active" : ""}
                onClick={() => setParticipants(num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки */}

        <div className="buttons">
          <div className={!isPrivate ? "full-width" : ""}>
            {isPrivate && (
              <button
                className="change-password"
                onClick={() => setPassword(prompt("Введіть новий пароль", password))}
              >
                пароль ({password})
              </button>
            )}
          </div>
          <button
            onClick={() =>
              mutate({
                participants,
                deckSize,
                sliderBet,
                isPrivate,
                ...(isPrivate ? {} : { password }), 
                password,
                attackAll,
                draw,
                cheater,
                transfer,
              })
            }
            className="create-game-button"
          >
            створити ▶
          </button>
        </div>
        <div className="divider"></div>
      </div>
    </div>
  );
};
