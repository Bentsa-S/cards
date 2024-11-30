
// export const wsRoomDurack = new WebSocket('ws://127.0.0.1:8000/')

export class WsRoomDurack{
    static socket;
    static userId;


    static getSocket(numberPlayer = 0, roomId = 0) {
        if (!this.socket) {
            this.socket = new WebSocket(`ws://127.0.0.1:8000/durack/${numberPlayer}/${roomId}/`);
        }
        return this.socket;
    }

    static getUserId(id){
        if (!this.userId){
            this.userId = id
        }
        return this.userId
    }
    constructor(numberPlayer = 0, roomId = 0, userId = 0) {
        this.socket = WsRoomDurack.getSocket(numberPlayer, roomId);
        this.userId = WsRoomDurack.getUserId(userId)
    }

    // getSocket(numberPlayer = 0, roomId = 0){
    //     if(!WsRoomDurack.socket){
    //         WsRoomDurack.socket = new WebSocket(`ws://127.0.0.1:8000/durack/${numberPlayer}/${roomId}/`)
    //     }
    //     return WsRoomDurack.socket
    // }
    // WsRoomDurack.socket.onopen = () => {
    //     this.postUser();
    // };

    
    postUser(user, userId) {
        this.socket.addEventListener('open', () => {
            this.socket.send(JSON.stringify({
                type: 'user',
                name: user,
                id: userId
            }));
        })
    }

    postReady() {
        console.log(1);
        if (this.socket.readyState === WebSocket.OPEN) {
            console.log(2);
            
            WsRoomDurack.socket.send(JSON.stringify({ type: 'redy' }));
        } else {
            console.log("WebSocket is not open yet");
        }
    }

    postSwapPosition(number){
        const message = {
            type: 'swap',
            number: number,
        };
        this.socket.send(JSON.stringify(message));

    }

    postCoordinatesCadsAtackP(x, y, name){
        const message = {
            type: 'atack',
            name: name,
            id: this.userId,
            coordinates: {
                x: x,
                y: y
            }
        };
        this.socket.send(JSON.stringify(message));
    }

    getCards(number){
        const message = {
            type: 'getCards',
            number: number,
        };
        this.socket.send(JSON.stringify(message));
    }

    postCoordinatesCadsDefP(x, y, name){
        const message = {
            type: 'def',
            name: name,
            id: this.userId,
            coordinates: {
                x: x,
                y: y
            }
        };
        WsRoomDurack.socket.send(JSON.stringify(message));
    }

    postImTeka(){
        const message = {
            type: 'teka',
            id: this.userId,
        };
        WsRoomDurack.socket.send(JSON.stringify(message));

    }

    postImPass(){
        const message = {
            type: 'pass',
            id: this.userId,
        };
        WsRoomDurack.socket.send(JSON.stringify(message));
    }
    postWhipped(){
        const message = {
            type: 'whipped',
            id: this.userId,
        };
        WsRoomDurack.socket.send(JSON.stringify(message));

    }

    getAuditCard(number){
        const message = {
            type: 'audit',
            numberCard: number
        };
        WsRoomDurack.socket.send(JSON.stringify(message));

    }
}





// postRedy()

// wsRoomDurack.onmessage = (event) => {
//     const serverData = JSON.parse(event.data)

//     console.log(serverData.cards);
    
//     const deckDurack = new DeckDurack(pixiApp, serverData.cards);
//     deckDurack.addDeckToGame();
    
    
//     // deckDurack.addItemDeckCards('10Spades')
    
//     deckDurack.addGoat()
//     deckDurack.addMapDeckCards();
    
//     const seelvePlayer = new SeelvePlayer(deckDurack)
    
//     // seelvePlayer.audit()
//     const zone = new DurackGame(pixiApp, deckDurack, seelvePlayer);
//     zone.addZoneAtackPlayer();
    
//     const movePlayers = new MovePlayers(zone, deckDurack, pixiApp);
//     movePlayers.turn(2);
// }