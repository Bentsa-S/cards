import { ButtonTeka, ButtonWhipped } from "./button";


export class ButtonControler {
    constructor(app, wsRom, gameZone, deck, enemy){
        this.app = app
        this.wsRom = wsRom
        this.teka = new ButtonTeka(app, wsRom, 'Беру', deck, enemy)
        this.whipped = new ButtonWhipped(app, wsRom, 'Бито', gameZone, deck)

        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    addButton(action) {
        if (action === 'atack') {
            this.teka.addClick()
            this.teka.addToStage();
        } else if (action === 'def') {
            this.whipped.addClick()
            this.whipped.addToStage();
        }
    }

    remoweButton() {
        this.teka.removeFromStage();
        this.whipped.removeFromStage();
    }

    handleMouseUp(event) {
        const targetArea = { x: 100, y: 100, width: 300, height: 300 }; // Вкажіть координати та розміри області

        if (
            event.clientX >= targetArea.x &&
            event.clientX <= targetArea.x + targetArea.width &&
            event.clientY >= targetArea.y &&
            event.clientY <= targetArea.y + targetArea.height
        ) {            
            this.remoweButton();
        }
    }
}
