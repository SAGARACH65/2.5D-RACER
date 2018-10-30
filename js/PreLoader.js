//loads all the images before the game starts
class PreLoader {

    constructor() {
        this.totalImages = GAME_IMAGES.length;
        this.loadedImages = 0;
    }

    load(callback) {
        GAME_IMAGES.map(image => {
            var img = new Image();
            img.src = image;
            img.onload = () => {
                this.loadedImages++;
                if (this.loadedImages >= this.totalImages) callback();
            }
        });
    }
}