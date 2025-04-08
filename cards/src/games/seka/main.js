import { MovePlayers } from './movePlayers';
import { ButtonReady } from "./button";
import { EnemyPlayer } from "./enemyPlayer";
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
        this.cardFlip = false

        this.goat

        this.user = user
        this.userId = userId
    }

    start(){
        this.WsRoom.postUser(this.user, this.userId)
        
        this.WsRoom.socket.onmessage = (event) => {
            const serverData = JSON.parse(event.data)
            const action = serverData.message.type        
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
            }else if(action === 'swap'){
                this.enemyController.clearEnemyContainer()
                this.enemyController.addButtonSwapPosition(serverData.message.swap)

            }else if(action === 'playerStatus'){

                this.trun = serverData.message.playerStatus
                this.movePlayers.turn(this.trun, this.bet);                
            }else if(action === 'putch'){
                this.gameZone.numberPutch = serverData.message.message                
                this.gameZone.swapCards(serverData.message.card)
            }else if(action === 'take'){
                this.gameZone.animateCard()
            }else if(action === 'prise'){
                this.b.updateText(serverData.message.prise)
            }else if(action === 'apdateTable'){
                this.bet = serverData.message.bet
                this.infoTable.updateBankText(`банк: ${serverData.message.bank}`)
                this.infoTable.updateBetText(`ставка: ${serverData.message.bet}`)
            }else if(action === 'cardFlip'){
                this.movePlayers.removeButtonBlack()
            }else if(action === 'pass'){
                this.enemyController.enemyPass(serverData.message.id)
            }else if(action === 'look'){                
                this.enemyController.lookEnemyCards(serverData.message.id_loos, serverData.message.id_win, serverData.message.cards, serverData.message.loos)
                this.deckSeka.flipAllCards()

                if (!serverData.message.loos) {
                    setTimeout(() => {
                        this.deckSeka.loseAnimation();
                    }, 3000);
                }
            }else if(action === 'hideOpponentButton'){                
                this.movePlayers.addButtonHideOpponent()
            }else if(action === 'win'){   
                setTimeout(() => {
                    if(serverData.message.id == this.userId){
                        this.gameZone.winPlayer()
                    }else{
                        this.enemyController.animationWinEnemy(serverData.message.id)
                    }
    
                }, 3200);
            }else if(action === 'restart'){
                this.deckSeka.removeCards()
                this.enemyController.removeCardsEnemy()
                if(this.enemyController.checkFullEnemy()){
                    const buttonReady = new ButtonReady(this.app, this.WsRoom, 'Ready')
                    buttonReady.addClick()
                    buttonReady.addToStage()            
                }
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