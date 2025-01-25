
import { ButtonSwapPosition } from './button';
import { EnemyPlayer } from './enemyPlayer';
import { WsRoomDurack } from './wsRoomDurack';

export class EnemyPlayerController{
    constructor(app, numberPlayers, userId, gameZone){
        this.numberPlayers = numberPlayers
        this.app = app
        this.userId = userId
        this.gameZone = gameZone
        this.wsRoom = new WsRoomDurack()
        this.enemyPosition
        this.enemyContainer = new Map()
        this.addEnemyPosition()
    }

    moveCards(x, y, cards, nameCards, id, rotation = 0){
        this.enemyContainer.forEach((enemy) => {
            if (enemy.userId === id){
                enemy.moveCardsEnemy(x, y, cards, nameCards, rotation)
                enemy.createCardIcons()  
                return true
            }
        })
    }

    takeGoadEnemy(id, goad){
        this.enemyContainer.forEach((enemy) => {
            if (enemy.userId === id){
                enemy.takeGoad(goad)
                return true
            }
        })
    }

    moveWhipped(deck, id){
        this.enemyContainer.forEach((enemy) => {
            if (enemy.userId === id){
                enemy.whippedMove(deck)
                return true
            }
        })
    }

    moveTake(deck, id){
        this.enemyContainer.forEach((enemy) => {
            if (enemy.userId === id){
                enemy.takeMove(deck)
                return true
            }
        })
    }

    allEnemyAudit(){
        this.enemyContainer.forEach(enemy => {
            enemy.auditEnemy()
        })
    }

    addButtonSwapPosition(players){
        let sortedPlayers
        
        const index = players.findIndex(player => player.id === this.userId);

        if (index !== -1) {            
            if (players.length === index){
                sortedPlayers.pop();
            }else{
                const after =  players.slice(index + 1); // Після index
                const before = players.slice(0, index + 1); // Включаючи index
            
                sortedPlayers = [...after, ...before];
                sortedPlayers.pop();
            }
        }
        this.enemyContainer.clear()
        for (let i = 1; i < sortedPlayers.length + 1; i++) {
            const player = sortedPlayers[i - 1];
            
            if (player.user) {
                const position = this.enemyPosition[i];
                const enemy = new EnemyPlayer(this.app, this.gameZone, player.id);
                enemy.addName(player.name);
                enemy.addEnemy(position.x, position.y);
                this.enemyContainer.set(player.id, enemy)
            } else {
                const position = this.enemyPosition[i];
                const button = new ButtonSwapPosition(this.app, this.wsRoom, player.number, position.x, position.y, player.number);
                button.addClick()
                button.addToStage();

                this.enemyContainer.set(`button-${player.number}`, button)
            }
        }
    }

    clearEnemyContainer() {
        this.enemyContainer.forEach((value, key) => {
            this.enemyContainer.delete(key);
    
            if (value.removeFromStage) {
                value.removeFromStage(); // Видаляємо кнопку
            } else if (value.removeEnemy) {
                value.removeEnemy(); // Видаляємо гравця
            }
        });
    }
        
    checkFullEnemy() {        
        const allAreEnemyPlayers = Array.from(this.enemyContainer.values()).every(
            (enemy) => enemy instanceof EnemyPlayer
        );
        if (allAreEnemyPlayers) {
            return true
        }else{
            return false
        }
    }

    getAllEnemyCards(){
        this.enemyContainer.forEach(enemy => {
            enemy.cardCount = 6
            enemy.createCardIcons()
        })
    }
    addEnemyPosition(){  
              
        switch (this.numberPlayers - 1) {
            case 1:
                this.enemyPosition = {
                    1: {
                        x: this.app.view.width / 2,
                        y: 70
                    },
                };
                break;
            case 2:
                this.enemyPosition = {
                    1: {
                        x: this.app.view.width * 0.3,
                        y: 70
                    },
                    2: {
                        x: this.app.view.width * 0.7,
                        y: 70
                    },
                };

                break;
            case 3:
                this.enemyPosition = {
                    1: {
                        x: this.app.view.width * 0.2,
                        y: 90
                    },
                    2: {
                        x: this.app.view.width / 2,
                        y: 70
                    },                    
                    3: {
                        x: this.app.view.width * 0.8,
                        y: 90
                    },
                };
                break;
            case 4:
                this.enemyPosition = {
                    1: {
                        x: this.app.view.width * 0.15,
                        y: 120
                    },
                    2: {
                        x: this.app.view.width * 0.38,
                        y: 70
                    },                    
                    3: {
                        x: this.app.view.width * 0.62,
                        y: 70
                    },
                    4: {
                        x: this.app.view.width * 0.85,
                        y: 120
                    },
                };
                break;
            case 5:
                this.enemyPosition = {
                    1: {
                        x: this.app.view.width * 0.15,
                        y: 200
                    },
                    2: {
                        x: this.app.view.width * 0.2,
                        y: 90
                    },                    
                    3: {
                        x: this.app.view.width / 2,
                        y: 70
                    }, 
                    4: {
                        x: this.app.view.width * 0.8,
                        y: 90
                    },                  
                    5: {
                        x: this.app.view.width * 0.85,
                        y: 200
                    },
                };
                break;
            default:
                break;
        }
    }

} 