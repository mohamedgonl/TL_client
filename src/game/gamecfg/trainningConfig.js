
const TROOPS_LIST = [
    {
        troopCfgId: "ARM_1",
        available: true
    },
    {
        troopCfgId: "ARM_2",
        available: true
    },
    {
        troopCfgId: "ARM_3",
        available: true
    },
    {
        troopCfgId: "ARM_4",
        available: true
    },
    {
        troopCfgId: "ARM_5",
        available: false,
    },
    {
        troopCfgId: "ARM_6",
        available: true,
    },
    {
        troopCfgId: "ARM_7",
        available: false,
    },
    {
        troopCfgId: "ARM_8",
        available: false,
    },
    {
        troopCfgId: "ARM_9",
        available: false,
    },
    {
        troopCfgId: "ARM_10",
        available: false,
    },
    {
        troopCfgId: "ARM_16",
        available: false,
    },
    {
        troopCfgId: "ARM_17",
        available: false,
    }

];
const TROOP_SMALL_ICON_BASE_URL = "res/guis/train_troop_gui/small_icon/";
const TROOP_BIG_ICON_BASE_URL = "res/guis/train_troop_gui/icon/";

const LIST_TROOP_START_POS = {x:85, y: 225};
const LIST_TROOP_MAX_WIDTH = 666;
const LIST_TROOP_TRAINING_START_POS= {x: 360, y: 67};
const CURRENT_TROOP_TRAINING_POS = {x: 484.23, y: 66.70};
const FIRST_WAITING_TRAINING_TROOP_POS = {x: 360.00, y:67.00};
const TROOP_TRAINING_ITEM_WIDTH = 58;
const TROOP_TRAIN_WAITING_SPACE = 20;

const TROOP_ITEM_SPACING = 1;
const TROOP_ITEM_SIZE = 112;

const TRAINING_EVENTS = {
    TRAIN: "train",
    CANCLE: "cancle",
    DONE_NOW: "done_now",
    UPDATE_SPACE: "update_space",
    CREATE_TRAIN_SUCCESS: "create_train_success",
    TRAIN_SUCCESS: "train_success",
    CREATE_TROOP_ON_MAP:  "create_on_map"
}