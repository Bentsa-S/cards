import { Assets } from "pixi.js"

export const cardImages = [
    "7-Hearts",
    "10-Clubs",
    "10-Diamonds",
    "10-Hearts",
    "10-Spades",
    "A-Clubs",
    "A-Diamonds",
    "A-Hearts",
    "A-Spades",
    "J-Clubs",
    "J-Diamonds",
    "J-Hearts",
    "J-Spades",
    "K-Clubs",
    "K-Diamonds",
    "K-Hearts",
    "K-Spades",
    "Q-Clubs",
    "Q-Diamonds",
    "Q-Hearts",
    "Q-Spades"
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
