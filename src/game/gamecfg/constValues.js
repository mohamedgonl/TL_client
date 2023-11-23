const POPUP_IDS = {
    SHOP : "shop",
    TRAIN : "train",
    FIGHT : "fight",
    ATTACK_HISTORY: "atk_history"
}

const ACTION_TYPE = {
    START_BATTlE: 0,
    DROP_TROOP: 1,
    END_BATTLE: 2,
}

const BATTLE_STATUS = {
    PREPARING: 0,
    HAPPENNING: 1,
    END: 2,
}

const DEF_ATTACK_AREA = {
    GROUND: 1,
    OVERHEAD: 2,
    BOTH: 3,
}

const BULLET_GRID_SPEED= {
    'DEF_1': 40,
    'DEF_2': 50,
    'DEF_3': 13,
}
const BULLET_MINIMUM_TIME_REACH_DEST= {
    'DEF_1': 0,
    'DEF_2': 0.35,
    'DEF_3': 0,
}

const BATTlE_PREPARE_TIME = 30;
const BATTlE_LIMIT_TIME = 150;
const BATTLE_FPS = 60;
const TOTAL_DEFENCE_DIRECT = 8;



const MATCH_HISTORY_SCROLL_POS = {x: 353, y: 309};
const MATCH_DETAIL_TROOP_POS = {x: -238, y: 6}
const MATCH_HISTORY_ITEM_HEIGHT = 73/100*233.39;
const MATCH_HISTORY_ITEM_WIDTH = 800;
const MATCH_HISTORY_ITEM_MARGIN = 15;
const TROOP_ITEM_WIDTH = 58;
const TROOP_ITEM_MARGIN = 5;

