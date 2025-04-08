// import { wWsRoomSeka } from "./wsRoomDurack";
import { WsRoomSeka } from "./wsRoomSeka";
import { ButtonReadyTake, ButtonPutch } from "./button";
import { ButtonControler } from './buttonController';


export class MovePlayers{
    constructor(classGame, deckSeka, enemyContainer, app){
        this.gameZona = classGame
        this.deckSeka = deckSeka
        this.app = app
        this.enemyContainer = enemyContainer
        this.WsRoom = new WsRoomSeka()
        this.buttonReadyTake = new ButtonReadyTake(this.app, this.WsRoom, 'Почати')
        this.buttonPutch = new ButtonPutch(this.app, this.WsRoom, 'putch', this.gameZona)
        this.buttonControler = new ButtonControler(this.app, this.WsRoom, this.deckSeka)

    }

    addButtonHideOpponent(){
        this.buttonControler.buttonHideOpponent = true
    }

    removeButtonBlack(){
        this.buttonControler.removeButtonBlack()
    }

    turn(number, bet){
        switch (number) {
            case 2:
                this.gameZona.createPrintCards(false) 

                break;
            case 1:
                this.gameZona.createPrintCards()
                this.buttonReadyTake.addClick()
                this.buttonReadyTake.addToStage()
 
                break;
            case 3:
                this.gameZona.createSlider()
                this.buttonPutch.addClick()
                this.buttonPutch.addToStage()
                this.gameZona.flipCards()

                break;
            case 4:
                this.gameZona.flipCards()

            break;
            case 5:
                this.buttonControler.addButtons(bet, 100)

            break;
            case 6:

            break;



            default:
                break;
        }
    }
}




