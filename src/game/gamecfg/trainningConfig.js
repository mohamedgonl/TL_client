
const TROOPS_LIST = [
    {
        troopCfgId: "ARM_1"
    },
    {
        troopCfgId: "ARM_2"
    },
    {
        troopCfgId: "ARM_3"
    },
    {
        troopCfgId: "ARM_4"
    }

];
const TROOP_SMALL_ICON_BASE_URL = "res/guis/train_troop_gui/small_icon/";
const TROOP_BIG_ICON_BASE_URL = "res/guis/train_troop_gui/icon/";

const LIST_TROOP_START_POS = {x:95, y: 225};
const LIST_TROOP_TRAINING_START_POS= {x: 360, y: 67};
const CURRENT_TROOP_TRAINING_POS = {x: 484.23, y: 66.70};
const FIRST_WAITING_TRAINING_TROOP_POS = {x: 360.00, y:67.00};
const TROOP_TRAINING_ITEM_WIDTH = 58;
const TROOP_TRAIN_WAITING_SPACE = 20;

const TROOP_ITEM_SPACING = 10;
const TROOP_ITEM_SIZE = 112;

const TRAINING_EVENTS = {
    TRAIN: "train",
    CANCLE: "cancle"
}