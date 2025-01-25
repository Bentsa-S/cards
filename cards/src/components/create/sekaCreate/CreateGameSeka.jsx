import { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

export const CreateGameSeka = () => {
  const [seven, setSeven] = useState(false);
  const [participants, setParticipants] = useState(3);
  const [password, setPassword] = useState("1111");
  const [isPrivate, setIsPrivate] = useState(true);
  // Стани для перемикачів
  const [hew, setHew] = useState(true);
  const [push, setPush] = useState(true);

  const steps = [10, 20, 50, 100, 200, 500, 1000];
  const [sliderBet, setSliderBet] = useState(steps[0]);

  const navigate = useNavigate();

  const handleSliderChange = (e) => {
    const stepIndex = parseInt(e.target.value, 10);
    setSliderBet(steps[stepIndex]);
  };

  const getData = async (newData) => {
    const response = await axios.post('http://127.0.0.1:8000/create_room/seka/', newData);
    return response.data;
  };
  
  const { mutate, isLoading } = useMutation({
    mutationFn: getData,
    onSuccess: (data) => {
      
      if (data.create === true) {
        const idRoom = data.room_id;
        navigate(`/seka/${participants}/${idRoom}/${sliderBet}`);
      }
    },
  });

      
  return (
    <div className="create-game">
      {isLoading ? 
      'loading':
      ''
      }
      <div className="create-game-header">Створення гри Сека</div>
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
              <span>Тесати</span>
              <div className="cheater-options">
                <button
                  className={hew ? "active" : ""}
                  onClick={() => setHew(true)}
                >
                  так
                </button>
                <button
                  className={!hew ? "active" : ""}
                  onClick={() => setHew(false)}
                >
                  ні
                </button>
              </div>
            </div>
            <div className="switch">
              <span>Сунути</span>
              <div className="cheater-options">
                <button
                  className={push ? "active" : ""}
                  onClick={() => setPush(true)}
                >
                  так
                </button>
                <button
                  className={!push ? "active" : ""}
                  onClick={() => setPush(false)}
                >
                  ні
                </button>
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
                className={seven === true ? "active" : ""}
                onClick={() => setSeven(true)}
              >
                1
              </button>
              <button
                className={seven === false ? "active" : ""}
                onClick={() => setSeven(false)}
              >
                3
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
                seven,
                sliderBet,
                isPrivate,
                ...(isPrivate ? {} : { password }), 
                password,
                hew,
                push,
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
