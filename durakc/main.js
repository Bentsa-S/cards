import { WsRoomDurack } from "./wsRoomDurack";
import { DurackGame } from './durackGame'
import { DeckDurack } from './durakDeck';
import { MovePlayers } from './movePlayers';
import { ButtonReady, ButtonTeka, ButtonWhipped } from "./button";
import { EnemyPlayer } from "./enemyPlayer";
import { ButtonControler } from "./buttonController";


export class MainControllerGame{
    constructor(app){
        this.app = app
        this.WsRoom = new WsRoomDurack()
        this.cards
        this.deckDurack = new DeckDurack(this.app);
        this.enemyPlayer = new EnemyPlayer(this.app)
        this.deckDurack.addDeckToGame()
        this.gameZone = new DurackGame(this.app, this.deckDurack);
        this.movePlayers = new MovePlayers(this.gameZone, this.deckDurack, this.enemyPlayer, this.app);
        this.trun


        this.goat
    }

    start(){
        
        const buttonReady = new ButtonReady(this.app, this.WsRoom, 'Ready')
        buttonReady.addClick()
        buttonReady.onClick
        buttonReady.addToStage()

        const buttonWhipped = new ButtonControler(this.app, this.WsRoom, this.gameZone)
        buttonWhipped.addButton()
        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)
            const action = serverData.message.type
            // if(!serverData.message.type){
            //     serverData.cards.type = ' '
            // }
        
            console.log(serverData.message);
            if(action === 'cards'){ 
                this.deckDurack.addPlayerCards(serverData.message.cards);
                this.enemyPlayer.cardCount = 6
                this.enemyPlayer.createCardIcons()
                
                // deckDurack.addItemDeckCards('10Spades')
                
                // deckDurack.addGoat()
                // seelvePlayer.audit()
                
            }else if (action === 'name'){
                console.log(serverData.message.name);
                
                this.enemyPlayer.addName(serverData.message.name)
                this.enemyPlayer.addEnemy(400, 60)
            }else if(action === 'playerStatus'){

                this.trun = serverData.message.playerStatus
                this.movePlayers.turn(this.trun, this.goat, serverData);
                
            }else if(action === 'atack'){
                console.log(this.trun);
                const buttonControler = new ButtonControler(this.app, this.WsRoom, this.gameZone, this.deckDurack)
                buttonControler.addButton(serverData.message.type)
                this.movePlayers.turn(this.trun, this.goat, serverData);

            }else if(action === 'def'){
                this.movePlayers.turn(this.trun, this.goat, serverData);
                const buttonControler = new ButtonControler(this.app, this.WsRoom, this.gameZon, this.deckDurack)
                buttonControler.addButton(serverData.message.type)

            }else if(action === 'whipped'){
                this.assss()
                this.enemyPlayer.auditEnemy()
                // this.enemyPlayer.whippedMove(this.deckDurack)
                // this.gameZone.clearCardZone()
                // this.deckDurack.audit()
            }else if(action === 'teka'){
                this.enemyPlayer.takeMove(this.deckDurack)
                this.gameZone.clearCardZone()
                this.enemyPlayer.auditEnemy()
            }else if(action === 'goat'){
                this.deckDurack.addGoat(serverData.message.goat)
                this.goat = serverData.message.goat
            }

        }
        

    }

    async assss() {
        await this.enemyPlayer.whippedMove(this.deckDurack);
        console.log(2);
        this.gameZone.clearCardZone()
        this.deckDurack.audit()

    }

    async aaddd(){
        this.enemyPlayer.takeMove(this.deckDurack)
        this.gameZone.clearCardZone()
        this.enemyPlayer.auditEnemy()

    }

}