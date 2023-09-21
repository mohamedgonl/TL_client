//map const
var OFFSET_BACKGROUND_X = 0;
var OFFSET_BACKGROUND_Y = 2;
var SCALE_MAP = 0.39;
var SCALE_BG =0.8;

var ZOOM_DEFAULT = 1.5;
var ZOOM_MAX  = 3;
var ZOOM_MIN = 1;
var ZOOM_STEP = 0.1;

var BORDER_LIMIT_BOTTOM = -550;
var BORDER_LIMIT_TOP = 550;
var BORDER_LIMIT_LEFT = -700;
var BORDER_LIMIT_RIGHT = 700;

var CORNER_BOTTOM = cc.p(0,-445);
var CORNER_TOP = cc.p(0,445);
var CORNER_LEFT = cc.p(-590,0);
var CORNER_RIGHT = cc.p(590,0);

//cell size calculate by distance between CORNER_BOTTOM and CORNER_LEFT divide by 40
var GRID_SIZE = findDistanceFromPointToLine(CORNER_BOTTOM,CORNER_LEFT,CORNER_TOP);
cc.log("grid size" + GRID_SIZE)
