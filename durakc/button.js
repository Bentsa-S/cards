import gsap from "gsap";
import { cardBacks } from "../textures/textures";

export class Button {
    constructor(app, wsRoom, text,) {
        this.app = app;
        this.button = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 15,
            fill: 0xffffff,
            align: 'center',
            backgroundColor: 0x0000ff,
        });
        this.wsRoom = wsRoom

        this.button.x = 700;
        this.button.y = 500;
        this.button.interactive = true;
        this.button.buttonMode = true;

    }

    // Метод, який викликається при кліку на кнопку
    onClick() { 
    }
    addClick() {  
        this.button.on('pointerdown', () => this.onClick());
    }
    
    // Метод для додавання кнопки на сцену
    addToStage() {
        this.app.stage.addChild(this.button);
    }

    // Метод для видалення кнопки зі сцени
    removeFromStage() {
        this.app.stage.removeChild(this.button);
    }
}

export class ButtonReady extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
    }

    onClick() { 
        this.wsRoom.postReady()
        this.removeFromStage()
    }
}

export class ButtonWhipped extends Button{
    
    constructor(app, wsRoom, text, gameZona, deck){
        super(app, wsRoom, text)
        this.deck = deck
        this.wsRoom = wsRoom
        this.gameZona = gameZona
        this.button.x = 200;
        this.button.y = 450;

    }

    onClick() { 
        // this.deck.audit()
        this.wsRoom.postWhipped()
        // this.app.stage.sortChildren()
        // this.removeFromStage()

        // this.app.stage.children.forEach((item) => {
        //     const isInBounds = item.x > 100 && item.x < 700 &&
        //     item.y > 100 && item.y < 400;

        //     if(isInBounds){
        //         if(item.name === 'zone'){
        //             this.app.stage.removeChild(item)
        //         }else{
        //             console.log(item.name);
                
        //             // анімація перевороту карт
        //             gsap.to(item.scale, { x: 0, duration: .5,
        //                 onComplete: () => {
        //                     item.texture = cardBacks;
                
        //                     gsap.to(item.scale, { x: .4, y: .4, duration: .5, 
        //                         onComplete: () => {
        //                             gsap.to(item, { x: 1800, y: 300, duration: 3 });
        //                             gsap.to(item, {rotation: 1.5, duration: 1, onComplete: () => {
        //                                 item.name = null
        //                                 this.app.stage.removeChild(item)
        //                             }});

        //                         }});
                            
        //                 }

        //             })
                    

                    
        //         }

        //     }

        // })    
        
        this.deck.getFullDeck().forEach((card) => {
            card.fixZone()
        }) 
    }
    
}


export class ButtonTeka extends Button{
    
    constructor(app, wsRoom, text, deck, enemyContainer){
        super(app, wsRoom, text)
        this.wsRoom = wsRoom
        this.deck = deck
        this.enemyContainer = enemyContainer
        this.button.x = 200;
        this.button.y = 500;

    }

    addButtonTeka(condition){
        if(condition){
            this.addToStage()
        }else{
            this.removeFromStage()
        }
    }

    onClick(){
        this.deck.audit()
        this.enemyContainer.allEnemyAudit()
        this.wsRoom.postImTeka()
        const card = []
        this.app.stage.sortChildren()
        this.removeFromStage()

        this.app.stage.children.forEach((e) => {
            const isInBounds = e.x > 100 && e.x < 700 &&
            e.y > 100 && e.y < 400;

            if(isInBounds){
                if (e.name === 'zone'){
                    this.app.stage.removeChild(e)
                }else {
                    card.push(e.name)

                }
                // gsap.to(e, {x: 1, y:1})

            }
        })

        this.deck.getFullDeck().forEach((card) => {            
            card.fixZone()
        }) 
        this.deck.addPlayerCards(card)
    }

}


export class ButtonSwapPosition extends Button {
    constructor(app, wsRoom, text, x, y, number) {
        super(app, wsRoom, text);
        this.number = number;

        // Текст
        this.button = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 15,
            fill: 0xffffff,
            align: 'center',
        });

        // Визначення розмірів тексту
        this.textBounds = this.button.getBounds();

        // Центрування тексту відносно переданої позиції
        this.button.x = x - this.textBounds.width / 2;
        this.button.y = y - this.textBounds.height / 2;

        // Створення графіки для закругленого бордера
        this.border = new PIXI.Graphics();
        this.border.lineStyle(2, 0xffffff, 1); // Білий бордер
        this.border.drawRoundedRect(
            -5, // Відступ від тексту
            -5,
            this.textBounds.width + 10,
            this.textBounds.height + 10,
            10 // Радіус закруглення
        );

        // Позиціонування бордера
        this.border.x = this.button.x;
        this.border.y = this.button.y;

        // Штрих-пунктирний бордер
        this.dashedBorder = new PIXI.Graphics();
        this.dashedBorder.lineStyle(1, 0xffffff, 1);
        const dashLength = 5; // Довжина штриха
        const gapLength = 3; // Пропуск між штрихами
        let pos = 0;

        // Малюємо горизонтальну верхню лінію як приклад
        while (pos < this.textBounds.width + 10) {
            this.dashedBorder.moveTo(pos - 5, -5); // Позиціювання відносно верхнього кута
            this.dashedBorder.lineTo(Math.min(pos + dashLength, this.textBounds.width + 10) - 5, -5);
            pos += dashLength + gapLength;
        }

        this.dashedBorder.x = this.border.x;
        this.dashedBorder.y = this.border.y;
    }

    addClick() {
        // Додаємо обробник події на натискання для всіх елементів
        this.button.interactive = true;  // Тепер і текст теж інтерактивний
        this.button.buttonMode = true;   // Для курсору у вигляді руки
        this.border.interactive = true; // Для бордера
        this.border.buttonMode = true;
        this.dashedBorder.interactive = true;  // Переконуємось, що елемент є інтерактивним
        this.dashedBorder.buttonMode = true;   // Для курсору у вигляді руки
    
        // Додаємо обробник для кожного елемента
        this.button.on('pointerdown', () => this.onClick());
        // this.border.on('pointerdown', () => this.onClick());
        // this.dashedBorder.on('pointerdown', () => this.onClick());
    }
    
    removeFromStage() {
        this.app.stage.removeChild(this.border);
        this.app.stage.removeChild(this.dashedBorder);
        this.app.stage.removeChild(this.button);
    }

    addToStage() {
        this.app.stage.addChild(this.border);
        this.app.stage.addChild(this.dashedBorder);
        this.app.stage.addChild(this.button);
    }

    onClick(){
        console.log(this.number);
        
        this.wsRoom.postSwapPosition(this.number)
    }
}

export class ButtonPass extends Button {
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
    }

    onClick(){
        console.log('ddd');
        
        this.wsRoom.postImPass()

        this.removeFromStage()
    }

}

