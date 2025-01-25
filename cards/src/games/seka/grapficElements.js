import * as PIXI from 'pixi.js';

export class TransparentRectangleWithText {
    constructor(app, text) {
        this.app = app;

        // Створення прозорого прямокутника
        const rectangleHeight = 130;
        this.rectangle = new PIXI.Graphics();
        this.rectangle.beginFill(0xffffff, 0.5);
        this.rectangle.drawRect(0, 0, this.app.screen.width, rectangleHeight);
        this.rectangle.endFill();

        this.rectangle.y = this.app.screen.height - rectangleHeight;

        // Створення тексту
        this.textSprite = new PIXI.Text(text, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x000000,
            align: 'center',
        });
        this.textSprite.anchor.set(0.5);
        this.textSprite.x = this.app.screen.width / 2;
        this.textSprite.y = this.rectangle.y + rectangleHeight / 2 - 30;

        // Додавання до контейнера
        this.container = new PIXI.Container();
        this.container.addChild(this.rectangle, this.textSprite);

        // Додавання на сцену
        this.addFromStage();
    }

    addFromStage() {
        this.app.stage.addChild(this.container);
        this.keepOnTop();
    }

    removeFromStage() {
        this.app.stage.removeChild(this.container);
    }

    keepOnTop() {
        this.app.ticker.add(() => {
            const stage = this.app.stage;
            stage.setChildIndex(this.container, stage.children.length - 1);
        });
    }

    updateText(newText) {
        this.textSprite.text = newText;
        this.textSprite.updateText();  // Примусове оновлення тексту
    }
}

export class InfoTable {
    constructor(app, betText, bankText) {
        this.app = app;

        // Текст для ставки
        this.betTextSprite = new PIXI.Text(betText, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            align: 'center',
        });
        this.betTextSprite.anchor.set(0.5);
        this.betTextSprite.x = this.app.screen.width / 2;
        this.betTextSprite.y = this.app.screen.height / 2 - 160;

        // Текст для загального банку
        this.bankTextSprite = new PIXI.Text(bankText, {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0xffffff,
            align: 'center',
        });
        this.bankTextSprite.anchor.set(0.5);
        this.bankTextSprite.x = this.app.screen.width / 2;
        this.bankTextSprite.y = this.app.screen.height / 2 - 130;

        // Додавання до контейнера
        this.container = new PIXI.Container();
        this.container.addChild(this.betTextSprite, this.bankTextSprite);

        // Додавання на сцену
        this.addFromStage();
    }

    addFromStage() {
        this.app.stage.addChild(this.container);
        this.keepOnTop();
    }

    removeFromStage() {
        this.app.stage.removeChild(this.container);
    }

    keepOnTop() {
        this.app.ticker.add(() => {
            const stage = this.app.stage;
            stage.setChildIndex(this.container, stage.children.length - 1);
        });
    }

    // Оновлення основного тексту
    updateText(newText) {
        this.textSprite.text = newText;
        this.textSprite.updateText();
    }

    // Оновлення тексту ставки
    updateBetText(newBetText) {
        this.betTextSprite.text = newBetText;
        this.betTextSprite.updateText();
    }

    // Оновлення тексту загального банку
    updateBankText(newBankText) {
        this.bankTextSprite.text = newBankText;
        this.bankTextSprite.updateText();
    }
}
