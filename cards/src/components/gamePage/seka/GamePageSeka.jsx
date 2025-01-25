import { useEffect, useState, useRef } from "react";
import * as PIXI from 'pixi.js';
import { useParams } from 'react-router-dom';
import { MainControllerGame } from '../../../games/seka/main';
import './GamePageSeka.scss';

export const GamePageSeka = () => {
  const [loading, setLoading] = useState(true);
  const backgroundOption = Number(localStorage.getItem('backgroundOption')) || 1;
  const theme = localStorage.getItem('theme') || 'light';
  const canvasRef = useRef(null);
  const { idRoom, numberPlayer, bet } = useParams();
  const userData = window.Telegram.WebApp.initDataUnsafe?.user;


  useEffect(() => {
    const initGame = async () => {
        setLoading(true);

        const pixiApp = new PIXI.Application({
            resizeTo: window,
            view: canvasRef.current,
        });
        
        const backgroundTexture = await PIXI.Assets.load(
            new URL(`../../../assets/game-backgrount/${theme}/${backgroundOption}.jpg`, import.meta.url).href
        );
          
        const backgroundSprite = new PIXI.Sprite(backgroundTexture);
        backgroundSprite.width = pixiApp.screen.width;
        backgroundSprite.height = pixiApp.screen.height;
        backgroundSprite.zIndex = -1000;

        pixiApp.stage.addChild(backgroundSprite);
          
        pixiApp.stage.sortableChildren = true;

        await new Promise((resolve) => setTimeout(resolve, 1000));

        // const main = new MainControllerGame(pixiApp, numberPlayer, idRoom, userData.first_name, userData.id);
        const main = new MainControllerGame(pixiApp, numberPlayer, bet, idRoom, 'vasa', 1);

        if (main) {
            main.checkWebSocketConnection().then(() => {
                main.start();
                setLoading(false);
            }).catch(error => {
                console.error('WebSocket connection failed:', error);
                setLoading(false);
            });
        }

    };

    initGame();

    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
      }
    };
  }, [theme, backgroundOption]);

  return (
    <div className="game-container">
      {loading && <div className="loading-overlay">Loading...</div>}
      <canvas ref={canvasRef} />
    </div>
  );
};
