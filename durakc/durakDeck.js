import { DraggableItem } from "./durackCardsMove";
import { deckThirtySixCards } from "../textures/textures";

export class DeckDurack{
    constructor(app){
        this.item = new DraggableItem(deckThirtySixCards.card, '1', app);
        this.item1 = new DraggableItem(deckThirtySixCards.card1, '2', app);
        this.item2 = new DraggableItem(deckThirtySixCards.card, '3', app);
        this.item3 = new DraggableItem(deckThirtySixCards.card1, '4', app);
        this.map = new Map()

        this.app = app
        
        
        this.map.set(this.item)
        this.map.set(this.item1)
        this.map.set(this.item2)
        this.map.set(this.item3)

    }

    getMap(){
        return this.map
    }

    addMapDeckCards(){
        this.map.forEach((value, key) => {
            key.addAppThisChaild()
        });
    }

}