import { RoomContainer } from "./roomContainer"
import "@/components/rooms/RoomPage.scss";



export const RoomPage = () => {
    return(
        <div className="room-page">
            <div className="header">
                <p>кімнати</p>
            </div>
            <div className="rooms-info">
                <RoomContainer/>
                <RoomContainer/>
                <RoomContainer/>
            </div>
        </div>
    )
}