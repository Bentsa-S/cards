// import { wsRoomDurack } from "./wsRoomDurack";
import gsap from "gsap";
import { Button, ButtonTeka } from "./button";
import { deckThirtySixCards } from "../textures/textures";


export class MovePlayers{
    constructor(classGame, deckDurack, enemyPlayer, app){
        this.gameZona = classGame
        this.deckDurack = deckDurack
        this.app = app
        this.enemyPlayer = enemyPlayer

    }


    turn(number, goat, serverData){
        switch (number) {
            case 2:
            this.gameZona.removeZoneAtackPlayer() 
            if(serverData.message.type === 'atack'){
                console.log(deckThirtySixCards[serverData.message.name]);
                
                this.deckDurack.getFullDeck().forEach((card) => {                    
                    if(card.sprite.name === serverData.message.name){

                        const x = serverData.message.coordinates.x
                        const y = serverData.message.coordinates.y
                        if(!card.getZone()){
                            this.enemyPlayer.moveCardsEnemy(x, y, deckThirtySixCards[serverData.message.name], serverData.message.name)
                            this.enemyPlayer.createCardIcons()  
                        }
                        card.addInteractiveZone(x, y, goat)
                    }
                });
            }
            break;
            case 1:
            this.gameZona.addZoneAtackPlayer()      
            if(serverData.message.type === 'def'){
                this.deckDurack.getFullDeck().forEach((card) => {
                    if(card.sprite.name === serverData.message.name){
                        const x = serverData.message.coordinates.x
                        const y = serverData.message.coordinates.y
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