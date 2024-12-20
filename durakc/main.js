import { WsRoomDurack } from "./wsRoomDurack";
import { DurackGame } from './durackGame'
import { DeckDurack } from './durakDeck';
import { MovePlayers } from './movePlayers';
import { ButtonReady, ButtonTeka, ButtonWhipped } from "./button";
import { EnemyPlayer } from "./enemyPlayer";
import { ButtonControler } from "./buttonController";
import { EnemyPlayerController } from "./enemiPlayersController";


export class MainControllerGame{
    constructor(app, numberPlayer = 2, roomId = 1, user = '', userId = 0){
        this.app = app
        this.WsRoom = new WsRoomDurack(numberPlayer, roomId, userId)
        this.cards
        this.numberPlayer = numberPlayer
        this.deckDurack = new DeckDurack(this.app);
        this.enemyPlayer = new EnemyPlayer(this.app)
        this.enemyController = new EnemyPlayerController(this.app, this.numberPlayer, userId)
        this.deckDurack.addDeckToGame()
        this.gameZone = new DurackGame(this.app, this.deckDurack);
        this.movePlayers = new MovePlayers(this.gameZone, this.deckDurack, this.enemyController, this.app);
        this.trun


        this.goat

        this.user = user
        this.userId = userId
    }

    start(){
        
        this.WsRoom.postUser(this.user, this.userId)
        const buttonWhipped = new ButtonControler(this.app, this.WsRoom, this.gameZone, this.enemyPlayer)
        buttonWhipped.addButton()

        // this.enemyController.addButtonSwapPosition()
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
                this.enemyController.addButtonSwapPosition(serverData.message.order)
                if(this.enemyController.checkFullEnemy()){
                    const buttonReady = new ButtonReady(this.app, this.WsRoom, 'Ready')
                    buttonReady.addClick()
                    buttonReady.addToStage()            
                }
                // this.enemyPlayer.addName(serverData.message.name)
                // this.enemyPlayer.addEnemy(400, 60)
            }else if(action === 'swap'){
                this.enemyController.clearEnemyContainer()
                this.enemyController.addButtonSwapPosition(serverData.message.swap)

            }else if(action === 'playerStatus'){

                this.trun = serverData.message.playerStatus
                this.movePlayers.turn(this.trun, this.goat, serverData);                
            }else if(action === 'atack'){
                console.log(this.trun);
                this.movePlayers.turn(this.trun, this.goat, serverData);

            }else if(action === 'def'){
                this.movePlayers.turn(this.trun, this.goat, serverData);

            }else if(action === 'whipped'){
                this.gameZone.clearCardZone()
                this.deckDurack.audit()
                this.enemyPlayer.whippedMove(this.deckDurack)
                this.enemyController.allEnemyAudit();
            }else if(action === 'teka'){
                this.deckDurack.audit()                
                this.enemyController.moveTake(this.deckDurack, serverData.message.id)
                this.gameZone.clearCardZone()                
            }else if(action === 'goat'){
                this.deckDurack.addGoat(serverData.message.goat)
                this.goat = serverData.message.goat
            }

        }
        

    }    

}