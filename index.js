import { Application } from 'pixi.js';
import { DurackGame } from './durakc/durackGame';
import { DeckDurack } from './durakc/durakDeck';
import { MovePlayers } from './durakc/movePlayers';
import { SeelvePlayer } from './durakc/sleevePlayer';
import { cardImages } from './textures/textures'
import { MainControllerGame } from './durakc/main';

export const pixiApp = new Application({
    resizeTo: window
});

document.body.appendChild(pixiApp.view);
// postRedy()
// getWb()

const main = new MainControllerGame(pixiApp)
main.start()
// wsRoomDurack.onmessage = (event) => {
//     const serverData = JSON.parse(event.data); 
//     console.log(serverData);

// }

// export const deckDurack = new DeckDurack(pixiApp, cardImages);
// deckDurack.addDeckToGame();


// // deckDurack.addItemDeckCards('10Spades')

// deckDurack.addGoat()
// deckDurack.addMapDeckCards();

// const seelvePlayer = new SeelvePlayer(deckDurack)

// // seelvePlayer.audit()
// const zone = new DurackGame(pixiApp, deckDurack, seelvePlayer);
// zone.addZoneAtackPlayer();

// // const movePlayers = new MovePlayers(zone, deckDurack, pixiApp);
// // movePlayers.turn(2);