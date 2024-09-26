import { Sprite, Application, Ticker } from 'pixi.js';
import { allTwentyOneTextures } from './textures/textures'

let isFlipped = false;
export const pixiApp = new Application()

document.body.appendChild(pixiApp.view)

const deckInteractive = Sprite.from(allTwentyOneTextures.card)

deckInteractive.y = 100
deckInteractive.x = 150
deckInteractive.anchor.set(0.5);
deckInteractive.scale.set(1);  // Початковий масштаб
deckInteractive.interactive = true
deckInteractive.buttonMode = true; 
deckInteractive.on('pointerdown', flipCard);

pixiApp.stage.addChild(deckInteractive)



function clik() {
    pixiApp.stage.addChild(Sprite.from(allTwentyOneTextures.card1))
    console.log(1);
    
}


function flipCard() {

    let flipProgress = 0;
    const flipSpeed = 0.05;  // Швидкість анімації

    const ticker = new Ticker();
    ticker.add(() => {
        if (flipProgress <= 1) {
            if (flipProgress <= 0.5) {
                // Зменшуємо масштаб для ефекту перевертання
                deckInteractive.scale.x = 1 - 2 * flipProgress;
            } else if (!isFlipped && deckInteractive.scale.x <= 0) {
                // Міняємо текстуру тільки один раз при значенні scale.x <= 0
                deckInteractive.texture = allTwentyOneTextures.card1;
                isFlipped = true;
            } else if (isFlipped && deckInteractive.scale.x <= 0) {
                // Міняємо текстуру назад, якщо картка вже перевернута
                deckInteractive.texture = allTwentyOneTextures.card;
                isFlipped = false;
            }
            // Збільшуємо масштаб після зміни текстури
            deckInteractive.scale.x = -1 + 2 * flipProgress;
            flipProgress += flipSpeed;  // Оновлюємо прогрес перевертання
        } else {
            ticker.stop();     // Зупиняємо анімацію після завершення
        }
    });
    ticker.start();  // Починаємо анімацію
}
