import { NavLink } from "react-router";
import { useState } from 'react';
import { ReactSVG } from 'react-svg';
import { useMenuAnimation } from "../../hoocks/useMenuAnimation";

import "@/components/nav/Nav.scss";
import userSvg from '../../assets/userIcone.svg'
import searchSvg from '../../assets/search.svg'
import plusSvg from '../../assets/plus.svg'
import triangleRightSvg from '../../assets/triangleRight.svg'
import triangleLeftSvg from '../../assets/triangleLeft.svg'


export const Nav = () => {
    const [indicatorPosition, setIndicatorPosition] = useState(0);

    useMenuAnimation(setIndicatorPosition)
    return (
        <div className="navigation">
            <ul>
                <li>
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "list active" : "list")}>
                        <img className="icon" src={userSvg} alt="Icon" />
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/rooms"
                        className={({ isActive }) => (isActive ? "list active" : "list")}>
                        <img className="icon" src={searchSvg} alt="Icon" />
                    </NavLink>
                </li>

                <li>
                    <NavLink
                        to="/create/durack"
                        className={({ isActive }) => (isActive ? "list active" : "list")}>
                        <img className="icon" src={plusSvg} alt="Icon" />
                    </NavLink>

                </li>
                <div className="indicator" style={{ transform: `translateX(${indicatorPosition}px)` }}></div>
                <div className="triangle" style={{ transform: `translateX(${indicatorPosition}px)` }}>
                    <ReactSVG src={triangleRightSvg} />
                </div>
                <div className="triangle flipped" style={{ transform: `translateX(${indicatorPosition}px)` }}>
                    <ReactSVG src={triangleLeftSvg} />
                </div>
            </ul>
        </div>
    )
}