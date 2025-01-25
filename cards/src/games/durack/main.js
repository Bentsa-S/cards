import { WsRoomDurack } from "./wsRoomDurack";
import { DurackGame } from './durackGame'
import { DeckDurack } from './durakDeck';
import { MovePlayers } from './movePlayers';
import { ButtonReady } from "./button";
import { EnemyPlayer } from "./enemyPlayer";
import { ButtonControler } from "./buttonController";
import { EnemyPlayerController } from "./enemiPlayersController";
import { TransparentRectangleWithText } from "./grapficElements";


export class MainControllerGame{
    constructor(app, numberPlayer = 2, roomId = 1, user = '', userId = 0){
        this.app = app
        this.WsRoom = new WsRoomDurack(numberPlayer, roomId, userId)
        this.cards
        this.numberPlayer = numberPlayer
        this.transparentRectangleWithText = new TransparentRectangleWithText(this.app, '1', '222')
        this.deckDurack = new DeckDurack(this.app);
        this.deckDurack.addDeckToGame()
        this.gameZone = new DurackGame(this.app, this.deckDurack);
        this.enemyPlayer = new EnemyPlayer(this.app, this.gameZone)
        this.enemyController = new EnemyPlayerController(this.app, this.numberPlayer, userId, this.gameZone)

        this.movePlayers = new MovePlayers(this.gameZone, this.deckDurack, this.enemyController, this.app);
        this.trun


        this.goat

        this.user = user
        this.userId = userId
    }

    async start(){    
        this.transparentRectangleWithText.addFromStage()
        this.WsRoom.postUser(this.user, this.userId)
        const buttonWhipped = new ButtonControler(this.app, this.WsRoom, this.gameZone, this.enemyPlayer)
        buttonWhipped.addButton()

        // this.enemyController.addButtonSwapPosition()
        this.WsRoom.socket.onmessage = async (event) => {
            const serverData = JSON.parse(event.data)
            const action = serverData.message.type
            // if(!serverData.message.type){
            //     serverData.cards.type = ' '
            // }
        
            console.log(serverData.message);
            if(action === 'cards'){ 
                this.deckDurack.addPlayerCards(serverData.message.cards);
                this.enemyController.getAllEnemyCards()
                this.transparentRectangleWithText.keepOnTop()
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
                this.movePlayers.turn(this.trun, this.goat, serverData);
            }else if(action === 'def'){
                this.movePlayers.turn(this.trun, this.goat, serverData);

            }else if(action === 'whipped'){
                await this.enemyPlayer.whippedMove(this.deckDurack);
                this.deckDurack.audit()
                this.enemyController.allEnemyAudit();
                this.gameZone.clearCardZone()

            }else if(action === 'teka'){
                this.deckDurack.audit()                
                this.enemyController.moveTake(this.deckDurack, serverData.message.id)
                this.gameZone.clearCardZone()                
            }else if(action === 'goat'){
                this.deckDurack.addGoat(serverData.message.goat)
                this.goat = serverData.message.goat
            }else if(action === 'addLastCard'){
                EnemyPlayer.oneCardCount = 0
                this.enemyController.takeGoadEnemy(serverData.message.id, this.deckDurack.goat)
            }else if(action === 'giveMeLastCard'){
                EnemyPlayer.oneCardCount = 0
            }

        }
        

    }    


    checkWebSocketConnection() {
        return new Promise((resolve, reject) => {
            this.WsRoom.socket.addEventListener('open', () => {
                resolve();  // Підключення успішне
            });

            this.WsRoom.socket.addEventListener('error', (error) => {
                console.error('WebSocket error:', error);
                reject('WebSocket connection failed');  // Не вдалося підключитися
            });
        });
    }

}