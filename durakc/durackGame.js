import { Graphics } from "pixi.js";
import gsap from "gsap";
import {WsRoomDurack} from './wsRoomDurack'

export class DurackGame {
    constructor(app, mapCards) {
        this.zone = new Graphics();
        this.cardsToZone = new Map();
        this.cardsToZoneAtack = new Map();
        this.mapCards = mapCards
        this.app = app;

        // Зона для першого гравця
        this.zone.beginFill(0xff0000, 0.5);
        this.zone.drawRect(0, 0, 500, 400);
        this.zone.endFill();
        this.zone.position.set(
            (this.app.screen.width / 2 - this.zone.width / 2),
            (this.app.screen.height / 3 - this.zone.height / 2)
        );
        this.addEventListenersBind = this.addEventListeners.bind(this)


        this.cardPositions = [
            { x: 200, y: 200 },
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 200, y: 400 },
            { x: 400, y: 400 },
            { x: 600, y: 400 },
        ];

    }

    addEventListeners() {
        this.mapCards.getDeck().forEach((card, key) => {            
            if (this.isInside(card)) {
                this.cardsToZone.set(card.sprite.name, card);
                console.log(key);
                
                this.mapCards.removeCardInDeck(key)
                card.castomMuving = false
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
            console.log(this.cardsToZone);
            console.log(this.cardsToZoneAtack);
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
        // Логіка розміщення карт у першій зоні

        if (index < this.cardPositions.length) {
            let webSocket = new WsRoomDurack()
            gsap.to(e.sprite, { x: this.cardPositions[index].x, y: this.cardPositions[index].y, duration: 0.5 });
            gsap.to(e.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });  
            webSocket.postCoordinatesCadsAtackP(this.cardPositions[index].x, this.cardPositions[index].y, e.sprite.name)      
        }else{
            gsap.to(e.sprite, { x: 200, y: 500 });

        }
    }

    clearCardZone(){
        this.cardsToZone.clear()
        this.cardsToZoneAtack.clear()

        console.log(this.cardsToZone.size);
        
    }

}
