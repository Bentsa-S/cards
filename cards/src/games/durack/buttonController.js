import { ButtonPass, ButtonTeka, ButtonWhipped } from "./button";


export class ButtonControler {
    constructor(app, wsRom, gameZone, deck, enemyContainer, number){
        this.app = app
        this.wsRom = wsRom
        this.number = number
        this.teka = new ButtonTeka(app, wsRom, 'Беру', deck, gameZone, enemyContainer)
        this.whipped = new ButtonWhipped(app, wsRom, 'Бито', gameZone, deck)
        this.pass = new ButtonPass(app, wsRom, 'Пасс')
        document.addEventListener('touchend', this.handleMouseUp.bind(this));
    }

    addButton(action) {
        if (action === 'atack') {
            this.teka.addClick()
            this.teka.addToStage();
        } else if (action === 'def') {
            if (this.number === 4){
                this.pass.addClick()
                this.pass.addToStage()
            }else{
                this.whipped.addClick()
                this.whipped.addToStage();
            }
        }
    }

    addButtonPass(){
        this.pass.addClick()
        this.pass.addToStage()
    }

    remoweButton() {
        this.teka.removeFromStage();
        this.whipped.removeFromStage();
    }

    handleMouseUp(event) {
        const targetArea = { x: 200, y: 200, width: 500, height: 5000 };    
        let clientX, clientY;
    
        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
            clientY = event.touches[0].clientY;
        } else if (event.clientX !== undefined && event.clientY !== undefined) {
            clientX = event.clientX;
            clientY = event.clientY;
        } else {
            console.warn("Не вдалося отримати координати клієнта");
            return;
        }
    
        if (
            clientX >= targetArea.x &&
            clientX <= targetArea.x + targetArea.width &&
            clientY >= targetArea.y &&
            clientY <= targetArea.y + targetArea.height
        ) {
            this.remoweButton();
        }
    }
}
