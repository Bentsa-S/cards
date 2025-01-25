import { Graphics } from "pixi.js";
import gsap from "gsap";
import { WsRoomDurack } from './wsRoomDurack'
import { DraggableItem } from "./durackCardsMove";
import { EnemyPlayer } from "./enemyPlayer";
export class DurackGame {
    constructor(app, mapCards) {
        this.zone = new Graphics();
        this.cardsToZone = new Map();
        this.cardsToZoneAtack = new Map();
        this.mapCards = mapCards
        this.app = app;
        this.goat
        // Зона для першого гравця
        this.zone.beginFill(0xff0000, 0.0001);
        this.zone.drawRect(0, 0, 500, this.app.screen.height / 1.6);
        this.zone.endFill();
        this.zone.position.set(
            (this.app.screen.width / 2 - this.zone.width / 2),
            (this.app.screen.height / 2.7 - this.zone.height / 2)
        );
        this.addEventListenersBind = this.addEventListeners.bind(this)


        
        this.cardPositions = [];

    }

    addEventListeners() {
        this.mapCards.getDeck().forEach((card, key) => {            
            if (this.isInside(card)) {
                this.cardsToZone.set(card.sprite.name, card);
                this.mapCards.removeCardInDeck(key)
            
                card.castomMuving = false

                console.log('size');
                console.log(this.mapCards.getDeck().size);
                console.log(this.mapCards.getDeck());

                if(this.mapCards.getDeck().size == 0 && EnemyPlayer.oneCardCount === 0){
                    console.log('ssssssssssssss');
                    
                }
            } else if (this.isInBounds(card)){
                gsap.to( card.sprite, {x: card.firstPositionX, y: card.firstPositionY, duration: .3} )
                
            }

        })
        // Розташування карт в межах зони для першого гравця
        Array.from(this.cardsToZone.values()).forEach((e, index) => {     
            this.locationOfCards(e, index);
        });
    }

    addZoneAtackPlayer(){
        this.zone.interactive = true;
        this.app.stage.on('pointerup', this.addEventListenersBind)
        this.app.stage.addChild(this.zone);
    }

    removeZoneAtackPlayer(){
        this.zone.interactive = false;
        this.app.stage.off('pointerup', this.addEventListenersBind)
        this.app.stage.removeChild(this.zone);        
    }

    checkCartToZones(){
        if (this.cardsToZone.size === this.cardsToZoneAtack.size){
            return true
        }else {
            return false
        }
    }

    isInBounds(card){
        const sprite = card.sprite
        const bounds = this.zone.getBounds();

        const isInBounds = sprite.x > bounds.x && sprite.x < bounds.x + bounds.width &&
        sprite.y > bounds.y && sprite.y < bounds.y + bounds.height;

        if (isInBounds){ return true } else{ return false }
    }

    isInside(card) {
        const sprite = card.sprite
        const bounds = this.zone.getBounds();
    
        // Перевіряємо, чи спрайт знаходиться в межах зони
        const isInBounds = sprite.x > bounds.x && sprite.x < bounds.x + bounds.width &&
                           sprite.y > bounds.y && sprite.y < bounds.y + bounds.height;
    
        if (!isInBounds) return false;
    
        // Якщо карт у зоні немає, повертаємо true (карта перша)
        if (this.cardsToZone.size === 0) {
            return true;
        }
    
        // Якщо карта не перша, перевіряємо наявність такої ж цифри в зоні
        for (const card of this.cardsToZone.values()) {
            const currentRank = card.sprite.name.split('-')[0];
            const newCardRank = sprite.name.split('-')[0];
    
            if (currentRank === newCardRank) {                
                return true;
            }
        }
        if (this.cardsToZoneAtack.size === 0) {
            return false;
        }

        for (const card of this.cardsToZoneAtack.values()) {
            const currentRank = card.sprite.name.split('-')[0];
            const newCardRank = sprite.name.split('-')[0];
    
            if (currentRank === newCardRank) {
                return true;
            }
        }
    
        return false;
    }
        

    locationOfCards(e, index) {
        this.cardPositions = this.positionCartZone(this.cardsToZone.size)
        const cardPosition = this.cardPositions[index];
        
        if (index < this.cardPositions.length) {
            gsap.to(e.sprite, { x: cardPosition.x, y: cardPosition.y, duration: 0.5 });
            gsap.to(e.sprite.scale, { x: 0.2, y: 0.2, duration: 0.5 });
            
            this.cardsToZoneAtack.forEach((card) => {            
                if (card.def === e.sprite.name){
                    gsap.to(card.sprite, { x: cardPosition.x + 20, y: cardPosition.y, duration: 0.5 });
                    gsap.to(card.sprite.scale, { x: 0.2, y: 0.2, duration: 0.5 });        
                }
            })
            if (e.atackMove) {
                DraggableItem.activeCard = null
                const webSocket = new WsRoomDurack();
                webSocket.postCoordinatesCadsAtackP(cardPosition.x, cardPosition.y, e.sprite.name);
                e.atackMove = false;
            }
        } else {
            gsap.to(e.sprite, { x: 200, y: 500, duration: 0.5 });
        }
    }

    clearCardZone(){
        this.cardsToZone.clear()
        this.cardsToZoneAtack.clear()
    }

    addInteractiveZone(x, y, card, goat = ' ') {
        if(!card.zone){
            this.goat = goat.split('-')[1]
            card.sprite.off('pointerdown', this.onDragStartBind);

            const zoneWidth = 100;
            const zoneHeight = 150;
            let index = 0
            const newZone = new Graphics();
            newZone.beginFill(0x00ff00, 0.3);
            newZone.drawRect(0, 0, zoneWidth, zoneHeight);
            newZone.endFill();
        
            newZone.name = `zone-${card.sprite.name}`;
            card.zone = true;
            card.castomMuving = false
        

            newZone.position.set(
                x - zoneWidth / 2,
                y - zoneHeight / 2
            );
        
            this.app.stage.addChild(newZone);
        
            // Налаштовуємо взаємодію з зоною
            newZone.interactive = true;
            newZone.on('pointerup', () => {
                this.app.stage.sortChildren();
                this.app.stage.children.forEach((e) => {
                    
                    const bounds = newZone.getBounds();     
                    if (
                        e.x > bounds.x &&
                        e.x < bounds.x + bounds.width &&
                        e.y > bounds.y &&
                        e.y < bounds.y + bounds.height
                    ){
                        if(this.checkCardsToDef(e.name, card.sprite.name) && index === 0){
                            if (card.sprite != e) {
                                let webSocket = new WsRoomDurack()
                                index = 1;
                                // this.app.stage.removeChild(e);
                                // this.app.stage.addChild(e);
                                this.mapCards.getDeck().forEach((item, name) => {
                                    if (e.name === name){
                                        this.cardsToZone.set(item.sprite.name, item)
                                        this.mapCards.removeCardInDeck(name)
                                    }
                                })

                                console.log('size');
                                console.log(this.mapCards.getDeck().size);
                                console.log(this.mapCards.getDeck());
                                if(EnemyPlayer.oneCardCount === 0){
                                    console.log('====================================');
                                    console.log(3);
                                    console.log('====================================');
                                }
                                if(this.mapCards.getDeck().size == 0 && EnemyPlayer.oneCardCount === 0){
                                    console.log('ssssssssssssss');
                                    
                                }
                
                                DraggableItem.activeCard = null
                                e.zIndex = 10;
                                card.def = e.name
                                e.interactive = false;
                                gsap.to(e, { x: x + 20, y: y, duration: 0.5, rotation: 0.4 });
                                gsap.to(e.scale, { x: 0.2, y: 0.2, duration: 0.5 });
                                this.removeInteractiveZone(card)
                                webSocket.postCoordinatesCadsDefP(x, y, e.name, card.sprite.name)

                                console.log(this.mapCards.getDeck());
                                

                            }
                        }
                    }                   
                });
            });
        }
    }

    
    removeInteractiveZone(card) {
        if (card.zone) {
            const zoneToRemove = this.app.stage.children.find(child => child.name === `zone-${card.sprite.name}`);
            if (zoneToRemove) {
                this.app.stage.removeChild(zoneToRemove);
                zoneToRemove.destroy();
            }
            card.zone = false;
        }
    }


    checkCardsToDef(nameDef, nameAtack){        
        if (
            (
                this.getSuit(nameDef) === this.getSuit(nameAtack) && // Same suit
                this.getRank(nameDef) > this.getRank(nameAtack) // Higher rank
            ) || (
                this.getSuit(nameDef) === 'trump' && // e.name is a trump card
                this.getSuit(nameAtack) !== 'trump' // sprite.name is not a trump card
            )
        ) {           
            return true
        }else{
            return false
        }
        
    }
    getSuit(name) {
        const suit = name.split('-')[1];
        if (suit === this.goat) {
            return 'trump';
        }
        return suit;
    }
    getRank = (name) => {
        const rank = name.split('-')[0];
        const rankOrder = { 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        return rankOrder[rank] || parseInt(rank);
    };

    positionCartZone(cartZone) {
        const width = this.app.screen.width;
        const height = this.app.screen.height;
    
        switch (cartZone) {
            case 1:
                return [
                    { x: width / 2, y: height / 3 }
                ];
            case 2:
                return [
                    { x: width / 3, y: height / 3 },
                    { x: (2 * width) / 3, y: height / 3 }
                ];
            case 3:
                return [
                    { x: width / 4, y: height / 3 },
                    { x: width / 2, y: height / 3 },
                    { x: (3 * width) / 4, y: height / 3 }
                ];
            case 4:
                return [
                    { x: width / 3, y: height / 3 },
                    { x: (2 * width) / 3, y: height / 3 },
                    { x: width / 3, y: (2 * height) / 3.5 },
                    { x: (2 * width) / 3, y: (2 * height) / 3.5 }
                ];
            case 5:
                return [
                    { x: width / 4, y: height / 3 },
                    { x: width / 2, y: height / 3 },
                    { x: (3 * width) / 4, y: height / 3 },
                    { x: width / 3, y: (2 * height) / 3.5 },
                    { x: (2 * width) / 3, y: (2 * height) / 3.5 }
                ];
            case 6:
                return [
                    { x: width / 4, y: height / 3 },
                    { x: width / 2, y: height / 3 },
                    { x: (3 * width) / 4, y: height / 3 },
                    { x: width / 4, y: (2 * height) / 3.5 },
                    { x: width / 2, y: (2 * height) / 3.5 },
                    { x: (3 * width) / 4, y: (2 * height) / 3.5 }
                ];
            default:
                return [];
        }
    }
    
}
