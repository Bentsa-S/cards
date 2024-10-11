import { DraggableItem } from "./durackCardsMove";
import { deckThirtySixCards } from "../textures/textures";
import { cardImages } from '../textures/textures'
import { gsap } from "gsap";

export class DeckDurack{
    constructor(app){
        this.cardImages = cardImages
        this.map = new Map()
        this.app = app

        for (let i = 0; i < this.cardImages.length; i++) {
            const item = this.cardImages[i];
            this.map.set(item, new DraggableItem(deckThirtySixCards[item], item, app));
        }

        const items = Array.from(this.map.entries());
        items.sort(() => Math.random() - 0.5);
        this.map = new Map(items)
        this.deck = new Map(items)
    }

    getMap(){
        return this.map
    }

    getDeck(){
        return this.deck
    }

    addMapDeckCards(){                       
        this.map.forEach((value) => {            
            value.addAppThisChaild()
        });
    }

    addGoat(){
        const goat = Array.from(this.map.entries())[20][1].sprite;
        this.app.stage.addChild(goat);

        goat.position.x = -30
        goat.position.y = 300
        goat.interactive = false

        gsap.to(goat, { x: 20, y: 300, duration: 0.5, rotation: 1.5 });
    }

    addItemDeckCards(item){       
        this.map.forEach((value, index) => {
            if (item === index){
                value.addAppThisChaild()

            }            
        });
    }

}