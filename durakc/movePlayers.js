// import { wsRoomDurack } from "./wsRoomDurack";
import gsap from "gsap";


export class MovePlayers{
    constructor(classGame, deckDurack, app){
        this.gameZona = classGame
        this.deckDurack = deckDurack
        this.app = app
    }


    turn(number){
        switch (number) {
            case 1:
                // this.gameZona.removeZoneAtackPlayer() 
                // const items =  this.deckDurack                    
 
                // wsRoomDurack.onmessage = (event) => {
                //     const serverData = JSON.parse(event.data);                    
                //     if(serverData.message.type === 'atack'){
                //         items.getMap().forEach((card) => {
                //             if(card.sprite.name === serverData.message.name){
                //                 this.app.stage.addChild(card.sprite);                            
                //                 card.sprite.interactive = false
                //                 card.castomMuving = false

                //                 if(!card.getZone()){
                //                     card.sprite.position.x = 1
                //                     card.sprite.position.y = 1
        
                //                     gsap.to(card.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });
                //                     gsap.to(card.sprite, { x: serverData.message.coordinates.x, y: serverData.message.coordinates.y, duration: 0.5 });
    
                //                 }
    
                //                 card.addInteractiveZone(serverData.message.coordinates.x, serverData.message.coordinates.y)
    
    
                //             }
                //         });
    
                //     }
                // }
            break;
            case 2:
                this.gameZona.addZoneAtackPlayer()

                
                // wsRoomDurack.onmessage = (event) => {
                //     const serverData = JSON.parse(event.data);
                //     if(serverData.message.type === 'def'){
                //         this.deckDurack.getMap().forEach((card) => {
                //             if(card.sprite.name === serverData.message.name){
                //                 this.app.stage.addChild(card.sprite);                            
                //                 card.sprite.interactive = false
                //                 card.castomMuving = false
                //                 if(!card.getZone()){
                //                     card.sprite.position.x = 1
                //                     card.sprite.position.y = 1
        
                //                     gsap.to(card.sprite.scale, { x: 0.4, y: 0.4, duration: 0.5 });
                //                     gsap.to(card.sprite, { x: serverData.message.coordinates.x, y: serverData.message.coordinates.y, duration: 0.5, rotation: 0.4 });

    
                //                 }    
                //             }
                //         });
    
                //     }
                // }
                
            default:
                break;
        }
    }
}