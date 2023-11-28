const POPUP_IDS = {
    SHOP: "shop",
    TRAIN: "train",
    FIGHT: "fight",
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

const GAMEOBJECT_PREFIX = {
    TOWN_HALL: 'TOW',
    RESOURCE: 'RES',
    STORAGE: 'STO',
    WALL: 'WAL',
    DEFENCE: 'DEF',
    BUILDER_HUT: 'BDH',
    BARRACK: 'BAR',
    ARMY_CAMP: 'AMC',
    OBSTACLE: 'OBS',
}

const BUILDING_TYPE = {
    TOWN_HALL: 'TOW_1',
    GOLD_MINE: 'RES_1',
    ELIXIR_MINE: 'RES_2',
    GOLD_STORAGE: 'STO_1',
    ELIXIR_STORAGE: 'STO_2',
    WALL: 'WAL_1',
    CANNON: 'DEF_1',
    ARCHER_TOWER: 'DEF_2',
    MORTAR: 'DEF_3',
    AIR_DEFENSE: 'DEF_5',
    BUILDER_HUT: 'BDH_1',
    BARRACK: 'BAR_1',
    ARMY_CAMP: 'AMC_1',
}

const TROOP_TYPE = {
    WARRIOR: 'ARM_1',
    ARCHER: 'ARM_2',
    THIEF: 'ARM_3',
    GIANT: 'ARM_4',
    BOMBER: 'ARM_6',
}

const TROOP_BULLET_GRID_SPEED = {
    ARCHER : 20
}

const BULLET_GRID_SPEED = {
    'DEF_1': 40,
    'DEF_2': 50,
    'DEF_3': 13,
    'DEF_5': 40,
}

const BULLET_MINIMUM_TIME_REACH_DEST = {
    'DEF_1': 0,
    'DEF_2': 0.35,
    'DEF_3': 0,
    'DEF_5': 0,
}

const BATTlE_PREPARE_TIME = 30;
const BATTlE_LIMIT_TIME = 150;
const TICK_PER_SECOND = 30;
const TOTAL_DEFENCE_DIRECT = 8;


const MATCH_HISTORY_SCROLL_POS = {x: 353, y: 309};
const MATCH_DETAIL_TROOP_POS = {x: -238, y: 6}
const MATCH_HISTORY_ITEM_HEIGHT = 73 / 100 * 233.39;
const MATCH_HISTORY_ITEM_WIDTH = 800;
const MATCH_HISTORY_ITEM_MARGIN = 15;
const TROOP_ITEM_WIDTH = 58;
const TROOP_ITEM_MARGIN = 5;

const BATTLE_GRAPH = {
    WALL_WEIGHT : 9,
    EMPTY_POSITION_WEIGHT : 0,
    BUILDING_WEIGHT : 9999,
    OBSTACLE_WEIGHT : 9999,
}
const BATTLE_CONST = {
    MAX_FIND_TROOP_PER_LOOP: 10,
}

