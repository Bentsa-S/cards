import { Assets } from "pixi.js"

const allTwentyOneTexturesKey = {
    card: '../assets/card.png',
    card1: '../assets/card1.png'
}

Assets.addBundle('allTwentyOneTextures', allTwentyOneTexturesKey)
export const allTwentyOneTextures = await Assets.loadBundle('allTwentyOneTextures')
