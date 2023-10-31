//map const
const OFFSET_BACKGROUND_X = 0;
const OFFSET_BACKGROUND_Y = 2;
const GRID_SCALE = 0.49;
const GRID_SIZE = 40;
const GRID_SIZE_BATTLE = 126;
const SCALE_BG = 1;

const ZOOM_DEFAULT = 1.5;
const ZOOM_MAX = 3;
const ZOOM_MIN = 1;
const ZOOM_STEP = 0.1;

const BORDER_LIMIT_BOTTOM = -650;
const BORDER_LIMIT_TOP = 650;
const BORDER_LIMIT_LEFT = -850;
const BORDER_LIMIT_RIGHT = 850;

const CORNER_BOTTOM = cc.p(0, -558);
const CORNER_TOP = cc.p(0, 558);
const CORNER_LEFT = cc.p(-745, 0);
const CORNER_RIGHT = cc.p(745, 0);

const CORNER_BOTTOM_BATTLE = cc.p(0, -586);
const CORNER_TOP_BATTLE = cc.p(0, 586);
const CORNER_LEFT_BATTLE = cc.p(-782, 0);
const CORNER_RIGHT_BATTLE = cc.p(782, 0);

const MAP_ZORDER_GRID = 0;
const MAP_ZORDER_BACKGROUND = 1000;
const MAP_ZORDER_BUILDING = 2000; // max to about 400
const MAP_ZORDER_BULLET = 2600; // max to about 400
const MAP_ZORDER_GUI = 3000;
const MAP_ZORDER_TROOP = 2500;

const POPUP_ZORDER = 10000000000;

//BUILDING
const SCALE_BUILDING_BODY = 0.5;
const ZORDER_BUILDING_BODY = 100;
const ZORDER_BUILDING_GRASS = 0;
const ZORDER_BUILDING_BOTTOM = 5
const ZORDER_BUILDING_SHADOW = 90;
const ZORDER_BUILDING_UPPER = 110;
const ZORDER_BUILDING_SQUARE = 10;
const ZORDER_BUILDING_EFFECT = 150;
const FONT_SIZE_NAME_LABEL = 16;
const FONT_SIZE_LEVEL_LABEL = 12;


//EVENT
const EVENT_PLAYER_INFO_CHANGED = "event_player_info_changed";
const EVENT_SELECT_BUILDING = "event_select_building";
const EVENT_UNSELECT_BUILDING = "event_unselect_building";
const EVENT_FINISH_BUILDING = "event_finish_building";


//ANIMATION

const COUNT_FRAME_MINE_EFFECT = 10;

//UI
const SCALE_BUTTON_BUY_BUILDING = 0.4;
const OFFSET_BUTTON_BUY_BUILDING = cc.p(30, 30);

//PRICE
const G_BUY_SECOND = 240;
const G_BUY_GOLD = 400;
const G_BUY_ELIXIR = 500;
const GOLD_FIND_MATCH = 250;