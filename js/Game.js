class Game {

    constructor() {
        this.canvas = document.getElementById("main-canvas");
        this.canvas.setAttribute('width', ROAD_PARAM.CANVAS_WIDTH);
        this.canvas.setAttribute('height', ROAD_PARAM.CANVAS_HEIGHT);

        this.ctx = this.canvas.getContext("2d");
        this.backgroundImageStart = -(ROAD_PARAM.CANVAS_WIDTH) * 2;

        this.position = 0;   //   Z position of the camera 
        this.currentSegment = 3;
        this.isGameOver = false;

        //these 3 variables are used to show the initial countdown
        this.isInitialCountDownOngoing = true;
        this.initialCountDownValue = 3;
        this.isInTimeout = false;

        this.isRightPressed = false;
        this.isLeftPressed = false;
        this.isUpPressed = false;

        this.isDownPressed = false;
        this.isSpacePressed = false;

        this.road = new Road();

        //initialize the road object
        trackMap.map(sector => {
            this.addRoad(sector.number / 2, sector.curvature);
        });


        this.enemies = [];
        //creating enemies dynamically
        for (let x = 0; x < NO_OF_ENEMIES; x++)
            this.enemies.push(new Enemies((x + 1) / 2.5 * 500, x, (x + 1) / 2.5 * 10000, PLAYER_NAME[x] || ('PLAYER' + x)));

        this.player = new Player();
        this.dashBoard = new DashBoard();

        this.carSprite = CAR_CENTRE;

        this.drawPlayer = this.drawPlayer.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.keyDownHandler = this.keyDownHandler.bind(this);
        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.start = this.start.bind(this);

    }

    //gradually increases the curvature from 0 to the target
    enterSector(length, curvature) {
        for (let n = 0; n < length; n++)
            this.road.initializeSegments(getEnterCurvature(n, curvature, length));
    }

    //gradually decreases curvature from target to 0
    exitSector(length, curvature) {
        for (let n = 0; n < length; n++)
            this.road.initializeSegments(getExitCurvature(curvature, n, length));
    }

    addRoad(length, curvature) {
        //sector are a potions of road. may be straight or curved
        //each sector is constructed using segments

        //enter the segments
        this.enterSector(length, curvature);

        //exit the segments
        this.exitSector(length, curvature);
    }

    drawRoad() {
        this.road.drawRoad(this.ctx, this.position, this.player.playerX, this.enemies);
    }

    updateBackground(currentCurve) {
        this.backgroundImageStart -= currentCurve / BACKGROUND_MOVEMENT_FACTOR;
    }

    updatePlayerAsPerCurve() {
        //player is pushed out of the track to simulate the effect of a curve
        let currentCurveIndex = this.road.findSegmentIndex(this.position);
        let currentCurve = this.road.segments[currentCurveIndex].curvature;

        if (currentCurve !== 0) {
            this.player.updateXInCurve(currentCurve);
            this.updateBackground(currentCurve);
        }
    }

    updateNitro() {
        if ((this.road.findSegmentIndex(this.position) - this.currentSegment >= DIFFERENCE_TO_INCREASE_NITRO) && !this.isSpacePressed) {
            this.player.increaseNitro();

            this.currentSegment = this.road.findSegmentIndex(this.position);
        }
    }

    updatePlayerXPos() {
        //we only update the x position only if car has certain speed   
        if (this.player.speed > 0) {
            if (this.isLeftPressed) this.player.updateX(-1);
            if (this.isRightPressed) this.player.updateX(+1);
        }
    }

    checkIfGameEnded() {
        return (this.road.findSegmentIndex(this.position) > TOTAL_LENGTH_OF_ROAD);
    }

    showGameOver() {
        writeText(
            this.ctx,
            this.canvas.width / 2, 200 * HEIGHT_MULTIPLIER + 200,
            `Game Over! Your Position: ${this.player.rank}`,
            '700 50px  PerfectDark',
            'white'
        );
    }

    checkAndHandleGameEnd() {
        if (this.isGameOver) this.showGameOver();
        if (this.checkIfGameEnded() && !this.isGameOver) {
            this.removeEventListeners();

            this.isUpPressed = false;
            this.isSpacePressed = false;

            //this speed is added to counteract the condition when player enters exit zone with nitro and speed is very high to decelerate fast
            this.player.speed = (this.player.speed > MAX_SPEED) ? MAX_SPEED : this.player.speed / 1.5;

            this.isGameOver = true;
        }
    }

    updateEnemies() {
        if (!this.isInitialCountDownOngoing) {
            this.enemies.map(enemy => {
                enemy.updateZPos();
                enemy.updateSpeed();
                enemy.checkIfEnemyCrossedFinishLine();
            });
        }
    }

    calculatePlayerRank() {
        this.player.calculateCurrentPosition(this.position, this.enemies, this.isGameOver);

    }

    update() {
        this.updateNitro();

        this.player.updateSpeed({ isUpPressed: this.isUpPressed, isDownPressed: this.isDownPressed, isSpacePressed: this.isSpacePressed });

        //we create a illusion of curve by moving the car as per the curve
        this.updatePlayerAsPerCurve();

        this.updatePlayerXPos();

        this.updateEnemies();

        this.calculatePlayerRank();

        this.position += this.player.speed;

        this.checkAndHandleGameEnd();
    }

    drawBackground() {
        drawImage(this.ctx, 'images/b.png', this.backgroundImageStart, 0, ROAD_PARAM.CANVAS_WIDTH * 5, 549 * HEIGHT_MULTIPLIER + 549);
    }

    drawPlayer() {
        this.player.draw(
            this.ctx,
            'images/spritesheet.high.png',
            this.carSprite,
            this.canvas.width / 2 + 30 * WIDTH_MULTIPLIER + 30,
            600 * HEIGHT_MULTIPLIER + 600,
            this.isSpacePressed
        );
    }

    playSounds() {
        if (this.isUpPressed) CAR_ACCELERATE.play();

        if (this.isDownPressed) {
            CAR_ACCELERATE.pause();
            CAR_DECELERATE.play();
        }

        if ((this.isLeftPressed || this.isRightPressed)
            && this.road.segments[this.road.findSegmentIndex(this.position)].curvature != 0)
            CAR_SKID.play();
    }

    drawDashBoard() {
        this.dashBoard.drawSteering(this.ctx, this.isLeftPressed, this.isRightPressed);
        this.dashBoard.drawSpeedometer(this.ctx, this.player.speed, MAX_SPEED);
        this.dashBoard.drawProgressBar(this.ctx, this.road.findSegmentIndex(this.position), TOTAL_LENGTH_OF_ROAD);
        this.dashBoard.drawNitroMeter(this.ctx, MAX_NITRO, this.player.nitro);
    }

    drawRank() {
        this.dashBoard.drawRankInfo(this.ctx, this.player.rank, this.player.aheadEnemyName, this.player.behindEnemyName);
    }

    addEventListeners() {
        document.addEventListener('keydown', this.keyDownHandler, false);
        document.addEventListener('keyup', this.keyUpHandler, false);
    }

    removeEventListeners() {
        document.removeEventListener('keydown', this.keyDownHandler, false);
        document.removeEventListener('keyup', this.keyUpHandler, false);
    }

    showInitialCountDown() {
        if (this.isInitialCountDownOngoing)
            writeText(
                this.ctx,
                this.canvas.width / 2, 490 * HEIGHT_MULTIPLIER + 490,
                this.initialCountDownValue,
                '700 150px  PerfectDark',
                'white'
            );

        if (this.isInitialCountDownOngoing && !this.isInTimeout) {
            this.isInTimeout = true;
            setTimeout(() => {

                if (this.initialCountDownValue === 'GO!!') {
                    this.isInitialCountDownOngoing = false;
                    this.addEventListeners();
                    this.isUpPressed = isMobile();
                }

                if (this.initialCountDownValue === 1) this.initialCountDownValue = 'GO!!';
                if (this.initialCountDownValue !== 'GO!!') this.initialCountDownValue--;
                this.isInTimeout = false;
            }, 1000)
        }
    }

    draw() {
        this.drawBackground();
        this.drawRoad();
        this.drawPlayer();
        this.drawDashBoard();
        this.drawRank();
    }

    checkAndHandleEnemyCollision() {
        this.player.checkAndHandleEnemyCollision(this.position, this.enemies);
    }

    checkAndHandleTreeCollision() {
        this.player.checkAndHandleTreeCollision(this.road.segments, this.road.findSegmentIndex(this.position));
    }

    checkAndHandleCollision() {
        this.checkAndHandleEnemyCollision();
        this.checkAndHandleTreeCollision();
    }

    gameLoop() {
        //  CLEARING THE SCREEN BEFORE EACH UPDATE
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.playSounds();

        this.draw();
        this.update();
        this.checkAndHandleCollision()
        this.showInitialCountDown();

        // requestAnimationFrame(this.gameLoop);
    }

    keyDownHandler(e) {

        switch (e.keyCode) {
            case KEY_RIGHT:
                this.isRightPressed = true;
                this.carSprite = CAR_RIGHT;
                break;

            case KEY_LEFT:
                this.isLeftPressed = true;
                this.carSprite = CAR_LEFT;
                break;

            case KEY_UP:
                this.isUpPressed = true;
                break;

            case KEY_DOWN:
                this.isDownPressed = true;
                break;

            case KEY_SPACE:
                this.isSpacePressed = true;
                break;
        }
    }

    keyUpHandler(e) {

        switch (e.keyCode) {
            case KEY_RIGHT:
                this.isRightPressed = false;
                this.carSprite = CAR_CENTRE;
                break;

            case KEY_LEFT:
                this.isLeftPressed = false;
                this.carSprite = CAR_CENTRE;
                break;

            case KEY_UP:
                this.isUpPressed = false;
                break;

            case KEY_DOWN:
                this.isDownPressed = false;
                break;

            case KEY_SPACE:
                this.isSpacePressed = false;
                break;
        }
    }

    start() {
        //load all the images before the game starts
        let preLoader = new PreLoader();
        preLoader.load(() => {
            setInterval(this.gameLoop, 40);
            CAR_START.play();
        });
    }
}

document.getElementById('main-canvas').width = ROAD_PARAM.CANVAS_WIDTH;
document.getElementById('main-canvas').width = ROAD_PARAM.CANVAS_HEIGHT;

const game = new Game();
game.start();