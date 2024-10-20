
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
    onClickRedi() { 
        console.log(this.wsRoom);
        
        this.wsRoom.postReady()
        this.removeFromStage()
    }
    addClickRedi(){
        this.button.on('pointerdown', this.onClickRedi.bind(this));
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
