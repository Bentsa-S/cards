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
        this.wsRoom.postWhipped()
        this.deck.audit()
        this.app.stage.sortChildren();
        this.app.stage.children.forEach((item) => {
            const isInBounds = item.x > 100 && item.x < 700 &&
            item.y > 100 && item.y < 400;

            if(isInBounds){
                if(item.name === 'zone'){
                    this.app.stage.removeChild(item)
                }else{
                    console.log(item.name);
                
                    // анімація перевороту карт
                    gsap.to(item.scale, { x: 0, duration: .5,
                        onComplete: () => {
                            item.texture = cardBacks;
                
                            gsap.to(item.scale, { x: .4, y: .4, duration: .5, 
                                onComplete: () => {
                                    gsap.to(item, { x: 1800, y: 300, duration: 3 });
                                    gsap.to(item, {rotation: 1.5, duration: 1, onComplete: () => {
                                        this.deck.getDeck().forEach((cardSprite, cardName) => {
                        
                                            if (cardName === item.name){
                                                this.deck.removeCardInStage(cardSprite)    
                                                this.deck.removeCardInDeck(cardName)
                        
                                            }
                                        })
                                        // this.app.stage.removeChild(item)
                                    }});

                                }});
                            
                        }

                    })
                    

                    
                }

            }

        })        
    }
}


export class ButtonTeka extends Button{
    
    constructor(app, wsRoom, text, deck){
        super(app, wsRoom, text)
        this.wsRoom = wsRoom
        this.deck = deck
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
        this.wsRoom.postImTeka()
        const card = []
        this.app.stage.sortChildren();
        this.app.stage.children.forEach((e) => {
            const isInBounds = e.x > 100 && e.x < 700 &&
            e.y > 100 && e.y < 400;

            if(isInBounds){
                if (e.name === 'zona'){
                    this.app.stage.removeChild(e.name)
                }else {
                    card.push(e.name)

                }
                // gsap.to(e, {x: 1, y:1})

            }
        })
        this.deck.addPlayerCards(card)
    }

}
