import { Assets } from "pixi.js"

const deckThirtySixCardsKey = {
    card: '../assets/card.png',
    card1: '../assets/card1.png'
}

Assets.addBundle('deckThirtySixCards', deckThirtySixCardsKey)
export const deckThirtySixCards = await Assets.loadBundle('deckThirtySixCards')
