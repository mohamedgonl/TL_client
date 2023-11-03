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

const BATTlE_PREPARE_TIME = 30;
const BATTlE_LIMIT_TIME = 150;

const MATCH_HISTORY_SCROLL_POS = {x: 353, y: 309};
const MATCH_DETAIL_TROOP_POS = {x: -239.00, y: 6}
const MATCH_HISTORY_ITEM_HEIGHT = 73/100*233.39;
const MATCH_HISTORY_ITEM_MARGIN = 15;