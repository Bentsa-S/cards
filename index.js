import { Application} from 'pixi.js';
import { DraggableItem } from './durakc/durackCardsMove';
import { deckThirtySixCards } from './textures/textures';
import { DurackGame } from './durakc/durackGame';
// import deckInteractive from './twentyOneGame/twentyOneGame';
export const pixiApp = new Application({
    resizeTo: window
})

document.body.appendChild(pixiApp.view)
const item = new DraggableItem(deckThirtySixCards.card1, '1', pixiApp);
const item1 = new DraggableItem(deckThirtySixCards.card1, '2', pixiApp);
const item2 = new DraggableItem(deckThirtySixCards.card1, '3', pixiApp);
const item3 = new DraggableItem(deckThirtySixCards.card1, '4', pixiApp);

const zone = new DurackGame(pixiApp)
console.log(pixiApp.stage.children.forEach(child => console.log(child.name)));


// pixiApp.stage.addChild(deckInteractive)
