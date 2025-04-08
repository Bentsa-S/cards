import { Sprite, Container, Graphics } from "pixi.js";
import * as PIXI from 'pixi.js';
import { userImg, cardBacks, deckThirtySixCards, crown } from "../textures/textures";
import gsap from "gsap";
import { WsRoomSeka } from "./wsRoomSeka";
import { CardsMove } from "./cardsMove";


export class EnemyPlayer {
    static oneCardCount = 1
    constructor( app, gameZone, userId, name, cardCount ) {
        this.name = name || ' ';
        this.cardCount = cardCount || 0;
        this.cardCount > 10 ? this.cardCount = 10 : this.cardCount
        this.app = app;
        this.gameZone = gameZone
        this.userId = userId
        this.cardSprites = new Map()
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

    pass(){
        this.cardSprites.forEach(cardSprite => {
            // Отримуємо глобальну позицію
            const globalPos = this.container.toGlobal(cardSprite.sprite.position);
        
            // Видаляємо з контейнера та додаємо до stage
            this.container.removeChild(cardSprite.sprite);
            this.app.stage.addChild(cardSprite.sprite);
        
            // Встановлюємо позицію без ривків
            cardSprite.sprite.position.set(globalPos.x, globalPos.y);
        
            // Анімація переміщення в центр екрану
            gsap.to(cardSprite.sprite.position, { 
                x: this.app.screen.width / 2, 
                y: this.app.screen.height / 2, 
                duration: 0.5,
            });
        
            // Анімація зміни масштабу
            gsap.to(cardSprite.sprite.scale, {
                x: 0.2,
                y: 0.2,
                duration: 1
            });
        });
            
        this.cardSprites = new Map();
    }

    lookCards(cards, loos){

        let texturesCards = cards 
        Array.from(this.cardSprites.values()).forEach((cardSprite, i) => {

            const globalPos = this.container.toGlobal(cardSprite.sprite.position);
            const containerPos = this.container.toLocal(globalPos);

            this.container.removeChild(cardSprite.sprite);
            this.app.stage.addChild(cardSprite.sprite);
            cardSprite.sprite.position.set(globalPos.x, globalPos.y);
            let centerX = this.app.view.width / 2;
            let targetY = this.app.view.height / 2 + 10;
            let positions = [
                centerX - 100,
                centerX,      
                centerX + 100
            ];
        
            gsap.to(cardSprite.sprite.scale, {
                x: 0,
                y: 0.2,
                onComplete: () => {
                    cardSprite.setTexture(deckThirtySixCards[texturesCards[i]]);
                    console.log(cardSprite.sprite.texture);
                    
                    gsap.to(cardSprite.sprite.scale, {
                        x: 0.2,
                        y: 0.2,
                        onComplete: () => {
                            gsap.to(cardSprite.sprite.scale, {
                                x: 0.3,
                                y: 0.3,
                            })        
                            gsap.to(cardSprite.sprite, {
                                x: positions[i],
                                y: targetY,
                                rotation: 0,
                                duration: 0.5,
                                ease: "power2.out",
                                onComplete: () => {
                                    if (loos) {
                                        gsap.delayedCall(0.5, () => {
                                            this.animationLose(cardSprite.sprite, i);
                                        });
                                    } else {
                                        gsap.delayedCall(0.5, () => {
                                            this.animationWin(cardSprite.sprite, i, globalPos, containerPos);
                                        });
                                    }
                                }
                            });
                        }
                    });

                }
            });
        });
    }

    animationLose(cardSprite, index){
        const rotationAngle = (1 - index) / 0.35;
        gsap.to(cardSprite.scale, {
            x: 0,
            y: 0.3,
            onComplete: () => {
                cardSprite.texture = cardBacks;
                gsap.to(cardSprite.scale, {
                    x: 0.3,
                    y: 0.3,
                    onComplete: () => {
                        gsap.to(cardSprite, { 
                            x: window.innerWidth / 2, 
                            y: window.innerHeight / 2, 
                            rotation: rotationAngle,
                        })
                    }
                });

            }
        });
    }


    animationWin(cardSprite, index, startPosition, containerPos){
        const rotationAngle =  ((this.cardCount - 1) / 2 - index) * 0.2;

        gsap.to(cardSprite.scale, {
            x: 0,
            y: 0.3,
            onComplete: () => {
                cardSprite.texture = cardBacks;
                gsap.to(cardSprite.scale, {
                    x: 0.3,
                    y: 0.3,
                    onComplete: () => {
                        gsap.to(cardSprite.scale, {
                            x: 0.1,
                            y: 0.1,
                        })        
                        gsap.to(cardSprite, {
                            x: startPosition.x,
                            y: startPosition.y,
                            rotation: rotationAngle,
                            duration: 0.5,
                            ease: "power2.out",
                            onComplete: () => {
                                this.app.stage.removeChild(cardSprite);
                                this.container.addChild(cardSprite);
                                cardSprite.position.set(containerPos.x, containerPos.y);

                            }
                        });
                    }
                });

            }
        });
    }

    win() {
        this.pass()
        const globalPos = this.container.toGlobal(new PIXI.Point(0, 0));
    
        const crownSprite = new Sprite(crown);
        crownSprite.anchor.set(0.5);
        crownSprite.scale.set(0);
        crownSprite.x = this.app.screen.width / 2;
        crownSprite.y = this.app.screen.height / 2;
        this.app.stage.addChild(crownSprite);
    
        const raysContainer = new Container();
        raysContainer.x = crownSprite.x;
        raysContainer.y = crownSprite.y;
        this.app.stage.addChild(raysContainer);
    
        const numRays = 8;
        const rayLength = 1000;
    
        for (let i = 0; i < numRays; i++) {
            const angle = (i / numRays) * Math.PI * 2;
            const ray = new Graphics();
    
            ray.beginFill(0x8a2be2, 0.1);
            ray.drawPolygon([0, 0, rayLength / 3, -rayLength, -rayLength / 3, -rayLength]);
            ray.endFill();
    
            ray.alpha = 0;
            ray.x = Math.cos(angle) * 30;
            ray.y = Math.sin(angle) * 30;
            ray.rotation = angle;
            raysContainer.addChild(ray);
    
            gsap.to(ray, { alpha: 0.4, duration: 0.8, delay: 0.5 + i * 0.1 });
        }
    
        gsap.to(crownSprite.scale, { x: 0.15, y: 0.15, duration: 0.7, ease: "bounce.out" });
        gsap.to(raysContainer, { rotation: Math.PI * 2, duration: 2, repeat: -1, ease: "linear" });
    
        gsap.to([crownSprite, raysContainer], {
            y: globalPos.y,
            x: globalPos.x,
            duration: 2,
            delay: 2,
            ease: "power2.in",
            onComplete: () => {
                gsap.to([crownSprite, raysContainer], { alpha: 0, duration: 1, onComplete: () => {
                    this.app.stage.removeChild(crownSprite);
                    this.app.stage.removeChild(raysContainer);
                }});
            }
        });
    }
    

    removeCards(){        
        this.cardSprites.forEach(card => {
            card.removeCardLeft()
        })
        this.cardSprites = new Map()        
    }

    async createCardIcons(tekaCard = false) {
        const cardTexture = cardBacks;
    
        // Додаємо нові карти, якщо їх не вистачає
        if (this.cardCount > this.cardSprites.size) {
            const difference = this.cardCount - this.cardSprites.size;
            for (let i = 0; i < difference; i++) {
                const cardSprite = new CardsMove(cardTexture, `card${i}`, this.app);
                cardSprite.sprite.interactive = false
                cardSprite.sprite.anchor.set(0.5);
                cardSprite.sprite.scale.set(0.1);
                if (!tekaCard) {
                    cardSprite.sprite.position.set(-300, 300);
                }
                this.cardSprites.set(cardSprite.sprite, cardSprite);
                this.container.addChild(cardSprite.sprite);
            }
        }
    
        // Видаляємо зайві карти
        if (this.cardCount < this.cardSprites.size) {
            const difference = this.cardSprites.size - this.cardCount;
            for (let i = 0; i < difference; i++) {
                const lastKey = Array.from(this.cardSprites.keys()).pop();
                if (lastKey !== undefined) {
                    const cardSprite = this.cardSprites.get(lastKey);
                    this.container.removeChild(cardSprite.sprite);
                    this.cardSprites.delete(lastKey);
                }
            }
        }
    
        // Розміщення карт на сцені
        const baseSpacing = 3;
        const maxCards = 11;
        const minSpacingFactor = 0.5;
        const maxSpacingFactor = 3;
    
        const spacingFactor = this.cardCount < maxCards
            ? minSpacingFactor + (maxCards - this.cardCount) * 0.5
            : maxSpacingFactor;
    
        const totalWidth = (this.cardCount * Array.from(this.cardSprites.values())[0].sprite.width * 0.1)
            + (this.cardCount - 1) * (baseSpacing * spacingFactor);
        const startX = -totalWidth / 2;
    
        const promises = Array.from(this.cardSprites.values()).map((cardSprite, index) => {
            return new Promise(resolve => {
                const x = startX + index * (cardSprite.sprite.width * 0.1 + (baseSpacing * spacingFactor));
                const y = this.userImg.height / 2 + 40;
    
                if (tekaCard) {
                    cardSprite.sprite.x = x;
                    cardSprite.sprite.y = y;
                    resolve();
                } else {
                    gsap.to(cardSprite.sprite, { x: x, y: y, duration: 1, onComplete: resolve });
                }
    
                const angle = ((this.cardCount - 1) / 2 - index) * 0.2;
                cardSprite.sprite.rotation = angle;
            });
        });
    
        await Promise.all(promises);
    }
}