import { deckThirtySixCards } from "../textures/textures";
import { cardImages } from "../textures/textures";
import { CardsMove } from './cardsMove';

export class SekaDeck{
    constructor(app, enemyController, idUser){
        this.cardImages = cardImages
        this.deck = new Map()
        this.deckGame = new Map()
        this.goat
        this.idUser = idUser
        this.enemyController = enemyController
        this.app = app
    }

    async addPlayerCards(cardsPromise = []) {
        let cards;
     
        const fixedPositions = [
            { x: window.innerWidth / 2 - 100, y: window.innerHeight - 180 },
            { x: window.innerWidth / 2, y: window.innerHeight - 195 },
            { x: window.innerWidth / 2 + 100, y: window.innerHeight - 180 },
        ];
    
        if (this.deck) {
            const deckArry = Array.from(this.deck.keys());
            cards = [...deckArry, ...cardsPromise];
        } else {
            cards = cardsPromise;
        }
    
        const cardPromises = cards.map(async (card, i) => {
            if (!this.deck.has(card)) {
                const rotationAngle = ((fixedPositions.length - 1) / 2 - i) / 0.35;
                const x = fixedPositions[i].x;
                const y = fixedPositions[i].y;
                const item = new CardsMove(deckThirtySixCards[card], card, this.app);
                await item.addAppThisChaild(x, y);
                item.setRotation(rotationAngle);
                this.deck.set(card, item);
            }
        });        
    
        await Promise.all(cardPromises);
    }
        
                
    addDeckToGame() {
        for (let i = 0; i < this.cardImages.length; i++) {
            const name = this.cardImages[i];
            const item = new CardsMove(deckThirtySixCards[name], name, this.app)
            this.deckGame.set(name, item);
        }
    }

    removeCardInDeck(key){
        this.deck.delete(key)
    }
    
    getDeck(){
        return this.deck
    }
    getFullDeck(){
        return this.deckGame
    }

    async givCards(players, cards) {
        players.sort((a, b) => a.number - b.number);
        for (let i = 0; i < 3; i++) {
            for (const player of players) {
                if (player.id === this.idUser) {
                    await this.addPlayerCards([cards[i]]);
                } else {
                    await this.enemyController.createCardIconsForId(player.id);
                }
                // Затримка 1 секунда між кожною картою
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
}

