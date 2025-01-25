import * as PIXI from 'pixi.js';

export class TransparentRectangleWithText {
    constructor(app, leftText, rightText) {
        this.app = app;

        const rectangleHeight = 70;
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xffffff, 0.5);
        rectangle.drawRect(0, 0, this.app.screen.width, rectangleHeight);
        rectangle.endFill();

        rectangle.y = this.app.screen.height - rectangleHeight;

        const leftTextSprite = new PIXI.Text(leftText, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x000000,
            align: 'left',
        });
        leftTextSprite.anchor.set(0, 0.5);
        leftTextSprite.x = 20;
        leftTextSprite.y = rectangle.y + rectangleHeight / 2;

        const rightTextSprite = new PIXI.Text(rightText, {
            fontFamily: 'Arial',
            fontSize: 20,
            fill: 0x000000,
            align: 'right',
        });
        rightTextSprite.anchor.set(1, 0.5);
        rightTextSprite.x = this.app.screen.width - 20;
        rightTextSprite.y = rectangle.y + rectangleHeight / 2;

        this.container = new PIXI.Container();
        this.container.addChild(rectangle, leftTextSprite, rightTextSprite);
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
}
