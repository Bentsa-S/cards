import { Application } from 'pixi.js';
import { MainControllerGame } from './durakc/main';
import { userImg } from './textures/textures';
const pixiApp = new Application({
    resizeTo: window
});

document.body.appendChild(pixiApp.view);
// postRedy()
// getWb()
console.log(userImg);
pixiApp.stage.sortableChildren = true;

const main = new MainControllerGame(pixiApp, 3, 1, 'vasa', 12)
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