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
        // Завантажуємо текстуру карти
        const cardTexture = cardBacks;
        
        if (this.cardCount > this.cardSprites.length){
            const difference = this.cardCount - this.cardSprites.length
            for (let i = 0; i < difference; i++) {
                const cardSprite = new Sprite(cardTexture);
                cardSprite.anchor.set(0.5);
                cardSprite.scale.set(0.1);
                if(!tekaCard){
                    cardSprite.position.x = -300
                    cardSprite.position.y = 300
                }
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
            if(tekaCard){
                cardSprite.x = startX + index * (cardSprite.width * 0.1 + (baseSpacing * spacingFactor)); 
                cardSprite.y = this.userImg.height / 2 + 40;
            }else{
                const x = startX + index * (cardSprite.width * 0.1 + (baseSpacing * spacingFactor)); 
                const y = this.userImg.height / 2 + 40;
                gsap.to(cardSprite, {x: x, y: y, duration: 1})
            }


            // Нахил карток
            const angle = ((this.cardCount - 1) / 2 - index) * 0.2;
            cardSprite.rotation = angle;
        });
    }

    auditEnemy(){
        if(this.cardCount < 6){
            this.cardCount = 6
            this.createCardIcons()
        }
    }

    moveCardsEnemy(x, y, cards, nameCard, rotation = 0) {        
        const card = this.cardSprites.shift()
        this.cardCount -= EnemyPlayer.oneCardCount
        const globalPosition = this.container.toGlobal(card.position);
        this.container.removeChild(card);
        card.position.set(globalPosition.x, globalPosition.y);
        card.name = nameCard

        this.app.stage.addChild(card);
        

        gsap.to(card, {rotation: rotation, duration: 1});
    
        // анімація перевороту карт
        gsap.to(card.scale, { x: 0, duration: 1,
            onComplete: () => {
                this.app.stage.removeChild(card)
                
                cards.spaunThisSprite(x, y)
                cards.interactive = false
                cards.dragging = false
                cards.sprite.scale.x = 0
                cards.sprite.scale.y = 0.2
                cards.sprite.rotation = rotation
                this.gameZone.cardsToZoneAtack.set(nameCard, cards)
                gsap.to(cards.sprite.scale, { x: .2, y: .2, duration: .4 });
            }
        });
    
        gsap.to(card, { x: x, y: y, duration: 2 });
    }

    takeGoad(card){
        const promises = [];
        const promise = new Promise((resolve) => {
            gsap.to(card.sprite.scale, {
                x: 0,
                duration: 1,
                onComplete: () => {
                    card.sprite.texture = cardBacks;
                    gsap.to(card.sprite.scale, {
                        x: 0.1,
                        y: 0.1,
                        duration: 0.5,
                        onComplete: () => {
                            gsap.to(card.sprite, {
                                x: this.container.x,
                                y: this.container.y + 67,
                                duration: 0.5,
                                onComplete: () => {
                                    this.cardCount++;
                                    this.app.stage.removeChild(card.sprite);
                                    this.createCardIcons(true);
                                    resolve();
                                },
                            });
                        },
                    });
                },
            });
        });
        promises.push(promise);


    }
    async whippedMove(deck) {
        const promises = [];
        const cards = [] 
        this.gameZone.cardsToZoneAtack.forEach((card) => {
            this.gameZone.removeInteractiveZone(card)
            cards.push(card)
        })
        this.gameZone.cardsToZone.forEach((card) => {
            this.gameZone.removeInteractiveZone(card)
            cards.push(card)
        })
        cards.forEach(item => {
            
            const promise = new Promise((resolve) => {
                gsap.to(item.sprite.scale, {
                    x: 0,
                    duration: 0.5,
                    onComplete: () => {
                        item.sprite.texture = cardBacks;

                        gsap.to(item.sprite.scale, {
                            x: 0.4,
                            y: 0.4,
                            duration: 0.5,
                            onComplete: () => {
                                gsap.to(item.sprite, {
                                    x: 1800,
                                    y: 300,
                                    duration: 3,
                                    onComplete: () => {
                                        deck.getDeck().forEach((cardSprite, cardName) => {
                                            if (cardName === item.sprite.name) {
                                                deck.removeCardInStage(cardName);
                                            }
                                        });
                                        resolve();
                                    }
                                });
                            }
                        });
                    }
                });
            });
            promises.push(promise);
        });

        deck.getFullDeck().forEach((card) => {            
            card.fixZone()
            card.atackMove = true
        }) 
        deck.getDeck().forEach((card) => {  
            card.atackMove = true
        })
        await Promise.all(promises);
    }
    
    async takeMove(deck) {
        const promises = [];
        const cards = [];
    
        this.gameZone.cardsToZone.forEach((card) => {
            this.gameZone.removeInteractiveZone(card);
            cards.push(card);
        });
    
        this.gameZone.cardsToZoneAtack.forEach((card) => {
            this.gameZone.removeInteractiveZone(card);
            cards.push(card);
        });
    
        cards.forEach((card) => {
            const promise = new Promise((resolve) => {
                gsap.to(card.sprite.scale, {
                    x: 0,
                    duration: 1,
                    onComplete: () => {
                        card.sprite.texture = cardBacks;
                        gsap.to(card.sprite.scale, {
                            x: 0.1,
                            y: 0.1,
                            duration: 0.5,
                            onComplete: () => {
                                gsap.to(card.sprite, {
                                    x: this.container.x,
                                    y: this.container.y + 67,
                                    duration: 0.5,
                                    onComplete: () => {
                                        this.cardCount++;
                                        deck.getDeck().forEach((cardSprite, cardName) => {
                                            if (cardName === card.sprite.name) {
                                                deck.removeCardInStage(cardName);
                                            }
                                        });
                                        this.app.stage.removeChild(card.sprite);
                                        this.createCardIcons(true);
                                        resolve();
                                    },
                                });
                            },
                        });
                    },
                });
            });
            promises.push(promise);
        });
    
        deck.getFullDeck().forEach((card) => {
            card.fixZone();
        });
    
        await Promise.all(promises);
    }
        
}
