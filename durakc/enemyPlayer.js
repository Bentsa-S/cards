import { Sprite } from "pixi.js";
import { userImg, cardBacks } from "../textures/textures";
import gsap from "gsap";

export class EnemyPlayer {
    constructor(app, name, cardCount) {
        this.name = name || ' ';
        this.cardCount = cardCount || 0;
        this.cardCount > 10 ? this.cardCount = 10 : this.cardCount
        this.app = app;
        this.cardSprites = []
        this.userImg = new Sprite(userImg);
        
        this.container = new PIXI.Container();

        this.userImg.anchor.set(0.5);
        this.userImg.scale.set(0.07);
        this.container.addChild(this.userImg);

        
        console.log(this.userImg);
    }

    setPosition(x, y) {
        this.container.x = x;
        this.container.y = y;
    }

    getCardCount() {
        return this.cardCount;
    }

    addEnemy(x, y) {
        this.setPosition(x, y);
        this.app.stage.addChild(this.container);
    }

    addName(name){
        this.nameText = new PIXI.Text(name, {
            fontSize: 24,
            fill: 0xffffff,
            align: 'center'
        });
        this.nameText.anchor.set(0.5);
        this.nameText.y = this.userImg.height / 2 + 10;
        this.container.addChild(this.nameText);

    }
    async createCardIcons() {
        // Завантажуємо текстуру карти
        const cardTexture = cardBacks;
        
        if (this.cardCount > this.cardSprites.length){
            const difference = this.cardCount - this.cardSprites.length
            for (let i = 0; i < difference; i++) {
                const cardSprite = new Sprite(cardTexture);
                cardSprite.anchor.set(0.5);
                cardSprite.scale.set(0.1);
    
                // Додаємо картки до контейнера
                this.cardSprites.push(cardSprite);
                this.container.addChild(cardSprite);
            }
    
        }
        if (this.cardCount < this.cardSprites.length) {
            const difference = this.cardSprites.length - this.cardCount;
        
            for (let i = 0; i < difference; i++) {
                const cardSprite = this.cardSprites.pop();

                this.container.removeChild(cardSprite);
            }
        }
                

        const baseSpacing = 3; // Базова відстань між картами
        const maxCards = 11; // Максимальна кількість карт для щільного розташування
        const minSpacingFactor = 0.5; // Мінімальний фактор відстані
        const maxSpacingFactor = 3; // Максимальний фактор відстані

        // Обчислення spacingFactor для щільності карт
        const spacingFactor = this.cardCount < maxCards
            ? minSpacingFactor + (maxCards - this.cardCount) * 0.5
            : maxSpacingFactor;

        const totalWidth = (this.cardCount * this.cardSprites[0].width * 0.1) + (this.cardCount - 1) * (baseSpacing * spacingFactor); // Загальна ширина всіх карт
        const startX = -totalWidth / 2;

        this.cardSprites.forEach((cardSprite, index) => {
            cardSprite.x = startX + index * (cardSprite.width * 0.1 + (baseSpacing * spacingFactor)); 
            cardSprite.y = this.userImg.height / 2 + 40; // Внизу від фото

            // Нахил карток
            const angle = ((this.cardCount - 1) / 2 - index) * 0.2;
            cardSprite.rotation = angle;
        });
    }

    moveCardsEnemy(x, y, texture, nameCard) {
        const card = this.cardSprites.shift();
        const globalPosition = this.container.toGlobal(card.position);
    
        this.container.removeChild(card);
        card.position.set(globalPosition.x, globalPosition.y);
        card.name = nameCard

        this.app.stage.addChild(card);
        

        gsap.to(card, {rotation: 0, duration: 1});
    
        // анімація перевороту карт
        gsap.to(card.scale, { x: 0, duration: 1,
            onComplete: () => {
                card.texture = texture;
    
                gsap.to(card.scale, { x: .4, y: .4, duration: 1 });
            }
        });
    
        gsap.to(card, { x: x, y: y, duration: 2 });
    }
    
}
