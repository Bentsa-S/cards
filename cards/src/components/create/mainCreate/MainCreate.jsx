import { NavLink, Outlet } from "react-router-dom"
import './MainCreate.scss'


export const MainCreate = () => {
    return(
        <>
            <Outlet/>
            <div className="game-selection">
                {/* <button>покер</button> */}
                <NavLink
                    to="seka"
                    className={({ isActive }) => isActive ? 'button-create-nav active' : 'button-create-nav'}
                >
                сека
                </NavLink>
                <NavLink
                    to="durack"
                    className={({ isActive }) => isActive ? 'button-create-nav active' : 'button-create-nav'}
                >
                дурак
                </NavLink>
            </div>

        </>
    )
}