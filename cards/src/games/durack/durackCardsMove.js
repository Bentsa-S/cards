import { Sprite, Ticker } from "pixi.js";
import gsap from "gsap";
import { cardBacks, deckThirtySixCards } from "../textures/textures";

export class DraggableItem {
    static activeCard = null;

    constructor(texture, name, app) {
        this.sprite = new Sprite(texture);
        this.ticker = new Ticker();
        this.app = app;
        this.textureCard = texture
        this.sprite.anchor.set(0.5);
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.firstPositionX
        this.firstPositionY
        this.direction = 0;
        this.zone = false
        this.castomMuving = true
        this.atackMove = true
        this.def
        this.animated = false
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.position.x = 300;
        this.sprite.position.y = 500;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.name = name

        this.onDragStartBind = this.onDragStart.bind(this)
        this.onDragEndBind = this.onDragEnd.bind(this)
        this.sprite.on('pointermove', this.onDragStart.bind(this));
        this.app.stage.on('pointermove', this.onDragMove.bind(this));
        this.sprite.on('pointerup', this.onDragEnd.bind(this));
        this.sprite.on('pointerout', this.onDragEnd.bind(this));
            

        // this.addEventListeners();
    }

    // addEventListeners() {
        // Анімація вибору карт
    // }
    // нова механіка переміщення
    onDragStart(event) {
        // const screenHeight = this.app.screen.height - 170;
        if (DraggableItem.activeCard) return;
            // console.log('DraggableItem.activeCard');
        const screenHeight = this.app.screen.height - 150;
        const position = event.data.global;

        if (position.y < screenHeight) {
    
            this.dragging = true;
            DraggableItem.activeCard = this;
            console.log(this.sprite.name);
            
            this.offsetX = this.sprite.x - event.data.global.x;
            this.offsetY = this.sprite.y - event.data.global.y;
            this.sprite.scale.set(0.52);
        }        
    }
    
    onDragMove(event) {
        
        if (!this.dragging) return;
        if (!this.sprite.interactive) return;
        const position = event.data.global;
        const screenHeight = this.app.screen.height - 110;
    
        if (position.y < screenHeight) {
            this.sprite.x = position.x + this.offsetX;
            this.sprite.y = position.y + this.offsetY;
        }
    }
        
    onDragEnd() {
        if (this.dragging) {  
            this.dragging = false;
            this.sprite.scale.set(0.5);
            DraggableItem.activeCard = null
        }
    }
        // Анімація
        animate() {
            const screenHeight = this.app.screen.height - 130;
        
            if (this.direction === 1 && this.sprite.y > screenHeight - 120 && !this.animated) {
                this.animated = true;
                console.log(this.sprite.y > screenHeight - 120);
                
                gsap.to(this.sprite, {
                    y: this.firstPositionY - 70,
                    duration: 0.3
                });
            } 
            else if (this.direction === -1 && this.animated) {
                this.animated = false;
                gsap.to(this.sprite, {
                    y: this.firstPositionY,
                    duration: 0.3
                });
            }
        }
            

    // Функція додавання нової текстури на карту
    setTexture(texture) {
        this.sprite.texture = texture;
    }

    // додається спрайт на сцену
    updatePosition(x = 300, y = 500){
        this.firstPositionX = x
        this.firstPositionY = y

        gsap.to(this.sprite, {rotation: 0, duration: .7});
        gsap.to(this.sprite, { x: x, y: y, duration: 1 });
        gsap.to(this.sprite.scale, { x: .5, y: .5, duration: .5 });

        this.ticker.add(this.animate.bind(this));
        this.ticker.start();

    }

    spaunThisSprite(x, y){
        this.sprite.position.x = x
        this.sprite.position.y = y

        this.app.stage.addChild(this.sprite);
        this.interactive = true
        this.ticker.add(this.animate.bind(this));
        this.ticker.start();
    }

    addAppThisChaild(x = 300, y = 500, scale = 0.5){
        this.firstPositionX = x
        this.firstPositionY = y
        this.sprite.position.x = -30
        this.sprite.position.y = 300
        this.sprite.rotation = 1.3
        this.sprite.texture = cardBacks
        this.interactive = true
        this.app.stage.addChild(this.sprite);
        gsap.to(this.sprite, {rotation: 0, duration: .7});
    
        // анімація перевороту карт
        gsap.to(this.sprite.scale, { x: 0, duration: .5,
            onComplete: () => {
                this.sprite.texture = this.textureCard;
    
                gsap.to(this.sprite.scale, { x: scale, y: scale, duration: .5 });
            }
        });
    
        gsap.to(this.sprite, { x: x, y: y, duration: 1 });

        this.ticker.add(this.animate.bind(this));
        this.ticker.start();
    }

    setRotation(angle) {
        gsap.to(this.sprite, {rotation: angle, duration: .7});
    }

    // додається зона для взаєсодіі друго ігрока
    
    getZone(){
        return this.zone
    }

    fixZone(){
        this.zone = false
        this.castomMuving = true
        this.atackMove = true    
        this.sprite.texture = deckThirtySixCards[this.sprite.name]
    }

}



