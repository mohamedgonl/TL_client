
const TroopConfig = {
    BASE_URL : "res/Troops/",
    ARM_1 : {
        size : {
            width: 192,
            height: 192,
        },
        frame_time: 0.05,
        scale: 0.5,
        run: {
            down: [0,13],
            down_left: [14,27],
            left: [28,41],
            up_left: [42,55],
            up: [56,69]
        },
        idle : {
            down_right: [0,5],
            down_left: [6,11],
            left: [12,23],
            up: [24,29]
        }
    },


}

const EVENT_TROOP_NAME ={
    MOVE_BUILDING: 'move_building'
}