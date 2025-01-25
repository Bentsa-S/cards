// import { wsRoomDurack } from "./wsRoomDurack";
import { ButtonControler } from "./buttonController";
import { deckThirtySixCards } from "../textures/textures";
import { WsRoomDurack } from "./wsRoomDurack";
import gsap from "gsap";

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

            this.deckDurack.getFullDeck().forEach((cards) => {
                if(cards.sprite.name === json.name){
                    if(!cards.getZone()){
                        this.gameZona.cardsToZone.forEach((card, name) => {                            
                            if(name === json.def){                                
                                const x = card.sprite.x
                                const y = card.sprite.y
                                cards.def = json.def
                                cards.atackMove
                                this.gameZona.cardsToZoneAtack.set(cards.sprite.name, cards);
                                cards.castomMuving = false
                                this.enemyContainer.moveCards(x + 20, y, cards, cards.sprite.name, json.id, 0.4)
        
                            }
                        })
                    } else {
                        this.gameZona.cardsToZoneAtack.forEach((name, card) => {                            
                            this.gameZona.cardsToZone.forEach((names, cards) => {
                                if (card.def === names){
                                    card.castomMuving = true
                                    card.updatePosition(cards.position.x, cards.position.y)
                                    card.castomMuving = false

                                }
                            })
                        })
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
                    let sizeCards, positions
                    if(!card.getZone()){
                        sizeCards = this.gameZona.cardsToZoneAtack.size + 1
                        positions = this.gameZona.positionCartZone(sizeCards)

                        const x = positions[sizeCards - 1].x
                        const y = positions[sizeCards - 1].y
    
                        this.enemyContainer.moveCards(x, y, card, json.name, json.id)

                        if (true){

                            this.gameZona.addInteractiveZone(x, y, card, goat)
                        }
                    } 
                }

            });
            let index = 0;
            let sizeCards = this.gameZona.cardsToZoneAtack.size + 1
            let positions = this.gameZona.positionCartZone(sizeCards)


            this.gameZona.cardsToZoneAtack.forEach((card) => {
                const x = positions[index].x
                const y = positions[index].y
                gsap.to(card.sprite, { x: x, y: y, duration: .4 });
                gsap.to(card.sprite.scale, { x: .2, y: .2, duration: .5 });

                if ( card.zone ){
                    this.gameZona.removeInteractiveZone(card)
                    this.gameZona.addInteractiveZone(x, y, card, goat)
                }
        
                this.gameZona.cardsToZone.forEach((cards) => {            
                    if (card.def === cards.sprite.name){
                        cards.sprite.interactive = true
                        cards.castomMuving = true
                        gsap.to(cards.sprite, { x: x + 20, y: y, duration: 0.5 });
                    }
                })

                index++;
            });

        }
        
    }
}




