import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import "@/components/main/MainPage.scss";

export const MainPage = () => {
  const [prise, setPrise] = useState('');
  const [userName, setUserName] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.setAttribute('background-theme', `${Number(localStorage.getItem('backgroundOption')) ?? 1}-${localStorage.getItem('theme') ?? "light"}`);
    document.documentElement.setAttribute('button-theme', `${localStorage.getItem('buttonColor') ?? "red"}-${localStorage.getItem('theme') ?? "light"}`);
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') ?? "light");
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const userData = window.Telegram.WebApp.initDataUnsafe?.user;

            if (userData?.id) {
                const response = await axios.get(`http://127.0.0.1:8000/players/get-user/`, {
                    params: { id_user: userData.id },
                });
                setPrise(response.data.prise);
                setUserName(response.data.name);
            } else {
                setError('Користувач не знайдений');
            }
        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || 'Помилка запиту');
            } else {
                setError('Помилка з\'єднання');
            }
        }
    };

    fetchUserData();
}, []);

  return (
    <div className="dashboard">
      <div className="header">
        <div className="avatar"></div>
        <div>{userName}</div>
        <div className="balance">{prise}$</div>
      </div>
      <div className="divider"></div>

      <div className="buttons">
        <div className='button-row'>
            <button className="btn">Доссягнення</button>
        </div>

        <div className="button-row">
          <button className="btn">Правила ігор</button>
          <button className="btn">Предмети</button>
        </div>

        <div className="button-row">
          <button className="btn">Друзі</button>
          <NavLink to={'/settings'} className="btn">Настройки</NavLink>
        </div>

        <div className='button-row'>
            <button className="btn">Швидка гра</button>
        </div>
      </div>
    </div>
  );
};
