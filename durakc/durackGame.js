import { Graphics } from "pixi.js";
import gsap from "gsap";
import {postCoordinatesCadsDefP} from './wsRoomDurack'

export class DurackGame {
    constructor(app, mapCards, seelvePlayer) {
        this.zone = new Graphics();
        this.cardsToZone = new Map();
        this.mapCards = mapCards
        this.seelvePlayer = seelvePlayer
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
        
        this.mapCards.getMap().forEach((card, key) => {
                
            if (this.isInside(card.sprite)) {
                this.cardsToZone.set(card.sprite.name, card);
                this.seelvePlayer.removeCardSeelvate(key)  
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

    addZoneDefendPlayer(){
        Array.from(this.cardsToZone.values()).forEach((e, index) => {     
            if(!e.getZone()){
                e.addInteractiveZone(this.cardPositions[index].x, this.cardPositions[index].y)
                // e.addInteractiveZone(100, 100)
            }
        })
    }

    removeZoneDefendPlayer(){
        
    }

    isInside(position) {
        const bounds = this.zone.getBounds();
        
        return (
            position.x > bounds.x &&
            position.x < bounds.x + bounds.width &&
            position.y > bounds.y &&
            position.y < bounds.y + bounds.height
        );
    }

    locationOfCards(e, index) {
        // Логіка розміщення карт у першій зоні

        if (index < this.cardPositions.length) {
            gsap.to(e.sprite, { x: this.cardPositions[index].x, y: this.cardPositions[index].y, duration: 0.5 });
            gsap.to(e.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });            
            postCoordinatesCadsDefP(this.cardPositions[index].x, this.cardPositions[index].y, e.sprite.name)      
        }else{
            gsap.to(e.sprite, { x: 200, y: 500 });

        }
    }

}
