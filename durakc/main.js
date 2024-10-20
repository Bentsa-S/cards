import { WsRoomDurack } from "./wsRoomDurack";
import { DurackGame } from './durackGame'
import { DeckDurack } from './durakDeck';
import { MovePlayers } from './movePlayers';
import { SeelvePlayer } from './sleevePlayer';


export class MainControllerGame{
    constructor(app){
        this.app = app
        this.WsRoom = new WsRoomDurack()
        this.cards
    }

    start(){
        let deckDurack
        this.WsRoom.postRedy()
        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)

        
            console.log(serverData.message);
            if(this.cards){
                this.cards.concat(serverData.cards) 
                console.log(this.cards);
                
            }else{
                this.cards = serverData.cards
            }
            
            if(serverData.cards){
                deckDurack = new DeckDurack(this.app, this.cards);
                deckDurack.addNewDeckToGame(serverData.cards);
                
                
                // deckDurack.addItemDeckCards('10Spades')
                
                deckDurack.addGoat()
                deckDurack.addMapDeckCards();
                const seelvePlayer = new SeelvePlayer(deckDurack)
            
                // seelvePlayer.audit()
                const zone = new DurackGame(this.app, deckDurack, seelvePlayer);
                zone.addZoneAtackPlayer();
                
                const movePlayers = new MovePlayers(zone, deckDurack, this.app);
                movePlayers.turn(2);
    
            }

        }
        

    }
}