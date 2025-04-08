import { Sprite } from "pixi.js";
import gsap from "gsap";
import { cardBacks } from "../textures/textures";
import { WsRoomSeka } from "./wsRoomSeka";


export class CardsMove {
    static flip = true
    constructor(texture, name, app) {
        this.sprite = new Sprite(texture);
        this.app = app;
        this.textureCard = texture;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.direction = 0;
        this.flipCount = 0;
        this.isAnimating = false;
        this.originalTexture        
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(0.5);
        this.sprite.position.x = 300;
        this.sprite.position.y = 500;
        this.sprite.interactive = true;
        this.sprite.name = name;

        this.sprite.on('pointerdown', this.handleFlip.bind(this));
    }

    setTexture(texture) {
        this.sprite.texture = texture;
    }

    spaunThisSprite(x, y) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;

        this.app.stage.addChild(this.sprite);
        this.interactive = true;
    }

    removeCardLeft() {
        gsap.to(this.sprite, { x: -this.sprite.width, duration: 1, onComplete: () => {
            this.app.stage.removeChild(this.sprite); // Видалити карту зі сцени
        } });
    }
    
    async addAppThisChaild(x = 300, y = 500) {
        this.firstPositionX = x;
        this.firstPositionY = y;
        this.sprite.position.x = -30;
        this.sprite.position.y = 300;
        this.sprite.rotation = 1.3;
        this.sprite.texture = cardBacks;
        this.interactive = true;
        this.app.stage.addChild(this.sprite);
        gsap.to(this.sprite, { rotation: 0, duration: 0.7 });

        gsap.to(this.sprite, { x: x, y: y, duration: 1 });
    }

    pickUpTheCard(){
        this.sprite.interactive = false
        gsap.to(this.sprite, {
            x: -100,
            y: 300,
            duration: 0.7,
        });
    }

    handleFlip(flag = true) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        if (this.flipCount === 0) {
            if (flag){
                const ws = new WsRoomSeka()
                ws.postFlipBleack()
            }
            gsap.to(this.sprite.scale, {
                x: 0,
                duration: 0.3,
                onComplete: () => {
                    this.sprite.texture = this.textureCard;
                    gsap.to(this.sprite.scale, {
                        x: 0.5,
                        y: 0.5,
                        duration: 0.3,
                        onComplete: () => {
                            this.isAnimating = false;
                        }
                    });
                },
            });
        } else {
            gsap.to(this.sprite.scale, {
                x: 0,
                duration: 0.2,
                onComplete: () => {
                    this.sprite.texture = cardBacks;
                    gsap.to(this.sprite.scale, {
                        x: 0.5,
                        y: 0.5,
                        duration: 0.2,
                        onComplete: () => {
                            gsap.to(this.sprite.scale, {
                                x: 0,
                                duration: 0.2,
                                onComplete: () => {
                                    this.sprite.texture = this.textureCard;
                                    gsap.to(this.sprite.scale, {
                                        x: 0.5,
                                        y: 0.5,
                                        duration: 0.2,
                                        onComplete: () => {
                                            this.isAnimating = false;
                                        }
                                    });
                                },
                            });
                        },
                    });
                },
            });
        }

        this.flipCount++;
    }

    flipToBeack(scaleCard = 0.5) {
        this.sprite.interactive = false
        gsap.to(this.sprite.scale, {
            x: 0,
            duration: 0.3,
            onComplete: () => {
            this.sprite.texture = cardBacks;
                gsap.to(this.sprite.scale, {
                    x: scaleCard,
                    y: scaleCard,
                    duration: 0.3,
                    onComplete: () => {
                        this.isAnimating = false;
                    }
                });    
        
            },
        });
    }


    setRotation(angle) {
        gsap.to(this.sprite, {rotation: angle, duration: .7});
    }

}
