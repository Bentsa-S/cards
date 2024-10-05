import { Graphics } from "pixi.js";
import gsap from "gsap";

export class DurackGame {
    constructor(app, mapCards) {
        this.zonePlayerOne = new Graphics();
        this.cardsToZone = new Map();
        this.mapCards = mapCards

        // Зона для першого гравця
        this.zonePlayerOne.beginFill(0xff0000, 0.5);
        this.zonePlayerOne.drawRect(0, 0, 500, 400);
        this.zonePlayerOne.endFill();
        this.app = app;
        this.zonePlayerOne.position.set(
            (this.app.screen.width / 2 - this.zonePlayerOne.width / 2),
            (this.app.screen.height / 3 - this.zonePlayerOne.height / 2)
        );
        this.zonePlayerOne.interactive = true;

        this.app.stage.addChild(this.zonePlayerOne);

        this.addEventListenersPlayerOne();
    }

    addEventListenersPlayerOne() {
        this.app.stage.on('pointerup', () => {
                        
            this.mapCards.getMap().forEach((index, card) => {
                
                if (this.isInside(card.sprite)) {
                    this.cardsToZone.set(card.sprite.name, card);
                    
                }

            })
            // Розташування карт в межах зони для першого гравця
            Array.from(this.cardsToZone.values()).forEach((e, index) => {     
                this.locationOfCards(e, index);
            });
        });
    }

    isInside(position) {
        const bounds = this.zonePlayerOne.getBounds();
        
        return (
            position.x > bounds.x &&
            position.x < bounds.x + bounds.width &&
            position.y > bounds.y &&
            position.y < bounds.y + bounds.height
        );
    }

    locationOfCards(e, index) {
        // Логіка розміщення карт у першій зоні
        const cardPositions = [
            { x: 200, y: 200 },
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 200, y: 400 },
            { x: 400, y: 400 },
            { x: 600, y: 400 },
        ];

        if (index < cardPositions.length) {
            gsap.to(e.sprite, { x: cardPositions[index].x, y: cardPositions[index].y, duration: 0.5 });
            gsap.to(e.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });
            if(!e.getZone()){
                e.addInteractiveZone(cardPositions[index].x, cardPositions[index].y)
                // e.addInteractiveZone(100, 100)

            }
            
        }
    }

}
