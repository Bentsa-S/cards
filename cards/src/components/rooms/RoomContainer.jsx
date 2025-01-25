import "@/components/rooms/RoomContainer.scss";
import { NavLink } from 'react-router-dom';


export const RoomContainer = () => {    
    return (
        <NavLink to={'/durack/5/1'}>
            <div className="room-info">
                <div className="room-name">назва кімнати</div>
                <div className="room-details">
                    <span className="room-capacity">1К</span>
                    <div className="room-icon">
                        <span className="room-users">1/3</span>

                        <span role="img" aria-label="user-icon">👤</span>
                    </div>
                    <div className="room-bars">
                        <div className="bar active"></div>
                        <div className="bar active"></div>
                        <div className="bar active"></div>
                        <div className="bar inactive"></div>
                    </div>
                </div>
            </div>

        </NavLink>
    );
}