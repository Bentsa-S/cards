import { Graphics } from "pixi.js";

export class DurackGame {
    constructor(app) {
        this.zone = new Graphics();
        this.zone.beginFill(0xff0000, 0.5);
        this.zone.drawRect(0, 0, 500, 400);
        this.zone.endFill();
        this.zone.zIndex = -20
        this.app = app;
        this.zone.position.set((this.app.screen.width / 2 - this.zone.width / 2), (this.app.screen.height / 3 - this.zone.height / 2));

        this.app.stage.addChild(this.zone);

        this.zone.interactive = true;

        this.addEventListeners();
    }

    addEventListeners() {
        // Перевірка на перетягування спрайтів в зону
        this.app.stage.on('pointerup', () => {
            let i = 0;
            this.app.stage.children.forEach(e => {
                if (this.isInside(e)) {
                    console.log(e.name);
                    e.y = 200
                    e.x = 200
                    i++;
                }
            })
            if (i === 1){
                console.log(12);
            }            
        });
    }

    isInside(position) {
        // Перевірка, чи знаходиться спрайт в межах зони
        const bounds = this.zone.getBounds();
        return (
            position.x > bounds.x &&
            position.x < bounds.x + bounds.width &&
            position.y > bounds.y &&
            position.y < bounds.y + bounds.height
        );
    }
}
