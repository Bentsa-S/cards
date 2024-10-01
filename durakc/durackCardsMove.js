import { Sprite, Ticker } from "pixi.js";
import { deckThirtySixCards } from "../textures/textures";

export class DraggableItem {
    constructor(texture, app) {
        this.sprite = new Sprite(texture);
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.position.x = 300;
        this.sprite.position.y = 500;
        this.sprite.interactive = true;
        this.sprite.buttonMode = true;
        this.app = app;

        this.app.stage.addChild(this.sprite);

        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.direction = 0;
        this.ticker = new Ticker();

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

        // Перетягування
        this.sprite.on('pointerdown', (event) => {
            const position = event.data.global;
            this.dragging = true;
            this.offsetX = this.sprite.x - position.x;
            this.offsetY = this.sprite.y - position.y;
        });
        this.sprite.on('pointerup', () => {
            this.dragging = false;
        });
        this.sprite.on('pointerupoutside', () => {
            this.dragging = false;
        });
        this.sprite.on('pointermove', (event) => {
            const position = event.data.global;
            if (this.dragging && position.y < 500) {
                this.sprite.x = position.x + this.offsetX;
                this.sprite.y = position.y + this.offsetY;
            }
        });
    }

    animate() {
        // Анімація
        if (this.direction === 1 && this.sprite.y > 450) { // Зменшено максимальну висоту
            this.sprite.y -= 6; // Зменшено величину зміщення
        }
        else if (this.direction === -1 && this.sprite.y < 500) {
            this.sprite.y += 6; // Зменшено величину зміщення
        }
    }

    // Функція додавання нової текстури на карту
    setTexture(texture) {
        this.sprite.texture = texture;
    }
}
