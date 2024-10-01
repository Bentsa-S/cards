import { Application, Sprite} from 'pixi.js';
import { DraggableItem } from './durakc/durackCardsMove';
import { deckThirtySixCards } from './textures/textures';
// import deckInteractive from './twentyOneGame/twentyOneGame';
export const pixiApp = new Application()

document.body.appendChild(pixiApp.view)
const item = new DraggableItem(deckThirtySixCards.card1, pixiApp);
const item1 = new DraggableItem(deckThirtySixCards.card1, pixiApp);
const item2 = new DraggableItem(deckThirtySixCards.card1, pixiApp);
const item3 = new DraggableItem(deckThirtySixCards.card1, pixiApp);

// pixiApp.stage.addChild(deckInteractive)
