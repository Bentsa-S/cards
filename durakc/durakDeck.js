import { DraggableItem } from "./durackCardsMove";
import { deckThirtySixCards } from "../textures/textures";
import { cardImages } from "../textures/textures";
import { gsap } from "gsap";

export class DeckDurack{
    constructor(app){
        this.cardImages = cardImages
        this.deck = new Map()
        this.deckGame = new Map()

        this.app = app
    }

    addPlayerCards(cards) {
        for (let i = 0; i < cards.length; i++) {
            const name = cards[i];
            const item = new DraggableItem(deckThirtySixCards[name], name, this.app)
            item.addAppThisChaild()
            this.deck.set(name, item);
        }

    }

    addDeckToGame() {
        for (let i = 0; i < this.cardImages.length; i++) {
            const name = this.cardImages[i];
            const item = new DraggableItem(deckThirtySixCards[name], name, this.app)
            this.deckGame.set(name, item);
        }
    }

    audit(){        

        while(this.deck.size < 6){
            const goat = Array.from(this.deck.entries())[0]
            this.deck.set(goat[0], goat[1])
            
            goat[1].addAppThisChaild()
        }
    }

    addGoat(nameSprite){  
        console.log(nameSprite);
             
        const classCard = new DraggableItem(deckThirtySixCards[nameSprite], nameSprite, this.app)
        
        this.app.stage.addChild(classCard.sprite);

        classCard.sprite.position.x = -30
        classCard.sprite.position.y = 300
        classCard.sprite.interactive = false

        gsap.to(classCard.sprite, { x: 20, y: 300, duration: 0.5, rotation: 1.5 });
    }

    addItemDeckCards(item){       
        this.deck.forEach((value, index) => {
            if (item === index){
                value.addAppThisChaild()

            }            
        });
    }

    getDeck(){
        return this.deck
    }
    getFullDeck(){
        return this.deckGame
    }

}