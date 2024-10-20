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
        this.Gamezone = new DurackGame(this.app, this.deckDurack);

    }

    start(){
        this.deckDurack.addDeckToGame()
        const buttonReady = new Button(this.app, this.WsRoom, 'Ready')
        buttonReady.addClickRedi()
        buttonReady.onClickRedi
        buttonReady.addToStage()
        let movePlayers

        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)

        
            console.log(serverData.message);
            if(serverData.cards){
                if(this.cards){
                    this.cards.concat(serverData.cards) 
                    console.log(this.cards);
                    
                }else{
                    this.cards = serverData.cards
                }
    
                this.deckDurack.addPlayerCards(this.cards);
                this.enemyPlayer.cardCount = 6
                this.enemyPlayer.createCardIcons()
                
                // deckDurack.addItemDeckCards('10Spades')
                
                // deckDurack.addGoat()
                // seelvePlayer.audit()
                
            }
            if (serverData.message.type === 'name'){
                console.log(serverData.message.name);
                
                this.enemyPlayer.addName(serverData.message.name)
                this.enemyPlayer.addEnemy(400, 60)
            }

            // if(serverData.message.type === 'redy'){

            //     movePlayers = new MovePlayers(this.Gamezone, this.deckDurack, this.app, serverData);
            //     movePlayers.turn(1);
            // }
            if(serverData.message.type === 'atack'){

                movePlayers = new MovePlayers(this.Gamezone, this.deckDurack, this.enemyPlayer, this.app, serverData);
                movePlayers.turn(1);
            }
            
            
            if(serverData.message.type === 'goat'){
                this.deckDurack.addGoat(serverData.message.goat)
            }

        }
        

    }
}