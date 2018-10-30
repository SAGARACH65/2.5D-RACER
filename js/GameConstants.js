//////////////////////////////////////////////constants used in Game.js////////////////////////////////////////////////////
const trackMap = [
    { type: 'straight', number: 100, curvature: 0 },
    { type: 'curve', number: 300, curvature: -65 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: 65 },
    { type: 'curve', number: 300, curvature: -20 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: -65 },
    { type: 'straight', number: 300, curvature: 0 },
    { type: 'curve', number: 300, curvature: 65 },
    { type: 'straight', number: 500, curvature: 0 },
];

const FINISH_LINE_LENGTH = 140;

const TOTAL_LENGTH_OF_ROAD = (() => {
    let total = 0;
    for (let i = 0; i < trackMap.length - 1; i++)
        total += trackMap[i].number;

    return total + FINISH_LINE_LENGTH;
})();

//position of sprite in the spritesheet
const CAR_CENTRE = {
    x: 0,
    y: 130,
    w: 69,
    h: 38
};

const CAR_LEFT = {
    x: 70,
    y: 130,
    w: 77,
    h: 38
};

const CAR_RIGHT = {
    x: 148,
    y: 130,
    w: 77,
    h: 38
};

const DIFFERENCE_TO_INCREASE_NITRO = 7;

//game Sounds
const CAR_ACCELERATE = createSoundObject('sounds/accelerate.mp3');
const CAR_DECELERATE = createSoundObject('sounds/car+geardown.mp3');
const CAR_SKID = createSoundObject('sounds/skid.wav');
const CAR_START = createSoundObject('sounds/carstartgarage.mp3');


//////////////////////////////////////////////constants used in Road.js////////////////////////////////////////////////////
const ROAD_PARAM = {
    WIDTH: 9000,
    SEGMENT_LENGTH: 550,  // length of a single segment
    SIDE_STRIP_LENGTH: 3,  // number of segments per red/white sideStrip strip
    NO_OF_LANES: 4,
    CAMERA_HEIGHT: 4400,       // z height of camera
    CAMERA_DEPTH: 0.2,           // z distance camera is from the screen 
    NO_OF_SEG_TO_DRAW: 150,      //number of seg we draw at a time
    COLORS: [
        { road: '#696969', grass: '#097D04', sideStrip: 'red', lane: 'white' },
        { road: '#696969', grass: '#066102', sideStrip: 'white' },
    ],
    // CANVAS_WIDTH: 1920,
    // CANVAS_HEIGHT: 997
    CANVAS_WIDTH: window.innerWidth || document.body.clientWidth,
    CANVAS_HEIGHT: window.innerHeight || document.body.clientHeight
}

const TREE_SPARSITY_FACTOR = 5;

//this game was orginally designed in 1920/997 screen so for other screen resolutions,percentage is calculated
const WIDTH_MULTIPLIER = (ROAD_PARAM.CANVAS_WIDTH - 1920) / 1920;
const HEIGHT_MULTIPLIER = (ROAD_PARAM.CANVAS_HEIGHT - 997) / 997;

const TREES = [
    { img: 'images/tree.png', width: 64 * WIDTH_MULTIPLIER + 64, height: 154 * HEIGHT_MULTIPLIER + 154 },
    { img: 'images/tree2.png', width: 62 * WIDTH_MULTIPLIER + 62, height: 95 * HEIGHT_MULTIPLIER + 95 },
];

const GAME_IMAGES = [
    'images/tree.png',
    'images/tree2.png',
    'images/spedoMeterTrans.png',
    'images/steering_wheel-.png',
    'images/spritesheet.high.png',
    'images/b.png',
    'images/finish2.png',
    'images/enemies.png',
];

//////////////////////////////////////////////constants used in Player.js////////////////////////////////////////////////////
const OFF_ROAD_SPEED_DECREASE_FACTOR = 4;
const ACCELERATION_DECREASE_FACTOR = 150;
const BREAKING_DECREASE_FACTOR = 30;
const DECELERATION_DECREASE_FACTOR = 140;

const MAX_SPEED = 950;
const OFF_ROAD_MAX_SPEED = MAX_SPEED / OFF_ROAD_SPEED_DECREASE_FACTOR;
const ACCELERATION = MAX_SPEED / ACCELERATION_DECREASE_FACTOR;
const BREAKING = -MAX_SPEED / BREAKING_DECREASE_FACTOR;
const DECELERATION = -MAX_SPEED / DECELERATION_DECREASE_FACTOR;

const TURNING_SPEED = 0.05;
const CENTRIFUGAL_FORCE = 0.0007;
const PLAYER_WIDTH = 200;
const PLAYER_HEIGHT = 150;
const MAX_NITRO = 400;
//the multiple by which the speed is changed when nitro is pressed
const NITRO_MULTIPLIER_INCREMENT = 14;
const NITRO_INCREASE_FACTOR = 100;
const NITRO_DECREASE_FACTOR = 50;
const CURVE_POSITION_UPDATE_THRESHOLD = 50;
const PLAYER_Z_WIDTH = 700;
const PLAYER_WIDTH_MULTIPLIER = 4;
const ENEMY_WIDTH_MULTIPLIER = 13;
const ENEMY_Z_WIDTH = 1200;
const CAR_TO_BASE_SEGMENT_OFFSET = 4;
const ROAD_CENTRE_TO_LEFT_TREE_DISTANCE = -1.25;
const ROAD_CENTRE_TO_RIGHT_TREE_DISTANCE = 1.55;

//////////////////////////////////////////////constants used in Enemy.js////////////////////////////////////////////////////
const NO_OF_ENEMIES = 6;
const ENEMY_ACCELERATION_FACTOR = 80;
const ENEMY_COLLISION_SPEED_DECREASE_FACTOR = 1.4;
const ENEMY_IMAGES = [
    {
        carLeft: {
            x: 6, y: 23, w: 217, h: 101
        },
        carCentre: {
            x: 445, y: 23, w: 190, h: 98
        },
        carRight: {
            x: 858, y: 22, w: 217, h: 101
        }
    },
    {
        carLeft: {
            x: 6, y: 271, w: 217, h: 101
        },
        carCentre: {
            x: 445, y: 271, w: 190, h: 98
        },
        carRight: {
            x: 858, y: 271, w: 217, h: 101
        }
    },
    {
        carLeft: {
            x: 6, y: 519, w: 217, h: 101
        },
        carCentre: {
            x: 445, y: 519, w: 190, h: 98
        },
        carRight: {
            x: 858, y: 519, w: 217, h: 101
        }
    }
];

//////////////////////////////////////////////constants used in DashBoard.js////////////////////////////////////////////////////
const STEERING_ROTATION = 50;


//////////////////////////////////////////////constants used in Game.js////////////////////////////////////////////////////

const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_SPACE = 32;
const BACKGROUND_MOVEMENT_FACTOR = 14;

const PLAYER_NAME = [
    'MANISH',
    'KISHOR',
    'SHREEJIT',
    'ANIL',
    'AMAN',
    'SURAVI',
];