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
            frame_time: 0.05,
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


const AMC_SIZE = 5;

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

const TROOP_STAY_TIME = 8;


const TROOPS_INFO  = {
    "ARM_1" : {
        name: "Chiến binh",
        info: [
            {
                icon: res.ICON.DAMAGE,
                bar_percent: 0.2,
                title: "Sát thương: 8"
            },
            {
                icon: res.ICON.HEART,
                bar_percent: 0.3,
                title: "Máu: 45"
            },
            {
                icon: res.ICON.ELIXIR,
                bar_percent: 0.08,
                title: "Giá: 25"
            }
        ],
        data: ["Tất cả", "Một mục tiêu", "Dưới đất", "16", "2s", "1"],
        description: "Là những kẻ không hề biết sợ. Chiến binh cấp 1 sử dụng sức mạnh cơ bắp của mình cùng với thanh kiếm càn quét thành lũy quân thù mang vinh quang về cho vương quốc."
    },
    "ARM_2" : {
        name: "Cung thủ",
        info: [
            {
                icon: res.ICON.DAMAGE,
                bar_percent: 0.2,
                title: "Sát thương: 7"
            },
            {
                icon: res.ICON.HEART,
                bar_percent: 0.3,
                title: "Máu: 20"
            },
            {
                icon: res.ICON.ELIXIR,
                bar_percent: 0.08,
                title: "Giá: 50"
            }
        ],
        data: ["Tất cả", "Một mục tiêu", "Dưới đất & Trên không", "24", "2s", "1"],
        description: "Là những thiện xã của vương quốc. Cung thủ cấp 1 luôn biết cách giữ khoảng cách an toàn cho bản thân và hạ gục mọi thành lũy nơi quân đoàn mình đặt chân đến"
    },
    "ARM_3" : {
        name: "Đạo tặc",
        info: [
            {
                icon: res.ICON.DAMAGE,
                bar_percent: 0.2,
                title: "Sát thương: 11"
            },
            {
                icon: res.ICON.HEART,
                bar_percent: 0.3,
                title: "Máu: 25"
            },
            {
                icon: res.ICON.ELIXIR,
                bar_percent: 0.08,
                title: "Giá: 25"
            }
        ],
        data: ["Tài nguyên (Tấn công x2)", "Một mục tiêu", "Dưới đất", "32", "2s", "1"],
        description: "Nơi nào có Vàng/Dầu, nơi đó có Đạo tặc cấp 1. Chúng là những kẻ nhanh nhẹn nhất trên mặt đất, là mũi tiên phong trong những cuộc chinh phạt các thành trình giàu có."
    },
    "ARM_4" : {
        name: "Gã khổng lồ",
        info: [
            {
                icon: res.ICON.DAMAGE,
                bar_percent: 0.2,
                title: "Sát thương: 22"
            },
            {
                icon: res.ICON.HEART,
                bar_percent: 0.3,
                title: "Máu: 300"
            },
            {
                icon: res.ICON.ELIXIR,
                bar_percent: 0.08,
                title: "Giá: 500"
            }
        ],
        data: ["Công trình phòng thủ", "Một mục tiêu", "Dưới đất", "12", "7s", "5"],
        description: "To lớn và chậm chạp, nhưng những Gã khổng lồ cấp 1 chính là những đối thủ khó chịu nhất của công trình phòng thủ. Không hề quan tm đến vàng hay dầu, mục tiêu duy nhất của chúng là những khẩu pháo, các loại chòi đang xả đạn vào đồng đội của mình."
    }
}
const COLOR_REQUIRED_TROOP = cc.color(181, 26, 0);
const COLOR_TROOP_ATTACK_INFO = cc.color(12, 104, 209);
const COLOR_TROOP_DESCRIPTION = cc.color(147, 97, 44);
const LONG_PRESS_THRESHOLD = 0.2;
