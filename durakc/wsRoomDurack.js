
// export const wsRoomDurack = new WebSocket('ws://127.0.0.1:8000/')

export class WsRoomDurack{
    static socket
    constructor(){
        this.socket = this.getSocket()
        // this.postRedy()
    }

    getSocket(){
        if(!WsRoomDurack.socket){
            WsRoomDurack.socket = new WebSocket('ws://127.0.0.1:8000/')
        }
        return WsRoomDurack.socket
    }

    postReady(){    
        WsRoomDurack.socket.send(JSON.stringify({type: 'redy'}));
    }

    postCoordinatesCadsAtackP(x, y, name){
        const message = {
            type: 'atack',
            name: name,
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
            coordinates: {
                x: x,
                y: y
            }
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