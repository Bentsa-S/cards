// import { wsRoomDurack } from "./wsRoomDurack";
import gsap from "gsap";


export class MovePlayers{
    constructor(classGame, deckDurack, enemyPlayer, app, serverData){
        this.gameZona = classGame
        this.deckDurack = deckDurack
        this.app = app
        this.serverData = serverData
        this.enemyPlayer = enemyPlayer
    }


    turn(number){
        switch (number) {
            case 1:
            this.gameZona.removeZoneAtackPlayer() 
            if(this.serverData.message.type === 'atack'){
                this.deckDurack.getFullDeck().forEach((card) => {
                    if(card.sprite.name === this.serverData.message.name){
                        const x = this.serverData.message.coordinates.x
                        const y = this.serverData.message.coordinates.y
                        if(!card.getZone()){
                            card.sprite.position.x = 1
                            card.sprite.position.y = 1
    
                            this.enemyPlayer.moveCardsEnemy(x, y, card.sprite.texture, card.sprite.name)
                            this.enemyPlayer.cardCount--                            
                            this.enemyPlayer.createCardIcons()    
                        }
                        card.addInteractiveZone(x, y)
                    }
                });
            }
            break;
            case 2:
            this.gameZona.addZoneAtackPlayer()
            if(this.serverData.message.type === 'def'){
                this.deckDurack.getFullDeck().forEach((card) => {
                    if(card.sprite.name === this.serverData.message.name){
                        this.app.stage.addChild(card.sprite);                            
                        card.sprite.interactive = false
                        card.castomMuving = false
                        if(!card.getZone()){
                            card.sprite.position.x = 1
                            card.sprite.position.y = 1
        
                            gsap.to(card.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });
                            gsap.to(card.sprite, { x: this.serverData.message.coordinates.x, y: this.serverData.message.coordinates.y, duration: 0.5, rotation: 0.4 });

    
                        }    
                    }
                });
            }
            default:
                break;
        }
    }
}