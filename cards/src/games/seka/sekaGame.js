import { Graphics, Text, TextStyle, Sprite } from "pixi.js";
import gsap from "gsap";
import { cardBacks } from "../textures/textures";
import { WsRoomSeka } from "./wsRoomSeka";

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

    
    createPrintCards(interactive = true) {
        const centerX = this.app.renderer.width / 2;
        const centerY = this.app.renderer.height / 2;

        for (let i = 0; i < 4; i++) {
            const ws = new WsRoomSeka()
            const card = new Sprite(cardBacks);
            card.interactive = interactive
            card.anchor.set(0.5);
            card.scale.set(0.5);
            card.position.set(centerX, centerY);
            card.interactive = true;
            card.buttonMode = true;

            card.on('pointerdown', () => this.animateCard(card));
            card.on('pointerdown', () => ws.postTake());

            this.cards.set(`card${i}`, card)
            this.app.stage.addChild(card);
        }
    }

    flipCards() {
        let first = true        
        this.cards.forEach(card => {
            card.interactive = false
            gsap.to(card.scale, {
                y: 0.1,
                onComplete: () => {                      
                    if ( first ){
                        for (let col = 0; col < 10; col++) {
                            const line = new Graphics();
                            line.beginFill(0x888888);
                            line.drawRect(0, 0, 115, 2);
                            line.endFill();
                        
                            line.x = card.x - card.width / 2;
                            line.y = card.y + card.height - 15 + 3 * col;
                        
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
        console.log(cardName);
        
        this.deckSeka.getFullDeck().forEach((card, name) => {

            if (cardName === name ) {
                let value = Math.floor(this.numberPutch / 2);
                let x, y;
                let index = 1;
    
                if (value < 10){
                    // card.sprite.interactive = false
                    console.log(card);
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
                        timeline.to(c, { x: c.x + 70, duration: 0.5 }, 0);
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
                        timeline.to(c, { y: c.y + value * 3, duration: 0.5 }, 0.5);
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
                    timeline.to(c, { x: x, duration: 0.5 }, 1);
                });
                setTimeout(() => {
                    card.zIndex = 4
                    this.cards.forEach(c => {
                        this.app.stage.removeChild(c);
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
        this.line = null;
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
                    card.drawRect(0, 0, 115, 2);
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
