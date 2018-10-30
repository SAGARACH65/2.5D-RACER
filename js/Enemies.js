class Enemies {

    constructor(maxSpeed, index, zPos, name) {
        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.acceleration = maxSpeed / ENEMY_ACCELERATION_FACTOR;
        this.x = this.calculateRandomXPos(index);
        this.zPos = zPos;
        this.name = name;
        this.isOverFinishLine = false;
        this.spriteLocation = this.findRandomImage();
    }

    findRandomImage() {
        return ENEMY_IMAGES[generateRandomNO(-1, ENEMY_IMAGES.length)];
    }

    checkIfEnemyCrossedFinishLine() {
        if (this.zPos >= TOTAL_LENGTH_OF_ROAD * ROAD_PARAM.SEGMENT_LENGTH) this.isOverFinishLine = true;
    }

    //randomly generates the starting position of the enemy cars
    calculateRandomXPos(index) {
        let sign = (generateRandomNO(-1, 2) === 0) ? -1 : 1;
        return (sign * generateRandomNO(30, 200));
    }

    updateSpeed() {
        //stop the car after they have reached the finish line
        if (!this.isOverFinishLine)
            (!(this.speed >= this.maxSpeed)) ? this.speed += this.acceleration : this.speed = this.maxSpeed;
        else
            (!(this.speed <= 0)) ? this.speed -= this.acceleration : this.speed = 0;
    }
    handleCollision() {
        this.speed = this.speed / ENEMY_COLLISION_SPEED_DECREASE_FACTOR;
    }

    updateZPos() {
        this.zPos += this.speed;
    }

    updateX(increment) {
        this.x += increment;
        if ((this.x < -1.3 || this.x > 0.8)) this.x -= increment;
    }

    draw(ctx, curvature, destX, destY, width, height) {
        let spriteSheet = new Image();
        spriteSheet.src = 'images/enemies.png';
        let image;

        if (curvature < 0) image = this.spriteLocation.carLeft;
        else if (curvature > 0) image = this.spriteLocation.carRight;
        else image = this.spriteLocation.carCentre;

        ctx.drawImage(
            spriteSheet,
            image.x,
            image.y,
            image.w,
            image.h,
            destX,
            destY,
            width,
            height
        );
    }

}