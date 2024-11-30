// import { wsRoomDurack } from "./wsRoomDurack";
import gsap from "gsap";
import { ButtonControler } from "./buttonController";
import { deckThirtySixCards } from "../textures/textures";
import { WsRoomDurack } from "./wsRoomDurack";


export class MovePlayers{
    constructor(classGame, deckDurack, enemyContainer, app){
        this.gameZona = classGame
        this.deckDurack = deckDurack
        this.app = app
        this.enemyContainer = enemyContainer
        this.WsRoom = new WsRoomDurack()
    }


    turn(number, goat, serverData){
        const json = serverData.message
        switch (number) {
            case 2:
                this.gameZona.removeZoneAtackPlayer() 
                this.checkAtack(json, goat, number)
                break;
            case 1:
                this.gameZona.addZoneAtackPlayer()      
                this.checkDef(json, number)
                break;
            case 3:
                this.gameZona.removeZoneAtackPlayer() 
                this.checkDef(json, number, false)
                this.checkAtack(json, goat, number, false)
                break;
            case 4:
                console.log('pididi');
                
                this.gameZona.addZoneAtackPlayer() 
                const buttonControler = new ButtonControler(this.app, this.WsRoom, this.gameZona, this.deckDurack, this.enemyContainer, number)
                buttonControler.addButtonPass()

                this.checkDef(json, number)
                this.checkAtack(json, goat, number, false)
                break;
            default:
                break;
        }
    }




    checkDef(json, number, button = true){
        if(json.type === 'def'){
            if (button){
                const buttonControler = new ButtonControler(this.app, this.WsRoom, this.gameZona, this.deckDurack, this.enemyContainer, number)
                buttonControler.addButton(json.type)
            }

            this.deckDurack.getFullDeck().forEach((card) => {
                if(card.sprite.name === json.name){
                    const x = json.coordinates.x
                    const y = json.coordinates.y
                    if(!card.getZone()){
                        this.gameZona.cardsToZoneAtack.set(card.sprite.name, card);
                        card.castomMuving = false
                        this.enemyContainer.moveCards(x, y, card.sprite.texture, card.sprite.name, json.id, 0.4)
                    }    
                }
            });
        }
    }


    checkAtack(json, goat, number, button = true){
        if(json.type === 'atack'){
            if (button){
                const buttonControler = new ButtonControler(this.app, this.WsRoom, this.gameZona, this.deckDurack, this.enemyContainer, number)
                buttonControler.addButton(json.type)
            }            
            this.deckDurack.getFullDeck().forEach((card) => {                    
                if(card.sprite.name === json.name){

                    const x = json.coordinates.x
                    const y = json.coordinates.y
                    if(!card.getZone()){
                        this.gameZona.cardsToZone.set(card.sprite.name, card);
                        this.enemyContainer.moveCards(x, y, deckThirtySixCards[json.name], json.name, json.id)
                    }
                    if (button){
                        card.addInteractiveZone(x, y, goat)
                    }
                }
            });
        }

    }
}




