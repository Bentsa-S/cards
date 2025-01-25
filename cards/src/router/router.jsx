import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { MainPage } from "../components/main/MainPage";
import { RoomPage } from "../components/rooms/RoomPage";
import SettingsPanel from "../components/settings/SettingsPanel";
import { GamePageDurack } from "../components/gamePage/durack/GamePageDurack";
import { MainCreate } from "../components/create/mainCreate/MainCreate";
import { CreateGameSeka } from "../components/create/sekaCreate/CreateGameSeka";
import { CreateGameDurack } from './../components/create/durackCreate/CreateGameDurack';
import { GamePageSeka } from "../components/gamePage/seka/GamePageSeka";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                element: <MainPage/>,
                index: true,

            },
            {
                element: <RoomPage/>,
                path: "/rooms"
            },
            {
                element: <MainCreate/>,
                path: "/create",
                children: [
                    {
                        element: <CreateGameDurack/>,
                        path: 'durack'
                    },
                    {
                        element: <CreateGameSeka/>,
                        path: 'seka'
                    }
                ]
            }
        ]
    },
    {
        element: <SettingsPanel/>,
        path: '/settings'
    },
    {
        element: <GamePageDurack/>,
        path: '/durack/:numberPlayer/:idRoom'
    },
    {
        element: <GamePageSeka/>,
        path: '/seka/:numberPlayer/:idRoom/:bet'
    }
]);
  