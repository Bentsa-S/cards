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
        this.goat
        this.app = app
        this.lastSelected = null;

        this.app.stage.on('pointermove', this.moveDeck.bind(this));
    }

    addAnmationCards(){
        this.deck.forEach((card, name) => {
            card.sprite.on('pointerover', () => {
                card.direction = 1;
                this.cardSelectionAnimation(name)
            });
            card.sprite.on('pointerdown', () => {
                card.direction = 1;
                this.cardSelectionAnimation(name)
            });
            card.sprite.on('pointerout', () => {
                card.direction = -1;
                this.resetCardPositions(card)
            });
            card.sprite.on('pointerup', () => {
                card.direction = -1;
                this.resetCardPositions(card)
            });
    
        })
    }

    moveDeck(){
        if (DraggableItem.activeCard) {
            const screenHeight = this.app.screen.height - 130;
            const activeCard = DraggableItem.activeCard;
        
            const y = activeCard.sprite.y;
        
            if (y < screenHeight - 115) {
                this.deck.forEach((card, name) => {
                    if (card === activeCard) {
                        this.addPlayerCards([], name);
                        console.log('up');
                    }
                });
            }
        }
    }
    addPlayerCards(cardsPromise = [], remove = false) {
        let cards, scale;
        if (this.deck) {
            const deckArry = Array.from(this.deck.keys());
            cards = [...deckArry, ...cardsPromise];
        } else {
            cards = cardsPromise;
        }

        if (remove){
            cards = cards.filter(item => item != remove);            
        }

        console.log(cards);


        if ( cards.length > 9 ){
            scale = 0.4
        }else{
            scale = 0.5
        }

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
    
        const cardCount = cards.length;
        const cardWidth = 30; // Ширина карти в пікселях
        const baseSpacing = 20; // Базова відстань між картами
        const totalWidth = cardWidth * cardCount + baseSpacing * (cardCount - 1); // Загальна ширина розташування карт
        const centerOffset = (screenWidth - totalWidth) / 2 + 15; // Зміщення, щоб карти були по центру
    
        const yPosition = screenHeight - 100; // Відступ карт від нижнього краю
    
        for (let i = 0; i < cards.length; i++) {
            // Розрахунок координати X для кожної карти
            const x = centerOffset + i * (cardWidth + baseSpacing);
    
            const name = cards[i];
            const stageItem = this.app.stage.children.find(child => child.name === name);
    
            // Розрахунок кута нахилу (чим далі від центру, тим більший нахил)
            const maxTilt = 0.2; // Максимальний нахил (у радіанах)
            const rotationAngle = (i - (cardCount - 1) / 2) * maxTilt / cardCount; // Розподіл нахилу
    
            if (stageItem) {
                if (this.deck.has(name)) {
                    // stageItem.position.set(x, yPosition);
                    gsap.to(stageItem.scale, {x: scale, y: scale, duration: .5})
                    gsap.to(stageItem, {x: x, y: yPosition, direction: .4})
                    stageItem.rotation = rotationAngle; // Нахил карти
                } else {
                    this.app.stage.removeChild(stageItem);
                    const item = new DraggableItem(deckThirtySixCards[name], name, this.app);
                    item.addAppThisChaild(x, yPosition, scale);
                    item.setRotation(rotationAngle); // Нахил карти
                    this.deck.set(name, item);
                }
            } else {
                const item = new DraggableItem(deckThirtySixCards[name], name, this.app);
                item.addAppThisChaild(x, yPosition, scale);
                item.setRotation(rotationAngle); // Нахил карти
                this.deck.set(name, item);
            }
        }
    }

    cardSelectionAnimation(cardName) {
        if (this.lastSelected === cardName) return;
        this.lastSelected = cardName;
    
        // Створюємо масив з ключів (імен карт)
        const keys = Array.from(this.deck.keys());
        const selectedIndex = keys.indexOf(cardName);
    
        keys.forEach((name, index) => {
            const card = this.deck.get(name);
            if (!card?.sprite) return;
    
            if (name === cardName) return; // пропускаємо саму карту
    
            const distance = Math.abs(index - selectedIndex);
            const direction = index < selectedIndex ? -1 : 1;
    
            const offset = 20 + (3 - distance) * 10; // ближчі карти зміщуються більше
            gsap.to(card.sprite, {
                x: card.firstPositionX + direction * offset,
                duration: 0.3
            });
        });
    }
    
    resetCardPositions(card) {
        const screenHeight = this.app.screen.height - 130;
        if (card.sprite.y < screenHeight) {

            this.lastSelected = null;
            console.log('reset');
            
        
            for (const [name, card] of this.deck.entries()) {
                if (!card?.sprite) continue;
        
                gsap.to(card.sprite, {
                    x: card.firstPositionX,
                    y: card.firstPositionY,
                    duration: 0.3
                });
            }
    
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
        if(this.deck.size < 6){
            const wsRoom = new WsRoomDurack()
            const numgerAudit = 6 - this.deck.size
            wsRoom.getAuditCard(numgerAudit)
        }
    }

    addGoat(nameSprite){  
        const classCard = new DraggableItem(deckThirtySixCards[nameSprite], nameSprite, this.app)
        
        this.app.stage.addChild(classCard.sprite);

        classCard.sprite.position.x = -30
        classCard.sprite.position.y = 300
        classCard.sprite.interactive = false
        this.goat = classCard
        gsap.to(classCard.sprite, { x: 20, y: 300, duration: 0.5, rotation: 1.5 });
    }

    addItemDeckCards(name, item, x, y){       
        this.deck.set(name, item)
        item.addAppThisChaild()
        item.sprite.position.x = x
        item.sprite.position.y = y
    }

    removeCardInDeck(key){
        this.deck.delete(key)
    }

    removeCardInStage(key) {
        const item = this.deck.get(key);
        if (item) {
            this.app.stage.removeChild(item.sprite);
            item.sprite.name = null;
            this.deck.delete(key);
        }
    }
    
    getDeck(){
        return this.deck
    }
    getFullDeck(){
        return this.deckGame
    }

}