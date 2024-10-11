import { Assets } from "pixi.js"

export const cardImages = [
    "7Hearts",
    "10Clubs",
    "10Diamonds",
    "10Hearts",
    "10Spades",
    "AClubs",
    "ADiamonds",
    "AHearts",
    "ASpades",
    "JClubs",
    "JDiamonds",
    "JHearts",
    "JSpades",
    "KClubs",
    "KDiamonds",
    "KHearts",
    "KSpades",
    "QClubs",
    "QDiamonds",
    "QHearts",
    "QSpades"
  ];
  
const deckThirtySixCardsKey = {
    card: '../assets/card.png',
    card1: '../assets/card1.png'
}

for (let i of cardImages) {
    deckThirtySixCardsKey[i] = `../assets/${i}.png`;
}

Assets.addBundle('deckThirtySixCards', deckThirtySixCardsKey)
export const deckThirtySixCards = await Assets.loadBundle('deckThirtySixCards')
