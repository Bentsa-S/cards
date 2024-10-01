import { Sprite, Ticker } from "pixi.js";
import { deckThirtySixCards } from "../textures/textures";

const deckInteractive = Sprite.from(deckThirtySixCards.card)
let isFlipped = false;

deckInteractive.y = 250
deckInteractive.x = 150
deckInteractive.anchor.set(0.5);
deckInteractive.scale.set(1);  // Початковий масштаб
deckInteractive.interactive = true
deckInteractive.buttonMode = true; 
deckInteractive.on('pointerdown', flipCard);




function flipCard() {

    let flipProgress = 0;
    let speedRidght = 0
    const flipSpeed = 0.05;  // Швидкість анімації

    const ticker = new Ticker();
    ticker.add(() => {
        if (speedRidght < 20){
            deckInteractive.x += 2
            speedRidght++
        }else{
            deckInteractive.x += 10
            if (flipProgress <= 1) {
                if (flipProgress <= 0.5) {
                    // Зменшуємо масштаб для ефекту перевертання
                    deckInteractive.scale.x = 1 - 2 * flipProgress;
                } else if (!isFlipped && deckInteractive.scale.x <= 0) {
                    // Міняємо текстуру тільки один раз при значенні scale.x <= 0
                    deckInteractive.texture = deckThirtySixCards.card1;
                    isFlipped = true;
                } else if (isFlipped && deckInteractive.scale.x <= 0) {
                    // Міняємо текстуру назад, якщо картка вже перевернута
                    deckInteractive.texture = deckThirtySixCards.card;
                    isFlipped = false;
                }
                // Збільшуємо масштаб після зміни текстури
                deckInteractive.scale.x = -1 + 2 * flipProgress;
                flipProgress += flipSpeed;  // Оновлюємо прогрес перевертання
            } else {
                ticker.stop();     // Зупиняємо анімацію після завершення
            }
        }
        
    });
    ticker.start();  // Починаємо анімацію
}


export default deckInteractive