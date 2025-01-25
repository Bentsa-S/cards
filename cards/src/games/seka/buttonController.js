import { ButtonBlack, ButtonPass, ButtonPlay, ButtonUp } from "./button";
import { CardsMove } from "./cardsMove";

export class ButtonControler {
    constructor(app, wsRom) {
        this.app = app;
        this.wsRom = wsRom;

        this.pass = new ButtonPass(app, wsRom, 'Пасс');
        this.play = new ButtonPlay(app, wsRom, 'Продовжити');
        this.black = new ButtonBlack(app, wsRom, 'Темна');
        this.up = new ButtonUp(app, wsRom, 'Повисити');

        this.buttons = [this.pass, this.play, this.black, this.up];
    }

    addButtons() {
        if (CardsMove.flip) {
            this.addButton(this.black);
        }
        console.log(CardsMove.flip);
        
        this.addButton(this.up);
        this.addButton(this.play);
        this.addButton(this.pass);
    }

    addButton(button) {
        button.addClick();
        button.addToStage()
        button.button.on('pointerdown', () => this.remoweButton());
    }

    addButtonPass() {
        this.addButton(this.pass);
    }

    remoweButton() {
        this.buttons.forEach(button => {
            button.removeFromStage();
            button.button.off('pointerdown');
        });
    }
}
