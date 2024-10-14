


export class SeelvePlayer{
    constructor(deckClass){
        this.seelve = new Map()
        this.deck = deckClass.getDeck()
    }

    audit(){        
        while(this.seelve.size < 6){
            const goat = Array.from(this.deck.entries())[0]
            this.seelve.set(goat[0], goat[1])
            
            this.deck.delete(goat[0])
            goat[1].addAppThisChaild()
        }
    }

    removeCardSeelvate(key){
        this.seelve.delete(key)        
    }
}