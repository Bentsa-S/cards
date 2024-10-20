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
  
const deckThirtySixCardsKey = {}

for (let i of cardImages) {
    deckThirtySixCardsKey[i] = `../assets/${i}.png`;
}

export const cardBacks = await Assets.load('../assets/card.png')
export const userImg = await Assets.load('../assets/iconeUser.png')

Assets.addBundle('deckThirtySixCards', deckThirtySixCardsKey)
export const deckThirtySixCards = await Assets.loadBundle('deckThirtySixCards')
