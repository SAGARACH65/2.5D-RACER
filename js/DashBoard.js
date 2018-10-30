class DashBoard {
    constructor() {
    }

    drawSteering(ctx, isRightPressed, isLeftPressed) {
        let degrees;

        if (isLeftPressed) degrees = STEERING_ROTATION;
        else if (isRightPressed) degrees = -STEERING_ROTATION;
        else degrees = 0;

        ctx.save();
        ctx.translate(ROAD_PARAM.CANVAS_WIDTH - (300 * HEIGHT_MULTIPLIER + 300), ROAD_PARAM.CANVAS_HEIGHT - (200 * HEIGHT_MULTIPLIER + 200));
        // // rotate the canvas to the specified degrees
        ctx.rotate(degrees * Math.PI / 180);

        drawImage(
            ctx,
            'images/steering_wheel-.png',
            -(100 * HEIGHT_MULTIPLIER + 100),
            -(100 * HEIGHT_MULTIPLIER + 100),
            200 * HEIGHT_MULTIPLIER + 200,
            200 * HEIGHT_MULTIPLIER + 200
        );

        ctx.restore();
    }

    drawSpeed(ctx, currentSpeed, maxSpeed) {
        const speed = Math.ceil(currentSpeed / maxSpeed * 160);
        const fontSize = 45 * HEIGHT_MULTIPLIER + 45;

        writeText(
            ctx,
            ROAD_PARAM.CANVAS_WIDTH / 2 - (600 * WIDTH_MULTIPLIER + 600),
            ROAD_PARAM.CANVAS_HEIGHT - (257 * HEIGHT_MULTIPLIER + 257),
            speed,
            `700 ${fontSize}px  NeuroPol`,
            'white'
        );
    }

    //it draws the ahead and behind enemies and the rank of the player
    drawRankInfo(ctx, rank, aheadEnemyName, behindEnemyName) {
        const fontSize = 30 * HEIGHT_MULTIPLIER + 30;
        writeText(
            ctx,
            ROAD_PARAM.CANVAS_WIDTH / 2 + 50 * HEIGHT_MULTIPLIER + 50,
            950 * HEIGHT_MULTIPLIER + 950,
            rank,
            `700 ${fontSize}px  Neuropol`,
            'white'
        );

        writeText(
            ctx,
            ROAD_PARAM.CANVAS_WIDTH / 2 - (170 * HEIGHT_MULTIPLIER + 170),
            820 * HEIGHT_MULTIPLIER + 820,
            aheadEnemyName,
            `700 ${fontSize}px  Neuropol`,
            'white'
        );

        writeText(
            ctx,
            ROAD_PARAM.CANVAS_WIDTH / 2 + 260 * HEIGHT_MULTIPLIER + 260,
            940 * HEIGHT_MULTIPLIER + 940,
            behindEnemyName,
            `700 ${fontSize}px  Neuropol`,
            'white'
        );
    }

    drawSpeedNeedle(ctx, currentSpeed, maxSpeed) {
        const colorGradient = makeGradient(ctx, '#41dcf4', '#00b8fe');
        const shadowColor = '#00c6ff';

        drawSpeedoMeterArc(
            ctx,
            colorGradient,
            ROAD_PARAM.CANVAS_WIDTH / 2 - (600 * WIDTH_MULTIPLIER + 600),
            ROAD_PARAM.CANVAS_HEIGHT - (230 * HEIGHT_MULTIPLIER + 230),
            186 * HEIGHT_MULTIPLIER + 186,
            0.6 * Math.PI,
            calculateSpeedAngle(currentSpeed / maxSpeed, 83, 35) * Math.PI,
            false,
            shadowColor
        );
    }

    drawRPMNeedle(ctx, currentSpeed, maxSpeed) {
        const colorGradient = makeGradient(ctx, '#f7b733', '#fc4a1a');
        const shadowColor = '#f7b733';
        const rpm = currentSpeed / maxSpeed * 7;

        drawSpeedoMeterArc(
            ctx,
            colorGradient,
            ROAD_PARAM.CANVAS_WIDTH / 2 - (600 * WIDTH_MULTIPLIER + 600),
            ROAD_PARAM.CANVAS_HEIGHT - (230 * HEIGHT_MULTIPLIER + 230),
            186 * HEIGHT_MULTIPLIER + 186,
            0.4 * Math.PI,
            calculateRPMAngle(rpm, 0, 22) * Math.PI,
            true,
            shadowColor
        );
    }

    drawSpeedometer(ctx, currentSpeed, maxSpeed) {

        drawImage(
            ctx,
            'images/spedoMeterTrans.png',
            (ROAD_PARAM.CANVAS_WIDTH / 2 - (600 * WIDTH_MULTIPLIER + 600)) - (210 * HEIGHT_MULTIPLIER + 210),
            ROAD_PARAM.CANVAS_HEIGHT - (440 * HEIGHT_MULTIPLIER + 440),
            420 * HEIGHT_MULTIPLIER + 420,
            420 * HEIGHT_MULTIPLIER + 420
        );

        this.drawSpeed(ctx, currentSpeed, maxSpeed);
        this.drawSpeedNeedle(ctx, currentSpeed, maxSpeed);
        this.drawRPMNeedle(ctx, currentSpeed, maxSpeed);
    }

    drawProgressBar(ctx, baseSegment, totalSegments) {

        //drawing the background of the progressBar;
        drawRect(
            ctx,
            700 * WIDTH_MULTIPLIER + 700,
            ROAD_PARAM.CANVAS_HEIGHT - (150 * HEIGHT_MULTIPLIER + 150),
            600 * WIDTH_MULTIPLIER + 600,
            50 * HEIGHT_MULTIPLIER + 50,
            'rgba(0, 0, 0, 0.3)'
        );

        let progressGradient = makeGradient(ctx, '#43e97b', '#38f9d7');

        //this is added just to stop the progress bar from moving beyond the background
        let width = (baseSegment <= totalSegments) ? baseSegment / totalSegments * 600 : 600;

        //drawing the % completion 
        drawRect(
            ctx,
            700 * WIDTH_MULTIPLIER + 700,
            ROAD_PARAM.CANVAS_HEIGHT - (150 * HEIGHT_MULTIPLIER + 150),
            width * WIDTH_MULTIPLIER + width,
            50 * HEIGHT_MULTIPLIER + 50,
            progressGradient
        );

        //drawing the finish icon
        drawImage(
            ctx,
            'images/finish2.png',
            1300 * WIDTH_MULTIPLIER + 1300,
            ROAD_PARAM.CANVAS_HEIGHT - (150 * HEIGHT_MULTIPLIER + 150),
            50 * WIDTH_MULTIPLIER + 50,
            50 * HEIGHT_MULTIPLIER + 50
        );
    }

    drawNitroMeter(ctx, fullNitro, remainingNitro) {

        //background of the progress bar
        drawRect(
            ctx,
            ROAD_PARAM.CANVAS_WIDTH - (100 * WIDTH_MULTIPLIER + 100),
            750 * HEIGHT_MULTIPLIER + 750,
            50 * WIDTH_MULTIPLIER + 50,
            -(550 * HEIGHT_MULTIPLIER + 550),
            'rgba(0, 0, 0, 0.3)'
        );

        let percentageCompleted = remainingNitro / fullNitro;
        let speedGradient, rpmGradient;

        //if nitro reaches 60% changes color to yellow gradient
        (percentageCompleted < 0.6)
            ? (speedGradient = makeGradient(ctx, '#00b8fe', '#42dcf4'))
            : (rpmGradient = makeGradient(ctx, '#fc4a1a', '#f7b733'));

        //draws shadow if nitro is full
        (remainingNitro >= fullNitro)
            ? drawRect(
                ctx,
                ROAD_PARAM.CANVAS_WIDTH - (100 * WIDTH_MULTIPLIER + 100),
                750 * HEIGHT_MULTIPLIER + 750,
                50 * WIDTH_MULTIPLIER + 50,
                -(percentageCompleted * (550 * HEIGHT_MULTIPLIER + 550)),
                speedGradient || rpmGradient,
                '#f7b733'
            )
            : drawRect(
                ctx,
                ROAD_PARAM.CANVAS_WIDTH - (100 * WIDTH_MULTIPLIER + 100),
                750 * HEIGHT_MULTIPLIER + 750,
                50 * WIDTH_MULTIPLIER + 50,
                -(percentageCompleted * (550 * HEIGHT_MULTIPLIER + 550)),
                speedGradient || rpmGradient
            )
    }
}