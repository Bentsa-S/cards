import { DraggableItem } from "./durackCardsMove";
import { deckThirtySixCards } from "../textures/textures";
import { cardImages } from "../textures/textures";
import { gsap } from "gsap";
import { WsRoomDurack } from "./wsRoomDurack";

export class DeckDurack{
    constructor(app){
        this.cardImages = cardImages
        this.deck = new Map()
        this.deckGame = new Map()

        this.app = app
    }

    addPlayerCards(cardsPromise) {
        let cards
        if(this.deck){
            const deckArry = Array.from(this.deck.keys());
            console.log(deckArry);
            
            cards = [ ...deckArry, ...cardsPromise ]
        }else {
            cards = cardsPromise
        }
        const baseSpacing = 15;
        const maxCards = 20;
        const minSpacingFactor = 0.5;
        const screenWidth = window.innerWidth;
    
        const cardCount = cards.length;
        const spacingFactor = cardCount < maxCards
            ? minSpacingFactor + (maxCards - cardCount) * 0.1
            : minSpacingFactor;
    
        const totalWidth = (cardCount * 100 * 0.1) + (cardCount - 1) * (baseSpacing * spacingFactor);
        const startX = (screenWidth - totalWidth) / 2;
    
        for (let i = 0; i < cards.length; i++) {
            const x = startX + i * (10 + baseSpacing * spacingFactor);
            const name = cards[i];
    
            const stageItem = this.app.stage.children.find(child => child.name === name);
    
            if (stageItem) {
                // Перевіряємо, чи є об'єкт DraggableItem
                if (this.deck.has(name)) {
                    // Якщо це DraggableItem, оновлюємо позицію
                    stageItem.position.x = x;
                } else {
                    // Якщо це не DraggableItem, видаляємо об'єкт та додаємо новий
                    this.app.stage.removeChild(stageItem);
                    const item = new DraggableItem(deckThirtySixCards[name], name, this.app);
                    item.addAppThisChaild(x);
                    this.deck.set(name, item);
                }
            } else {
                // Створюємо нову карту та додаємо її в колоду
                const item = new DraggableItem(deckThirtySixCards[name], name, this.app);
                item.addAppThisChaild(x);
                this.deck.set(name, item);
            }
        }

        console.log(this.deck);
        
    }
    
    
    addDeckToGame() {
        for (let i = 0; i < this.cardImages.length; i++) {
            const name = this.cardImages[i];
            const item = new DraggableItem(deckThirtySixCards[name], name, this.app)
            this.deckGame.set(name, item);
        }
    }

    audit(){        
        if(this.deck.size < 6){
            const wsRoom = new WsRoomDurack()
            const numgerAudit = 6 - this.deck.size
            wsRoom.getAuditCard(numgerAudit)
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

    addItemDeckCards(name, item, x, y){       
        this.deck.set(name, item)
        item.addAppThisChaild()
        item.sprite.position.x = x
        item.sprite.position.y = y
    }

    removeCardInDeck(key){
        console.log(key);
        
        this.deck.delete(key)
    }

    removeCardInStage(key) {
        const item = this.deck.get(key);
        if (item) {
            console.log(item);
            
            this.app.stage.removeChild(item.sprite);
            item.sprite.name = null;
            this.deck.delete(key);
        } else {
            console.log(`Елемент із ключем ${key} не знайдено.`);
        }
    }
    
    getDeck(){
        return this.deck
    }
    getFullDeck(){
        return this.deckGame
    }

}