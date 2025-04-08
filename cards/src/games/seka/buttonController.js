import { ButtonBlack, ButtonPass, ButtonPlay, ButtonUp, ButtonHideOpponent } from "./button";
import { ButtonMenu } from "./buttonMenu";

export class ButtonControler {
    constructor(app, wsRom, deckSeka) {
        this.app = app;
        this.wsRom = wsRom;
        this.deckSeka = deckSeka;
        this.flip = true;
        this.pass = new ButtonPass(app, wsRom, 'Пасс', this.deckSeka);
        this.play = new ButtonPlay(app, wsRom, 'Продовжити');
        this.black = new ButtonBlack(app, wsRom, 'Темна');
        this.up = new ButtonUp(app, wsRom, 'Повисити');
        this.hideOpponent = new ButtonHideOpponent(app, wsRom, 'Скрити')
        this.buttonsManu = new ButtonMenu(this.app);
        this.buttons = [this.pass, this.play, this.black, this.up, this.hideOpponent];
        this.buttonHideOpponent = false

    }

    addButtons(minBet, maxBet) {
        if (this.flip) {
            this.addButton(this.black);
        }        
        
        this.up.addClick(minBet, maxBet, this.buttonsManu, this.buttons);
        this.up.addToStage()
        this.addButton(this.play);
        this.addButton(this.pass);
        if ( this.buttonHideOpponent ){
            this.addButton(this.hideOpponent)
        }
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

    removeButtonBlack() {
        this.black.removeFromStage();
        this.black.button.off('pointerdown');
        this.buttons = this.buttons.filter(button => button !== this.black);
        this.flip = false
    }

}
