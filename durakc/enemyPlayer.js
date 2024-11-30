import { Sprite } from "pixi.js";
import { userImg, cardBacks } from "../textures/textures";
import gsap from "gsap";

export class EnemyPlayer {
    constructor( app, userId, name, cardCount ) {
        this.name = name || ' ';
        this.cardCount = cardCount || 0;
        this.cardCount > 10 ? this.cardCount = 10 : this.cardCount
        this.app = app;
        this.userId = userId
        this.cardSprites = []
        this.userImg = new Sprite(userImg);
        
        this.container = new PIXI.Container();

        this.userImg.anchor.set(0.5);
        this.userImg.scale.set(0.03);
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

    moveCardsEnemy(x, y, texture, nameCard, rotation = 0) {
        const card = this.cardSprites.shift()
        this.cardCount--
        const globalPosition = this.container.toGlobal(card.position);
        this.container.removeChild(card);
        card.position.set(globalPosition.x, globalPosition.y);
        card.name = nameCard

        this.app.stage.addChild(card);
        

        gsap.to(card, {rotation: rotation, duration: 1});
    
        // анімація перевороту карт
        gsap.to(card.scale, { x: 0, duration: 1,
            onComplete: () => {
                card.texture = texture;
    
                gsap.to(card.scale, { x: .4, y: .4, duration: 1 });
            }
        });
    
        gsap.to(card, { x: x, y: y, duration: 2 });
    }


    async whippedMove(deck) {
        const promises = []; // Ініціалізуємо масив для збереження обіцянок
        this.app.stage.sortChildren();
        this.app.stage.children.forEach((item) => {
            const isInBounds = item.x > 100 && item.x < 700 &&
                item.y > 100 && item.y < 400;
            console.log(item.name);

            if (isInBounds) {
                item.interactive = true;
    
                if (item.name === 'zone') {
                    this.app.stage.removeChild(item);
                } else {
                    
                    // Створюємо обіцянку для анімації
                    const promise = new Promise((resolve) => {
                        gsap.to(item.scale, {
                            x: 0,
                            duration: 0.5,
                            onComplete: () => {
                                item.texture = cardBacks;
    
                                gsap.to(item.scale, {
                                    x: 0.4,
                                    y: 0.4,
                                    duration: 0.5,
                                    onComplete: () => {
                                        gsap.to(item, {
                                            x: 1800,
                                            y: 300,
                                            duration: 3,
                                            onComplete: () => {
                                                deck.getDeck().forEach((cardSprite, cardName) => {
                                                    if (cardName === item.name) {
                                                        console.log('www');
                                                        
                                                        deck.removeCardInStage(cardName);
                                                    }
                                                });
                                                // this.app.stage.removeChild(item);
                                                resolve(); // Вирішуємо обіцянку, коли анімація закінчується
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    });
    
                    promises.push(promise); // Додаємо обіцянку до масиву
                }
            }
        });

        deck.getFullDeck().forEach((card) => {            
            card.fixZone()
            card.atackMove = true
        }) 
        deck.getDeck().forEach((card) => {  
            card.atackMove = true
        })
        // Чекаємо завершення всіх анімацій
        await Promise.all(promises);
    }
    
    async takeMove(deck){
        const promises = [];
        const card = []
        this.app.stage.sortChildren();
        const promise = new Promise((resolve) => {

            this.app.stage.children.forEach((e) => {
                const isInBounds = e.x > 100 && e.x < 700 &&
                e.y > 100 && e.y < 400;

                if(isInBounds){
                    if (e.name === 'zone'){
                        this.app.stage.removeChild(e.name)
                    }else {
                        card.push(e.name)
                        gsap.to(e.scale, {x: 0, duration: 1,
                            onComplete: () => {
                                e.texture = cardBacks
                                gsap.to(e.scale, {x: 0.1, y: 0.1, duration: .5, 
                                    onComplete: () => {
                                        gsap.to(e, {x: this.container.x, y: this.container.y + 67, duration: 0.5,
                                            onComplete: () => {
                                                this.cardCount++
                                                deck.getDeck().forEach((cardSprite, cardName) => {
                                                    if (cardName === e.name) {
                                                        deck.removeCardInStage(cardName);
                                                    }
                                                });  
                                                this.app.stage.removeChild(e)
                                                this.createCardIcons(true)
                                            
                                            }})
                                
                                    }
                                })
                            }})

                    }
                    // gsap.to(e, {x: 1, y:1})

                }
            })
        })

        this.deck.getFullDeck().forEach((card) => {            
            card.fixZone()
        }) 

        promises.push(promise)
        await Promise.all(promises);

    }
    
}
