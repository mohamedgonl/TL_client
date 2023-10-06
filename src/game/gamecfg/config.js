//map const
const OFFSET_BACKGROUND_X = 0;
const OFFSET_BACKGROUND_Y = 2;
const GRID_SCALE = 0.49;
const GRID_SIZE = 40;
const SCALE_BG =1;

const ZOOM_DEFAULT = 1.5;
const ZOOM_MAX  = 3;
const ZOOM_MIN = 1;
const ZOOM_STEP = 0.1;

const BORDER_LIMIT_BOTTOM = -650;
const BORDER_LIMIT_TOP = 650;
const BORDER_LIMIT_LEFT = -850;
const BORDER_LIMIT_RIGHT = 850;

const CORNER_BOTTOM = cc.p(0,-558);
const CORNER_TOP = cc.p(0,558);
const CORNER_LEFT = cc.p(-745,0);
const CORNER_RIGHT = cc.p(745,0);

const MAP_ZORDER_GRID = 0;
const MAP_ZORDER_BACKGROUND = 1;
const MAP_ZORDER_BUILDING = 2; // max to about 400

const MAP_ZORDER_TROOP = 500;

const MAP_ZORDER_GUI = 1000;

//BUILDING
const SCALE_BUILDING_BODY = 0.5;
const ZORDER_BUILDING_BODY = 100;
const ZORDER_BUILDING_GRASS = 0;
const ZORDER_BUILDING_SHADOW = 90;
const ZORDER_BUILDING_UPPER = 110;
const ZORDER_BUILDING_SQUARE = 10;
const ZORDER_BUILDING_EFFECT = 150;


//EVENT
const EVENT_PLAYER_INFO_CHANGED = "event_player_info_changed";







//ANIMATION

const COUNT_FRAME_GOLD_MINE_EFFECT = 10;