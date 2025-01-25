import { Sprite } from "pixi.js";
import * as PIXI from 'pixi.js';
import { userImg, cardBacks } from "../textures/textures";
import gsap from "gsap";


export class EnemyPlayer {
    static oneCardCount = 1
    constructor( app, gameZone, userId, name, cardCount ) {
        this.name = name || ' ';
        this.cardCount = cardCount || 0;
        this.cardCount > 10 ? this.cardCount = 10 : this.cardCount
        this.app = app;
        this.gameZone = gameZone
        this.userId = userId
        this.cardSprites = []
        this.userImg = new Sprite(userImg);
        
        this.container = new PIXI.Container();

        this.userImg.anchor.set(0.5);
        this.userImg.scale.set(0.03);
        this.container.addChild(this.userImg);

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

    removeEnemy(){
        this.app.stage.removeChild(this.container);
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
    async createCardIcons(tekaCard = false) {
        const cardTexture = cardBacks;
    
        if (this.cardCount > this.cardSprites.length) {
            const difference = this.cardCount - this.cardSprites.length;
            for (let i = 0; i < difference; i++) {
                const cardSprite = new Sprite(cardTexture);
                cardSprite.anchor.set(0.5);
                cardSprite.scale.set(0.1);
                if (!tekaCard) {
                    cardSprite.position.set(-300, 300);
                }
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
    
        const baseSpacing = 3;
        const maxCards = 11;
        const minSpacingFactor = 0.5;
        const maxSpacingFactor = 3;
    
        const spacingFactor = this.cardCount < maxCards
            ? minSpacingFactor + (maxCards - this.cardCount) * 0.5
            : maxSpacingFactor;
    
        const totalWidth = (this.cardCount * this.cardSprites[0].width * 0.1) + (this.cardCount - 1) * (baseSpacing * spacingFactor);
        const startX = -totalWidth / 2;
    
        const promises = this.cardSprites.map((cardSprite, index) => {
            return new Promise(resolve => {
                const x = startX + index * (cardSprite.width * 0.1 + (baseSpacing * spacingFactor));
                const y = this.userImg.height / 2 + 40;
    
                if (tekaCard) {
                    cardSprite.x = x;
                    cardSprite.y = y;
                    resolve();
                } else {
                    gsap.to(cardSprite, { x: x, y: y, duration: 1, onComplete: resolve });
                }
    
                const angle = ((this.cardCount - 1) / 2 - index) * 0.2;
                cardSprite.rotation = angle;
            });
        });
    
        await Promise.all(promises);
    }
}
