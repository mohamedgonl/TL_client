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
            up: [56, 69],
            right: [70,83],
            up_right:[84,97],
            down_right: [98,111]
        },
        idle: {
            frame_time: 0.2,
            down: [0, 5],
            down_left: [6, 11],
            left: [12, 17],
            up_left: [18, 23],
            up: [24, 29],
            down_right: [30,35],
            right: [36,41],
            up_right: [42,47]

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
            up: [64, 79],
            down_right: [80,95],
            right: [96,111],
            up_right: [112,127]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29],
            down_right:[30,35],
            right: [36,41],
            up_right: [42,47]
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
            up: [48, 59],
            down_right: [60,71],
            up_right: [72,83],
            right: [84, 95]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29],
            down_right: [30,35],
            right: [36,41],
            up_right: [42,47]
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
            up: [64, 79],
            down_right: [80,95],
            right: [96,111],
            up_right: [112,127]
        },
        idle: {
            frame_time: 0.2,
            down:[0,5],
            down_left:  [6,11],
            left: [12,17],
            up_left: [18,23],
            up: [24,29],
            down_right: [30,35],
            right: [36,41],
            up_right:[42,47]
        }
    },
}

const SPEED_TIME  = 19;

const AMC_SIZE = 4;

const EVENT_TROOP_NAME = {
    MOVE_BUILDING: 'move_building'
}

const ANIMAS = ["run", "idle", "attack01", "dead"];
const DIRECTIONS = ["down", "left", "down_left", "up_left", "up_right","down_right", "right", "up"];

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

const TROOP_ANIMS_LIST = ["ARM_1", "ARM_2", "ARM_3", "ARM_4"];

const TROOP_STAY_TIME = 10;