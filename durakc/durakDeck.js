import { DraggableItem } from "./durackCardsMove";
import { deckThirtySixCards } from "../textures/textures";
import { gsap } from "gsap";

export class DeckDurack{
    constructor(app, cardImages){
        // this.cardImages = [    
        //     "7-Hearts",
        //     "10-Clubs",
        //     "10-Diamonds",
        //     "10-Hearts",
        //     "10-Spades",
        // ]
        this.cardImages = cardImages
        this.map = new Map()
        this.app = app
        this.deck
                
    }

    addNewDeckToGame(card) {
        for (let i = 0; i < card.length; i++) {
            const item = card[i];
            this.map.set(item, new DraggableItem(deckThirtySixCards[item], item, this.app));
        }

        this.deck = new Map(this.map)
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
        // console.log(Array.from(this.deck.entries())[1][1].sprite);
 
        const goat = Array.from(this.deck.entries())[1][1].sprite;
        
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