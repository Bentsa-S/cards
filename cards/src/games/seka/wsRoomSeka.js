
// export const wsRoomDurack = new WebSocket('ws://127.0.0.1:8000/')

export class WsRoomSeka{
    static socket;
    static userId;


    static getSocket(numberPlayer = 0, roomId = 0, bet) {
        if (!this.socket) {
            this.socket = new WebSocket(`ws://127.0.0.1:8000/seka/${numberPlayer}/${roomId}/${bet}/`);
            this.socket.addEventListener('open', () => {
            });

        }
        return this.socket;
    }

    static getUserId(id){
        if (!this.userId){
            this.userId = id
        }
        return this.userId
    }
    constructor(numberPlayer = 0, roomId = 0, userId = 0, bet = 0) {
        this.socket = WsRoomSeka.getSocket(numberPlayer, roomId, bet);
        this.userId = WsRoomSeka.getUserId(userId)
    }

    // WsRoomSeka.socket.onopen = () => {
    //     this.postUser();
    // };
    
    
    postUser(user, userId) {
        if (this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.addEventListener('open', () => {
                this.socket.send(JSON.stringify({ type: 'user', name: user, id: userId }));
            });
        } else if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type: 'user', name: user, id: userId }));
        } else {
            console.error('WebSocket is not open or connecting');
        }
    }
    
    postReady() {
        if (this.socket.readyState === WebSocket.OPEN) {
            WsRoomSeka.socket.send(JSON.stringify({ type: 'redy' }));
        } 
    }

    postSwapPosition(number){
        const message = {
            type: 'swap',
            number: number,
        };
        this.socket.send(JSON.stringify(message));

    }

    postCoordinatesCadsAtackP(x, y, name, atack){
        const message = {
            type: 'atack',
            name: name,
            atack: atack,
            id: this.userId,
            coordinates: {
                x: x,
                y: y
            }
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }


    postCoordinatesCadsDefP(x, y, name, def){
        const message = {
            type: 'def',
            name: name,
            def: def,

            id: this.userId,
            coordinates: {
                x: x,
                y: y
            }
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }

    getCards(number){
        const message = {
            type: 'getCards',
            number: number,
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }

    postTake(){
        const message = {
            type: 'take',
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }
    
    getRedyTake(){
        const message = {
            type: 'redyTake',
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }

    endSwapCards(){
        const message = {
            type: 'endSwapCards',
        };
        WsRoomSeka.socket.send(JSON.stringify(message));  
    }

    postImPass(){
        const message = {
            type: 'pass',
            id: this.userId,
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
    }

    postPlay(){
        const message = {
            type: 'play',
        };
        WsRoomSeka.socket.send(JSON.stringify(message));

    }

    getAuditCard(number){
        const message = {
            type: 'audit',
            numberCard: number
        };
        WsRoomSeka.socket.send(JSON.stringify(message));

    }

    postPutch(value){
        const message = {
            type: 'putch',
            message: value,
        };
        WsRoomSeka.socket.send(JSON.stringify(message));
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