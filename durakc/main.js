import { WsRoomDurack } from "./wsRoomDurack";
import { DurackGame } from './durackGame'
import { DeckDurack } from './durakDeck';
import { MovePlayers } from './movePlayers';
import { Button } from "./button";
import { EnemyPlayer } from "./enemyPlayer";


export class MainControllerGame{
    constructor(app){
        this.app = app
        this.WsRoom = new WsRoomDurack()
        this.cards
        this.deckDurack = new DeckDurack(this.app);
        this.enemyPlayer = new EnemyPlayer(this.app)
        this.deckDurack.addDeckToGame()
        this.gameZone = new DurackGame(this.app, this.deckDurack);
        this.goat
    }

    start(){
        
        const buttonReady = new Button(this.app, this.WsRoom, 'Ready')
        buttonReady.addClickRedi()
        buttonReady.onClickRedi
        buttonReady.addToStage()
        let movePlayers

        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)
            // if(!serverData.message.type){
            //     serverData.cards.type = ' '
            // }
        
            console.log(serverData.message);
            if(serverData.message.type === 'cards'){
                if(this.cards){
                    this.cards.concat(serverData.message.cards) 
                    console.log(this.cards);
                    
                }else{
                    this.cards = serverData.message.cards
                }
    
                this.deckDurack.addPlayerCards(this.cards);
                this.enemyPlayer.cardCount = 6
                this.enemyPlayer.createCardIcons()
                
                // deckDurack.addItemDeckCards('10Spades')
                
                // deckDurack.addGoat()
                // seelvePlayer.audit()
                
            }else if (serverData.message.type === 'name'){
                console.log(serverData.message.name);
                
                this.enemyPlayer.addName(serverData.message.name)
                this.enemyPlayer.addEnemy(400, 60)
            }else if(serverData.message.type === 'redy'){

                movePlayers = new MovePlayers(this.gameZone, this.deckDurack, this.enemyPlayer, this.app, serverData);
                movePlayers.turn(2, this.goat);
                console.log(this.goat);
                
            }else if(serverData.message.type === 'def'){

                movePlayers = new MovePlayers(this.gameZone, this.deckDurack, this.enemyPlayer, this.app, serverData);
                movePlayers.turn(2, this.goat);
            }else if(serverData.message.type === 'goat'){
                this.deckDurack.addGoat(serverData.message.goat)
                this.goat = serverData.message.goat
            }

        }
        

    }
}