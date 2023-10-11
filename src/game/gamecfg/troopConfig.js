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


}

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