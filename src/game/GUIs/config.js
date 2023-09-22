//map const
var OFFSET_BACKGROUND_X = 0;
var OFFSET_BACKGROUND_Y = 2;
var GRID_SCALE = 0.49;
var SCALE_BG =1;

var ZOOM_DEFAULT = 1.5;
var ZOOM_MAX  = 3;
var ZOOM_MIN = 1;
var ZOOM_STEP = 0.1;

var BORDER_LIMIT_BOTTOM = -650;
var BORDER_LIMIT_TOP = 650;
var BORDER_LIMIT_LEFT = -850;
var BORDER_LIMIT_RIGHT = 850;

var CORNER_BOTTOM = cc.p(0,-558);
var CORNER_TOP = cc.p(0,558);
var CORNER_LEFT = cc.p(-745,0);
var CORNER_RIGHT = cc.p(745,0);

var MAP_ZORDER_GRID = 0;
var MAP_ZORDER_BACKGROUND = 1;
var MAP_ZORDER_BUILDING = 2;
var MAP_ZORDER_TROOP = 2;
var MAP_ZORDER_GUI = 3;


//cell size calculate by distance between CORNER_BOTTOM and CORNER_LEFT divide by 40
var GRID_SIZE = findDistanceFromPointToLine(CORNER_BOTTOM,CORNER_LEFT,CORNER_TOP);
cc.log("grid size" + GRID_SIZE)


