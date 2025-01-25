import { MovePlayers } from './movePlayers';
import { ButtonPutch, ButtonReady } from "./button";
import { EnemyPlayer } from "./enemyPlayer";
import { ButtonControler } from "./buttonController";
import { EnemyPlayerController } from "./enemiPlayersController";
import { SekaDeck } from "./sekaDeck";
import { SekaGame } from "./sekaGame";
import { WsRoomSeka } from "./wsRoomSeka";
import { InfoTable, TransparentRectangleWithText } from './grapficElements';
// const bottom = new TransparentRectangleWithText(pixiApp, 'Ставка: 1000')
// const ws = new WsRoomSeka(4, 1, 12)
// const enemys = new EnemyPlayerController(pixiApp, 4, 12)
// enemys.addButtonSwapPosition(p)
// const game = new SekaGame(pixiApp)
// const deck = new SekaDeck(pixiApp, enemys, 12)
// const button = new ButtonControler(pixiApp, ws)
// deck.addDeckToGame()
// game.createPrintCards()
// button.addButtons()

// deck.givCards(p, ["J-Diamonds", "J-Hearts", "J-Spades"])


export class MainControllerGame{
    constructor(app, numberPlayer = 2, bet = 1, roomId = 1, user = '', userId = 0){
        this.app = app
        this.bet = bet
        this.WsRoom = new WsRoomSeka(numberPlayer, roomId, userId, bet)
        this.cards
        this.numberPlayer = numberPlayer
        this.enemyPlayer = new EnemyPlayer(this.app)
        this.enemyController = new EnemyPlayerController(this.app, this.numberPlayer, userId)
        this.deckSeka = new SekaDeck(this.app, this.enemyController, userId);

        this.deckSeka.addDeckToGame()
        this.gameZone = new SekaGame(this.app, this.deckSeka);
        this.movePlayers = new MovePlayers(this.gameZone, this.deckSeka, this.enemyController, this.app);
        this.trun
        this.b
        this.infoTable

        this.goat

        this.user = user
        this.userId = userId
    }

    start(){
        
        this.WsRoom.postUser(this.user, this.userId)
        // this.gameZone.createSlider()
        // this.gameZone.createPrintCards() 
        // this.gameZone.flipCards()
        // this.gameZone.createPrintCards() 


        console.log(1);
        
        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)
            const action = serverData.message.type
            // if(!serverData.message.type){
            //     serverData.cards.type = ' '
            // }
        
            console.log(serverData.message);
            if(action === 'cards'){ 
                this.deckSeka.givCards(serverData.message.players, serverData.message.cards);
            }else if (action === 'name'){
                this.enemyController.addButtonSwapPosition(serverData.message.order)
                if (!this.b) {
                    const player = serverData.message.order.find(item => item.id === this.userId);
                    this.infoTable = new InfoTable(this.app, `ставка: ${this.bet}`, 'банк: 0')
                    if (player) {
                        this.b = new TransparentRectangleWithText(this.app, player.prise);
                    }
                }
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
            }else if(action === 'putch'){
                this.gameZone.numberPutch = serverData.message.message                
                this.gameZone.swapCards(serverData.message.card)
            }else if(action === 'take'){
                this.gameZone.animateCard()
            }else if(action === 'prise'){
                this.b.updateText(serverData.message.prise)
            }else if(action === 'apdateTable'){
                this.infoTable.updateBankText(serverData.message.bank)
                this.infoTable.updateBetText(serverData.message.bet)
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