import { Assets } from "pixi.js";

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
    "Q-Spades",
];

const deckThirtySixCardsKey = {};

// Використання імпорту для кожного файла
for (let card of cardImages) {
    deckThirtySixCardsKey[card] = new URL(`../../assets/durack/${card}.png`, import.meta.url).href;
}

// Завантаження ресурсів
export const cardBacks = await Assets.load(new URL('../../assets/durack/card.png', import.meta.url).href);
export const userImg = await Assets.load(new URL('../../assets/durack/iconeUser.png', import.meta.url).href);
export const crown = await Assets.load(new URL('../../assets/items/crown.png', import.meta.url).href)
// Додаємо карти в бандл
Assets.addBundle('deckThirtySixCards', deckThirtySixCardsKey);

// Завантажуємо бандл
export const deckThirtySixCards = await Assets.loadBundle('deckThirtySixCards');
