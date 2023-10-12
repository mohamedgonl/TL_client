const TroopConfig = {
    BASE_URL: "res/Troops/",
    ARM_1: {
        size: {
            width: 192,
            height: 192,
        },
        scale: 0.5,
        run: {
            frame_time: 0.07,
            down: [0, 13],
            down_left: [14, 27],
            left: [28, 41],
            up_left: [42, 55],
            up: [56, 69]
        },
        idle: {
            frame_time: 0.2,
            down_right: [0, 5],
            down_left: [6, 11],
            left: [12, 17],
            up_left: [18, 23],
            up: [24, 29]
        }
    },
    ARM_2: {
        size: {
            width: 192,
            height: 192,
        },
        scale: 0.5,
        run: {
            frame_time: 0.07,
            down: [0, 15],
            down_left: [16, 31],
            left: [32, 47],
            up_left: [48, 63],
            up: [64, 79]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29]
        }
    },
    ARM_3: {
        size: {
            width: 192,
            height: 192,
        },
        scale: 0.5,
        run: {
            frame_time: 0.07,
            down: [0, 11],
            down_left: [12, 23],
            left: [24, 35],
            up_left: [36, 47],
            up: [48, 59]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29]
        }
    },
    ARM_4: {
        size: {
            width: 192,
            height: 192,
        },
        scale: 0.5,
        run: {
            frame_time: 0.07,
            down: [0, 15],
            down_left: [16, 31],
            left: [32, 47],
            up_left: [48, 63],
            up: [64, 79]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29]
        }
    },
}

const SPEED_TIME  = 19;

const AMC_SIZE = 5;

const EVENT_TROOP_NAME = {
    MOVE_BUILDING: 'move_building'
}

const ANIMAS = ["run", "idle", "attack01", "dead"];
const DIRECTIONS = ["down", "left", "down_left", "down_right", "up_left", "up_right", "right", "up"];

const DIRECTIONS_STRING = {
    DOWN: "down",
    LEFT: "left",
    DOWN_LEFT: "down_left",
    DOWN_RIGHT: "down_right",
    UP_LEFT: "up_left",
    UP_RIGHT: "up_right",
    RIGHT: "right",
    UP: "up"
}