import { Sprite, Ticker } from "pixi.js";
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

        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.position.x = 300;
        this.sprite.position.y = 500;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.sprite.name = name

        this.sprite.on('pointerdown', this.onDragStart.bind(this));
        this.sprite.on('pointerup', this.onDragEnd.bind(this));
        this.sprite.on('pointerupoutside', this.onDragEnd.bind(this));

        this.app.stage.addChild(this.sprite);


        this.addEventListeners();
        this.ticker.add(this.animate.bind(this));
        this.ticker.start();
    }

    addEventListeners() {
        // Анімація вибору карт
        this.sprite.on('pointerover', () => {
            this.direction = 1;
        });
        this.sprite.on('pointerout', () => {
            this.direction = -1;
        });

    //     // Перетягування
    //     this.sprite.on('pointerdown', (event) => {
    //         const position = event.data.global;
    //         this.dragging = true;
    //         this.offsetX = this.sprite.x - position.x;
    //         this.offsetY = this.sprite.y - position.y;
    //     });
    //     this.sprite.on('pointerup', () => {
    //         this.dragging = false;
    //     });
    //     this.sprite.on('pointerupoutside', () => {
    //         this.dragging = false;
    //     });
    //     this.sprite.on('pointermove', (event) => {
    //         const position = event.data.global;
    //         if (this.dragging && position.y < 500) {
    //             this.sprite.x = position.x + this.offsetX;
    //             this.sprite.y = position.y + this.offsetY;
    //         }
    //     });
    }
    // нова механіка переміщення
    onDragStart(event) {
        this.dragging = true;
        this.offsetX = this.sprite.x - event.data.global.x;
        this.offsetY = this.sprite.y - event.data.global.y;
        this.sprite.scale.set(.52)
        this.app.stage.on('pointermove', this.onDragMove.bind(this));
        console.log('====================================');
        console.log(event.data.global);
        console.log('====================================');
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

    
    animate() {
        // Анімація
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
}



