
export const wsRoomDurack = new WebSocket('ws://127.0.0.1:8000/')


export function postCoordinatesCadsDefP(x, y, name){
    const message = {
        type: 'card_move',
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


