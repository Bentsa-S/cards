import { Graphics, Text, TextStyle } from "pixi.js";

export class ButtonMenu {
    constructor(app) {
        this.app = app;
        this.buttons = [];
        this.container = new Graphics();
        this.app.stage.addChild(this.container);

        this.style = new TextStyle({
            fontFamily: "Arial",
            fontSize: 14, // Менший розмір тексту
            fill: 0xffffff, // Білий текст
        });

        this.slider = null; // Слайдер поки не створено
        // Додати білий фон для всього меню
    }

    addManu(options = [], sliderMin = 0, sliderMax = 100) {
        this.sliderMin = sliderMin;
        this.sliderMax = sliderMax;
    
        this.background = new Graphics();
        this.container.addChild(this.background);
    
        // Ініціалізація кнопок
        this.addSlider();
        options.forEach((opt) => this.addButton(opt.label, opt.callback));
    
        // Оновити позицію меню та розміри фону
        this.updatePosition();
        this.updateBackground();
    
        // Завжди переміщує контейнер меню в кінець масиву дітей сцени (тобто на верхній шар)
        this.app.stage.addChild(this.container);
    }

    removeMenu() {
        // Видаляємо всі кнопки
        while (this.buttons.length > 0) {
            this.removeButton();
        }
    
        // Видаляємо слайдер, якщо він існує
        if (this.slider) {
            this.slider.handle.destroy();
            this.slider.line.destroy();
            this.slider.label.destroy();
            this.slider = null; // Очищуємо слайдер
        }
    
        // Видаляємо фон
        this.background.destroy();
        this.background = null; // Очищуємо фон
    }
    
    
    // Додає кнопку до меню
    addButton(label, callback) {
        const buttonHeight = 30; // Висота кнопки
        const buttonWidth = 100; // Ширина кнопки
        const buttonSpacing = 5; // Відступ між кнопками
        const buttonRadius = 10; // Радіус заокруглення кнопки

        const buttonY = this.buttons.length * (buttonHeight + buttonSpacing);

        // Фон кнопки
        const button = new Graphics();
        button.beginFill(0xd28080); // Колір кнопки (такий самий, як у ручки слайдера)
        button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, buttonRadius); // Заокруглений прямокутник
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;
        button.y = buttonY;

        // Текст на кнопці
        const text = new Text(label, this.style);
        text.anchor.set(0.5);
        text.x = buttonWidth / 2;
        text.y = buttonHeight / 2;
        button.addChild(text);

        // Додати обробник кліків
        button.on("pointerdown", callback);

        // Додати кнопку в контейнер і список
        this.container.addChild(button);
        this.buttons.push(button);

        // Оновити позицію меню та розміри фону
        this.updatePosition();
        this.updateBackground();
    }

    // Додає слайдер до меню
    addSlider() {
        const sliderLineHeight = 100; // Висота лінії слайдера
        const sliderLineWidth = 5; // Ширина лінії слайдера
        const buttonWidth = 100; // Ширина кнопок
        const sliderXOffset = buttonWidth + 20; // Відступ слайдера від кнопок

        // Лінія слайдера
        const sliderLine = new Graphics();
        sliderLine.beginFill(0xcccccc); // Сірий колір основи слайдера
        sliderLine.drawRect(0, 0, sliderLineWidth, sliderLineHeight); // Лінія вертикальна
        sliderLine.endFill();
        sliderLine.x = sliderXOffset; // Розташування праворуч від кнопок

        this.container.addChild(sliderLine);

        // Ручка слайдера
        const sliderHandle = new Graphics();
        sliderHandle.beginFill(0xd28080); // Колір ручки
        sliderHandle.drawCircle(0, 0, 10);
        sliderHandle.endFill();
        sliderHandle.x = sliderLine.x + sliderLineWidth / 2;
        sliderHandle.y = sliderLine.y + sliderLineHeight / 2;
        sliderHandle.interactive = true;
        sliderHandle.buttonMode = true;

        this.container.addChild(sliderHandle);

        // Лейбл для слайдера (показує значення)
        console.log(this.sliderMax);
        console.log(this.sliderMin);
        
        const label = new Text(
            this.sliderMin.toString(),
            new TextStyle({
                fontFamily: "Arial",
                fontSize: 18, // Збільшення шрифта для кращої видимості
                fill: 0x000000, // Чорний колір тексту
            })
        );
        label.anchor.set(0.5);
        label.x = 70; // Відстань між слайдером і цифрою
        label.y = -30; // Вирівнюємо по вертикалі з слайдером

        this.container.addChild(label);

        this.slider = {
            line: sliderLine,
            handle: sliderHandle,
            label: label,
        };

        // Події для ручки слайдера
        let dragging = false;
        sliderHandle
            .on("pointerdown", (event) => {
                dragging = true;
                sliderHandle.data = event.data;
            })
            .on("pointerup", () => {
                dragging = false;
                sliderHandle.data = null;
            })
            .on("pointerupoutside", () => {
                dragging = false;
                sliderHandle.data = null;
            })
            .on("pointermove", (event) => {
                if (dragging) {
                    const globalPosition = event.global;
                    const localPosition = this.container.toLocal(globalPosition);

                    // Обмеження руху ручки
                    const minY = sliderLine.y;
                    const maxY = sliderLine.y + sliderLineHeight;

                    if (localPosition.y >= minY && localPosition.y <= maxY) {
                        sliderHandle.y = localPosition.y;

                        this.sliderMin = Number(this.sliderMin);
                        this.sliderMax = Number(this.sliderMax);                        
                        // Переводимо координати ручки в значення слайдера
                        const value = Math.round(
                            this.sliderMin +
                            ((maxY - sliderHandle.y) / sliderLineHeight) *
                            (this.sliderMax - this.sliderMin)
                        );
                        label.text = value.toString();
                    }
                }
            });
    }

    // Видаляє останню кнопку
    removeButton() {
        if (this.buttons.length > 0) {
            const button = this.buttons.pop();
            this.container.removeChild(button);
            button.destroy();

            // Оновити позицію меню та розміри фону
            this.updatePosition();
            this.updateBackground();
        }
    }

    // Очищає всі кнопки
    clearMenu() {
        while (this.buttons.length > 0) {
            this.removeButton();
        }
    }

    // Оновлює позицію меню на екрані
    updatePosition() {
        this.container.x = this.app.renderer.width - this.container.width; // Відступ справа
        this.container.y = this.app.renderer.height - this.container.height - 100; // Відступ знизу
    }

    // Оновлює фон меню
    updateBackground() {
        const backgroundRadius = 20; // Радіус заокруглення фону
        this.background.clear();
        this.background.beginFill(0xffffff); // Білий фон
        this.background.drawRoundedRect(
            -10, // Відступ для створення рамки
            -60, // Зміщуємо фон на 60 пікселів вище
            this.container.width + 20,
            this.container.height + 40, // Збільшуємо висоту фону для покриття зміщення
            backgroundRadius
        );
        this.background.endFill();
        this.background.zIndex = -1; // Щоб фон був позаду кнопок і слайдера
    }
}
