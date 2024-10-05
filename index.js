import { Application} from 'pixi.js';
// import { DraggableItem } from './durakc/durackCardsMove';
// import { deckThirtySixCards } from './textures/textures';
import { DurackGame } from './durakc/durackGame';
import { DeckDurack } from './durakc/durakDeck';
// import { mapDeckCards, addMapDeckCards } from './durakc/durakDeck';
// import deckInteractive from './twentyOneGame/twentyOneGame';
export const pixiApp = new Application({
    resizeTo: window
})

document.body.appendChild(pixiApp.view)

export const deckDurack = new DeckDurack(pixiApp)

deckDurack.addMapDeckCards()


// const zone = new DurackGamePlayerOne(pixiApp)

const zone = new DurackGame(pixiApp, deckDurack)
// pixiApp.stage.addChild(deckInteractive)
