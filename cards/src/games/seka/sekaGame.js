import { Graphics, Text, TextStyle, Sprite, Container } from "pixi.js";
import gsap from "gsap";
import { cardBacks, crown } from "../textures/textures";
import { WsRoomSeka } from "./wsRoomSeka";
import { CardsMove } from "./cardsMove";

export class SekaGame {
    constructor(app, deckSeka) {
        this.app = app;
        this.deckSeka = deckSeka;
        this.dragging = false;
        this.handle = null;
        this.handleData = null;
        this.label = null;
        this.cloud = null;
        this.numberPutch
        this.line = new Graphics();
        this.cards = new Map()
        this.horizontalCards = new Map()

    }

    winPlayer() {
        this.deckSeka.loseAnimation();
    
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
        gsap.to(raysContainer, { rotation: Math.PI * 2, duration: 3, repeat: -1, ease: "linear" });
    
        gsap.to([crownSprite, raysContainer], {
            y: this.app.screen.height - 150,
            duration: 2,
            delay: 2,
            ease: "power2.in",
            onComplete: () => {
                gsap.to([crownSprite, raysContainer], { alpha: 0, duration: 1, onComplete: () => {
                    this.app.stage.removeChild(crownSprite);
                    this.app.stage.removeChild(raysContainer);
                }});

                let ws = new WsRoomSeka()
                ws.restart()

            }
        });
    }
        
        
    
    createPrintCards(interactive = true) {
        const centerX = this.app.renderer.width / 2;
        const centerY = this.app.renderer.height / 2;

        for (let i = 0; i < 4; i++) {
            const ws = new WsRoomSeka()
            const card = new CardsMove(cardBacks, `card${i}`, this.app);
            card.sprite.interactive = interactive
            card.sprite.anchor.set(0.5);
            card.sprite.scale.set(0.5);
            card.sprite.position.set(centerX, centerY);
            card.sprite.interactive = true;
            card.sprite.buttonMode = true;

            card.sprite.on('pointerdown', () => this.animateCard(card));
            card.sprite.on('pointerdown', () => ws.postTake());

            this.cards.set(`card${i}`, card)
            this.app.stage.addChild(card.sprite);
        }
    }

    flipCards() {
        let first = true        
        this.cards.forEach(card => {
            card.sprite.interactive = false
            gsap.to(card.sprite.scale, {
                y: 0.09,
                onComplete: () => {                      
                    if ( first ){
                        for (let col = 0; col < 10; col++) {
                            const line = new Graphics();
                            line.beginFill(0x888888);
                            line.drawRect(0, 0, 146, 2);
                            line.endFill();
                        
                            line.x = card.sprite.x - card.sprite.width / 2;
                            line.y = card.sprite.y + card.sprite.height - 20 + 3 * col;
                        
                            this.horizontalCards.set(`line${col}`, line);
                            this.app.stage.addChild(line);
                        
                            // Плавна анімація для кожної лінії
                            gsap.fromTo(line, 
                                { 
                                    y: line.y - 10, // Початкове значення для лінії (можна налаштувати)
                                    alpha: 0, // Початково лінія невидима
                                }, 
                                { 
                                    y: line.y, // Кінцеве значення для лінії
                                    alpha: 1, // Лінія стане видимою
                                    duration: 0.5, // Тривалість анімації
                                    delay: col * 0.1, // Затримка для кожної лінії
                                    ease: "power1.out", // Тип анімації для плавності
                                }
                            );
                        }
                        first = false
                    }                 
                }
            });
        });
    }

    swapCards(cardName) {
        const timeline = gsap.timeline();
        
        this.deckSeka.getFullDeck().forEach((card, name) => {

            if (cardName === name ) {
                let value = Math.floor(this.numberPutch / 2);
                let x, y;
                let index = 1;
    
                if (value < 10){
                    // card.sprite.interactive = false
                    card.spaunThisSprite(300, 300)                    
                    card.originalTexture = card.sprite.texture;
        
                    // Фаза 1: Горизонтальний рух
                    this.horizontalCards.forEach((line, name) => {
                        if (`line${value}` === name) {
                            card.sprite.texture = cardBacks;
                            card.sprite.zIndex = -3;
                            card.sprite.scale.y = 0.1;
                            x = line.x + line.width / 2;
                            y = line.y - 10;
                            card.spaunThisSprite(x, y);
                        }
        
                        if (value >= index) {
                            timeline.to(line, { x: line.x + 70, duration: 0.5 }, 0);
                        } else {
                            timeline.to(line, { x: line.x - 70, duration: 0.5 }, 0);
                        }
        
                        index++;
                    });
        
                    timeline.to(card.sprite, { x: card.sprite.x - 70, duration: 0.5 }, 0);
                    this.cards.forEach(c => {
                        timeline.to(c.sprite, { x: c.sprite.x + 70, duration: 0.5 }, 0);
                    });
        
                    // Додаємо затримку перед фазою 2
                    // timeline.call(() => {}, null, "+=0.5"); // Пауза 0.5 секунди
        
                    // Фаза 2: Вертикальний рух
                    index = 1;
                    this.horizontalCards.forEach((line) => {
                        const shift = Math.abs(value - index) * 6 + 3;
                        if (value >= index) {
                            timeline.to(line, { y: line.y + shift, duration: 0.5 }, 0.5);
                        } else {
                            timeline.to(line, { y: line.y - shift, duration: 0.5 }, 0.50);
                        }
        
                        index++;
                    });
        
                    timeline.to(card.sprite, { y: card.sprite.y - ( 10 - value ) * 6 - ( value - 10 ) * 2 - 5, duration: 0.5 }, 0.5);
                    this.cards.forEach(c => {
                        timeline.to(c.sprite, { y: c.sprite.y + value * 3, duration: 0.5 }, 0.5);
                    });
    
    
                }
                
                index = 1;
                this.horizontalCards.forEach((line) => {
                    if (value >= index) {
                        timeline.to(line, { x: x - line.width / 2, duration: 0.5 }, 1);
                    } else {
                        timeline.to(line, { x: x - line.width / 2, duration: 0.5 }, 1);
                    }
    
                    index++;
                });
    
                timeline.to(card.sprite, { x: x, duration: 0.5 }, 1);
                this.cards.forEach(c => {
                    timeline.to(c.sprite, { x: x, duration: 0.5 }, 1);
                });
                setTimeout(() => {
                    card.zIndex = 4
                    this.cards.forEach(c => {
                        this.app.stage.removeChild(c.sprite);
                    });
                    if ( value == 10 ){
                        card.sprite.scale.y = 1
                        card.sprite.scale.x = 0.4
                        console.log(12222222222222);
                        
                        card.spaunThisSprite(300, 300)
                    }
                }, 1300)                


                index = 1;
                timeline.to(
                    card.sprite.scale, 
                    { 
                        y: .5, 
                        duration: 0.5 
                    }, 
                    1.4
                );
                
                this.horizontalCards.forEach((line) => {
                    timeline.to(
                        line, 
                        { 
                            y: line.y + 9,
                            alpha: 0, // Повністю зникає
                            duration: 0.006
                        }, 
                        "1.3+=0.2" // Затримка для кожної лінії
                    );
                });
                
                setTimeout(() => {
                    card.handleFlip(false)
                }, 2000)                

                setTimeout(() => {
                    card.flipToBeack()
                    card.pickUpTheCard()
                    this.removeSlider()
                }, 3000)    

            }
        });
    
        return timeline;
    }
                    
    animateCard(card) {
        if (this.isAnimating) return;
        if (!card){
            const sortedCards = new Map([...this.cards].sort((a, b) => b[1].zIndex - a[1].zIndex));
            card = sortedCards.values().next().value;
        }
        this.isAnimating = true;

        const x = card.position.x;
        const y = card.position.y;

        gsap.to(card.position, {
            x: x + 100,
            y: y + Math.random() * 40 - 30,
            duration: 0.2,
            onComplete: () => {
                card.zIndex = Math.random() * 6 - 5;
                this.app.stage.sortChildren();

                gsap.to(card.position, {
                    x: x,
                    y: y,
                    duration: 0.1,
                    onComplete: () => {
                        this.isAnimating = false;
                        // card.zIndex = 0;
                        // this.app.stage.sortChildren();
                    },
                });
            },
        });
    }

    removeSlider() {
        if (this.line) {
            this.app.stage.removeChild(this.line);
        }
    
        if (this.handle) {
            this.app.stage.removeChild(this.handle);
        }
    
        if (this.cloud) {
            this.app.stage.removeChild(this.cloud);
        }
    
        if (this.label) {
            this.app.stage.removeChild(this.label);
        }
        this.line = new Graphics();
        this.handle = null;
        this.cloud = null;
        this.label = null;
    }
    
    createSlider() {
        this.line.beginFill(0xFFFFFF);
        this.line.drawRect(0, -2.5, 200, 5);
        this.line.endFill();
        this.line.x = 400;
        this.line.y = 300;
        this.line.rotation = -Math.PI / 2;
        this.app.stage.addChild(this.line);
    
        this.handle = new Graphics();
        this.handle.beginFill(0xD28080);
        this.handle.drawCircle(0, 0, 15);
        this.handle.endFill();
        this.handle.x = 400;
        this.handle.y = 300;
        this.handle.interactive = true;
        this.handle.buttonMode = true;
        this.app.stage.addChild(this.handle);
    
        this.handle
            .on("pointerdown", (event) => this.onDragStart(event))
            .on("pointerup", () => this.onDragEnd())
            .on("pointerupoutside", () => this.onDragEnd())
            .on("pointermove", () => this.onDragMove());
    }

    createLabel() {
        if (!this.label) {
            const cloud = new Graphics();
            cloud.beginFill(0xD28080);
            cloud.drawRoundedRect(-40, -20, 80, 40, 10);
            cloud.endFill();
            cloud.x = this.handle.x - 90;
            cloud.y = this.handle.y - 40; // Хмарка розташовується вище
            this.app.stage.addChild(cloud);

            const style = new TextStyle({
                fontFamily: "Arial",
                fontSize: 18,
                fill: 0xFFFFFF,
            });

            this.label = new Text("1", style);
            this.label.anchor.set(0.5);
            this.label.x = cloud.x;
            this.label.y = cloud.y;
            this.app.stage.addChild(this.label);

            this.cloud = cloud;
        }
    }

    onDragMove() {
        if (this.dragging && this.handleData) {
            const globalPosition = this.handleData.global;
            const localPosition = this.app.stage.toLocal(globalPosition);
            if (localPosition.y >= 100 && localPosition.y <= 300) {
                let index = 1
                this.handle.y = localPosition.y;
                const value = Math.floor((300 - this.handle.y) / 10) + 1;
                let adjustedValue = Math.floor(value / 2); 
                this.label.text = value;
                this.numberPutch = value

                this.horizontalCards.forEach((card) => {
                    // card.clear();
                    if (index <= adjustedValue) {
                        card.beginFill(0xffff);
                    } else {
                        card.beginFill(0x888888);
                    }
                    card.drawRect(0, 0, 146, 2);
                    card.endFill();
                    index++
                });
                
                if (this.cloud && this.label) {
                    this.cloud.y = this.handle.y - 40;
                    this.label.y = this.handle.y - 40;
                    this.label.x = this.handle.x - 90;
                }
            }
        }
    }

    onDragStart(event) {
        this.dragging = true;
        this.handleData = event.data;
        this.handle.alpha = 0.7;
        this.createLabel();
    }

    onDragEnd() {
        this.dragging = false;
        this.handleData = null;
        this.handle.alpha = 1;
    }
}
