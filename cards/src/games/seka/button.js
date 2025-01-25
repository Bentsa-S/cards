import * as PIXI from 'pixi.js';
import { ButtonMenu } from './buttonMenu';

export class Button {
    constructor(app, wsRoom, text) {
        this.app = app;
        this.wsRoom = wsRoom;

        const buttonGraphics = new PIXI.Graphics();
        buttonGraphics.beginFill(0xC36A6A);
        buttonGraphics.drawRoundedRect(0, 0, 120, 40, 20);
        buttonGraphics.endFill();

        const buttonText = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
        });

        buttonText.anchor.set(0.5);
        buttonText.x = buttonGraphics.width / 2;
        buttonText.y = buttonGraphics.height / 2;

        this.button = new PIXI.Container();
        this.button.addChild(buttonGraphics, buttonText);

        this.button.x = (this.app.screen.width - buttonGraphics.width) / 2;
        this.button.y = (this.app.screen.height - buttonGraphics.height) / 2;

        this.button.interactive = true;
        this.button.buttonMode = true;
    }

    onClick() {}

    addClick() {
        this.button.on('pointerdown', () => this.onClick());
    }

    addToStage() {
        this.button.zIndex = 10;
        this.app.stage.addChild(this.button);
        this.app.stage.sortableChildren = true; // Увімкнути сортування за zIndex
    }
    
    removeFromStage() {
        this.app.stage.removeChild(this.button);
    }

}

export class ButtonReady extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.button.x = (this.app.screen.width - this.button.width) / 2;
        this.button.y = this.app.screen.height - this.button.height - 15;
    }

    onClick() { 
        this.wsRoom.postReady()
        this.removeFromStage()
    }
}  

export class ButtonReadyTake extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.button.x = (this.app.screen.width - this.button.width) / 2;
        this.button.y = this.app.screen.height - this.button.height - 20;
    }

    onClick() { 
        this.removeFromStage()
        this.wsRoom.getRedyTake()
    }
}  


export class ButtonPass extends Button {
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.button.x = 15;
        this.button.y = this.app.screen.height - this.button.height - 15;
    }

    onClick(){        
        this.wsRoom.postImPass()
        this.removeFromStage()
    }

}


export class ButtonPlay extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.wsRoom = wsRoom
        this.button.x = this.app.screen.width - this.button.width - 15;
        this.button.y = this.app.screen.height - this.button.height - 15;
        
    }

    onClick() { 
        this.wsRoom.postPlay() 
    }   
}

export class ButtonUp extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.wsRoom = wsRoom
        this.button.x = this.app.screen.width - this.button.width - 15;
        this.button.y = this.app.screen.height - this.button.height - 70;
        
    }

    onClick() {         
        const menu = new ButtonMenu(this.app, [
            { label: "All-in", callback: () => console.log("All-in clicked") },
            { label: "Pot 100%", callback: () => console.log("Pot 100% clicked") },
            { label: "+2 BB", callback: () => console.log("+2 BB clicked") },
        ], 10, 100);
    }   
}

export class ButtonBlack extends Button{
    
    constructor(app, wsRoom, text){
        super(app, wsRoom, text)
        this.wsRoom = wsRoom
        this.button.x = 15;
        this.button.y = this.app.screen.height - this.button.height - 70;
        
    }

    onClick() { 
        this.wsRoom.postWhipped() 
    }   
}

export class ButtonPutch extends Button{
    
    constructor(app, wsRoom, text, gameZona){
        super(app, wsRoom, text)
        this.button.x = (this.app.screen.width - this.button.width) / 2;
        this.button.y = this.app.screen.height - this.button.height - 20;
        this.gameZona = gameZona
    }

    onClick() { 
        this.removeFromStage()
        this.wsRoom.postPutch(this.gameZona.label.text)
        setTimeout(() => {
            this.wsRoom.endSwapCards()
        }, 4000)                

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
        this.wsRoom.postSwapPosition(this.number)
    }
}

