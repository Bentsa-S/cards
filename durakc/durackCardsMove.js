import { Sprite, Ticker, Graphics } from "pixi.js";
import gsap from "gsap";
import { WsRoomDurack } from './wsRoomDurack'
import { deckThirtySixCards } from "../textures/textures";

export class DraggableItem {
    constructor(texture, name, app) {
        this.sprite = new Sprite(texture);
        this.ticker = new Ticker();
        this.app = app;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.direction = 0;
        this.zone = false
        this.castomMuving = true

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.position.x = 300;
        this.sprite.position.y = 500;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.name = name

        this.onDragStartBind = this.onDragStart.bind(this)
        this.onDragEndBind = this.onDragEnd.bind(this)
        this.sprite.on('pointerdown', this.onDragStartBind);
        this.sprite.on('pointerup', this.onDragEndBind);
        this.sprite.on('pointerupoutside', this.onDragEndBind);


        this.addEventListeners();
    }

    addEventListeners() {
        // Анімація вибору карт
        this.sprite.on('pointerover', () => {
            this.direction = 1;
        });
        this.sprite.on('pointerout', () => {
            this.direction = -1;
        });
    }
    // нова механіка переміщення
    onDragStart(event) {
        this.dragging = true;
        this.offsetX = this.sprite.x - event.data.global.x;
        this.offsetY = this.sprite.y - event.data.global.y;
        this.sprite.scale.set(.52)
        this.app.stage.on('pointermove', this.onDragMove.bind(this));
    }
    
    onDragMove(event) {
        if (this.dragging) {
            const position = event.data.global;
            this.sprite.x = position.x + this.offsetX;
            this.sprite.y = position.y + this.offsetY;
        }
    }

    onDragEnd() {
        this.dragging = false;
        this.sprite.scale.set(.5)
        this.app.stage.off('pointermove', this.onDragMove.bind(this));
    }

    // Анімація
    animate() {
        if (this.direction === 1 && this.sprite.y > 450) {
            this.sprite.y -= 6;
        }
        else if (this.direction === -1 && this.sprite.y < 500 && this.sprite.y > 400) {
            this.sprite.y += 6;
        }
    }

    // Функція додавання нової текстури на карту
    setTexture(texture) {
        this.sprite.texture = texture;
    }

    // додається спрайт на сцену
    addAppThisChaild(){
        this.app.stage.addChild(this.sprite);
        this.ticker.add(this.animate.bind(this));
        this.ticker.start();
    }

    // додається зона для взаєсодіі друго ігрока
    addInteractiveZone(x, y) {
        if(!this.zone){
            this.sprite.off('pointerdown', this.onDragStartBind);
            // this.sprite.off('pointerup', this.onDragEndBind);
            // this.sprite.off('pointerupoutside', this.onDragEndBind);
        
            const zoneWidth = 100;
            const zoneHeight = 150;
            let index = 0
            const newZone = new Graphics();
            newZone.beginFill(0x00ff00, 0.3);
            newZone.drawRect(0, 0, zoneWidth, zoneHeight);
            newZone.endFill();
        
            newZone.name = 'zone';
            this.zone = true;
            this.castomMuving = false
        

            newZone.position.set(
                x - zoneWidth / 2,
                y - zoneHeight / 2
            );
        
            this.app.stage.addChild(newZone);
        
            // Налаштовуємо взаємодію з зоною
            newZone.interactive = true;
            newZone.on('pointerup', () => {
                this.app.stage.children.forEach((e) => {
                    
                    const bounds = newZone.getBounds();     
                    if (
                        e.x > bounds.x &&
                        e.x < bounds.x + bounds.width &&
                        e.y > bounds.y &&
                        e.y < bounds.y + bounds.height
                    ){
                        if(
                            this.getSuit(e.name) === this.getSuit(this.sprite.name) &&
                            this.getRank(e.name) > this.getRank(this.sprite.name)
                        ){
                            if (this.sprite != e) {
                                let webSocket = new WsRoomDurack()
                                index = 1;
                                this.app.stage.removeChild(e);
                                this.app.stage.addChild(e);
                        
                                e.interactive = false;
                                
                                gsap.to(e, { x: x + 20, y: y, duration: 0.5, rotation: 0.4 });
                                gsap.to(e.scale, { x: 0.4, y: 0.4, duration: 0.5 });

                                webSocket.postCoordinatesCadsDefP(x + 20, y, e.name)

                            }
                        }
                    }                   
                });
            });
        }
    }
    
    getZone(){
        return this.zone
    }

    getSuit(name){
        return name.split('-')[1]
    }
    getRank = (name) => {
        const rank = name.split('-')[0];
        const rankOrder = { 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        return rankOrder[rank] || parseInt(rank);
    };
}



