
export const wsRoomDurack = new WebSocket('ws://127.0.0.1:8000/')


export function postCoordinatesCadsAtackP(x, y, name){
    const message = {
        type: 'atack',
        name: name,
        coordinates: {
            x: x,
            y: y
        }
    };
    if (wsRoomDurack.readyState === WebSocket.CONNECTING) {
        wsRoomDurack.addEventListener('open', () => {
            wsRoomDurack.send(JSON.stringify(message));
        });
    } else if (wsRoomDurack.readyState === WebSocket.OPEN) {
        wsRoomDurack.send(JSON.stringify(message));
    } else {
        console.error("WebSocket is not ready to send data. Current state: ", wsRoomDurack.readyState);
    }
}

export function postCoordinatesCadsDefP(x, y, name){
    const message = {
        type: 'def',
        name: name,
        coordinates: {
            x: x,
            y: y
        }
    };
    if (wsRoomDurack.readyState === WebSocket.CONNECTING) {
        wsRoomDurack.addEventListener('open', () => {
            wsRoomDurack.send(JSON.stringify(message));
            console.log(message);
            
        });
    } else if (wsRoomDurack.readyState === WebSocket.OPEN) {
        wsRoomDurack.send(JSON.stringify(message));
        console.log(message);

    } else {
        console.error("WebSocket is not ready to send data. Current state: ", wsRoomDurack.readyState);
    }
}


export async function getShuffledDeck() {
        const response = await fetch('http://127.0.0.1:8000/rooms/');
        const data = await response.json();
        console.log("Отримана колода:", data.deck);
        return data.deck;
}
