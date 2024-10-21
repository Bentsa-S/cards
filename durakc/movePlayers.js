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


    turn(number, goat){
        switch (number) {
            case 1:
            this.gameZona.removeZoneAtackPlayer() 
            if(this.serverData.message.type === 'atack'){
                this.deckDurack.getFullDeck().forEach((card) => {
                    if(card.sprite.name === this.serverData.message.name){
                        const x = this.serverData.message.coordinates.x
                        const y = this.serverData.message.coordinates.y
                        if(!card.getZone()){
                            this.enemyPlayer.moveCardsEnemy(x, y, card.sprite.texture, card.sprite.name)
                            this.enemyPlayer.createCardIcons()    
                        }
                        card.addInteractiveZone(x, y, goat)
                    }
                });
            }
            break;
            case 2:
            this.gameZona.addZoneAtackPlayer()      
            if(this.serverData.message.type === 'def'){
                this.deckDurack.getFullDeck().forEach((card) => {
                    if(card.sprite.name === this.serverData.message.name){
                        const x = this.serverData.message.coordinates.x
                        const y = this.serverData.message.coordinates.y
                        if(!card.getZone()){
                            this.gameZona.cardsToZoneAtack.set(card.sprite.name, card);
                            card.castomMuving = false
                            this.enemyPlayer.moveCardsEnemy(x, y, card.sprite.texture, card.sprite.name, 0.4)
                            this.enemyPlayer.createCardIcons()    
                        }    
                    }
                });
            }

            default:
                break;
        }
    }
}