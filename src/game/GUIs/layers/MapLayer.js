
var MapLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {

        this.setScale(ZOOM_DEFAULT);


        this.addTouch();
        this.initBackground();
        //this.test();


    },

    addTouch: function () {

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
                this.touch(event);
                return true;
            }.bind(this),

            onTouchEnded: function (event) {
                return true;
            },

            onTouchMoved: function (event) {
                this.moveView(event.getDelta());
                return true;
            }.bind(this)

        }, this);

        //scale by scroll
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseScroll: this.zoom.bind(this)
        }, this);

        //click space to check
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if(keyCode == cc.KEY.space)
                {
                    this.test();
                }
            }.bind(this)

        },this);
    },

    //use config zoom max, min, zoom step to zoom by scroll
    zoom: function (event) {

        var delta = event.getScrollY();
        var scale = this.getScale();

        //if scroll up, zoom in, else zoom out
        if (delta < 0) {
            scale += ZOOM_STEP;
            if (scale > ZOOM_MAX) {
                scale = ZOOM_MAX;
            }
        }
        else {
            scale -= ZOOM_STEP;
            if (scale < ZOOM_MIN) {
                scale = ZOOM_MIN;
            }
        }

        this.setScale(scale);
        this.limitBorder();
    },

    //move view while drag
    moveView: function (delta) {

        var currentPos = this.getPosition();
        var newPos = cc.pAdd(currentPos, delta);
        this.setPosition(newPos);
        this.limitBorder();
    },

    //
    touch: function (touch) {

        var locationInWorld = touch.getLocation();

        var locationInMap = this.getMapPosFromScreenPos(locationInWorld);

        var screenPos = this.getScreenPosFromMapPos(locationInMap);



        var x = locationInMap.x;
        var y = locationInMap.y;
        x = Math.floor(x);
        y = Math.floor(y);
         //cc.log("before " + x + " " + y);
        var check = this.getGridFromScreenPos(locationInWorld);
         //cc.log("after " +check.x + " " + check.y);

    },

    //chang screen pos to map pos, map pos not change when zoom or move
    getMapPosFromScreenPos: function (posInScreen) {

        var posInMap = cc.pSub(posInScreen, this.getPosition());

        var originX = cc.winSize.width / 2;
        var originY = cc.winSize.height / 2;
        var x = (posInMap.x - originX) / this.getScale();
        var y = (posInMap.y - originY) / this.getScale();

        //cc.log("map pos " + cc.p(x, y).x + " " + cc.p(x, y).y);
        return cc.p(x, y);
    },

    getScreenPosFromMapPos: function (posInMap) {

        var originX = cc.winSize.width / 2;
        var originY = cc.winSize.height / 2;

        var x = posInMap.x * this.getScale() + originX;
        var y = posInMap.y * this.getScale() + originY;

        return cc.p(x, y);
    },

    //use distance from
    // bottom left grid border and bottom right grid border
    // to get grid pos from map pos
    getGridPosFromMapPos: function (posInMap) {
        //calculate distance by distance formula from point to line

        var distanceFromBottomRight = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_RIGHT);
        var distanceFromBottomLeft = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_LEFT);

        var grid_width = findDistanceFromPointToLine(CORNER_BOTTOM, CORNER_RIGHT, CORNER_TOP);

        var gridX = Math.floor(distanceFromBottomRight/grid_width * GRID_SIZE);
        var gridY = Math.floor(distanceFromBottomLeft/grid_width * GRID_SIZE);

        return cc.p(gridX, gridY);
    },

    //
    getGridFromScreenPos: function (posInScreen) {
        var posInMap = this.getMapPosFromScreenPos(posInScreen);
        return this.getGridPosFromMapPos(posInMap);
    },

    //if moveView or Zoom out of map, move back
    limitBorder: function () {
        // return;
        var pos = this.getPosition();
        //bottom border of screen
        var currentBottomBorder = this.getMapPosFromScreenPos(cc.p(0,0)).y;
        if(currentBottomBorder < BORDER_LIMIT_BOTTOM)
            this.setPositionY(pos.y + (currentBottomBorder - BORDER_LIMIT_BOTTOM));

        //top border of screen
        var currentTopBorder = this.getMapPosFromScreenPos(cc.p(0,cc.winSize.height)).y;
        if(currentTopBorder > BORDER_LIMIT_TOP)
           this.setPositionY(pos.y + (currentTopBorder - BORDER_LIMIT_TOP));

        //left border of screen
        var currentLeftBorder = this.getMapPosFromScreenPos(cc.p(0,0)).x;
        if(currentLeftBorder < BORDER_LIMIT_LEFT)
            this.setPositionX(pos.x + (currentLeftBorder - BORDER_LIMIT_LEFT));

        //right border of screen
        var currentRightBorder = this.getMapPosFromScreenPos(cc.p(cc.winSize.width,0)).x;
        if(currentRightBorder> BORDER_LIMIT_RIGHT)
            this.setPositionX(pos.x + (currentRightBorder - BORDER_LIMIT_RIGHT));

    },

    initBackground: function () {

        //load tmx file 42X42 map grid
        var tmxMap = new cc.TMXTiledMap("res/guis/map/42x42map.tmx");

        tmxMap.setAnchorPoint(0.5, 0.5)
        tmxMap.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        tmxMap.setScale(GRID_SCALE)

        this.addChild(tmxMap,MAP_ZORDER_GRID);


        //load 4 corner of  background

        //center of backgrounds
        var centerX = cc.winSize.width/2 + OFFSET_BACKGROUND_X;
        var centerY = cc.winSize.height/2 + OFFSET_BACKGROUND_Y;

        var backgroundUpLeft = new cc.Sprite("res/guis/map/bg_up_left.png");
        var backgroundUpRight = new cc.Sprite("res/guis/map/bg_up_right.png");
        var backgroundDownLeft = new cc.Sprite("res/guis/map/bg_down_left.png");
        var backgroundDownRight = new cc.Sprite("res/guis/map/bg_down_right.png");

        backgroundUpLeft.setAnchorPoint(1,0);
        backgroundUpRight.setAnchorPoint(0,0);
        backgroundDownLeft.setAnchorPoint(1,1);
        backgroundDownRight.setAnchorPoint(0,1);

        backgroundUpLeft.setPosition(centerX + 1, centerY - 1);
        backgroundUpRight.setPosition(centerX - 1, centerY - 1);
        backgroundDownLeft.setPosition(centerX + 1, centerY + 1);
        backgroundDownRight.setPosition(centerX - 1, centerY + 1);

        backgroundUpLeft.setScale(SCALE_BG);
        backgroundUpRight.setScale(SCALE_BG);
        backgroundDownLeft.setScale(SCALE_BG);
        backgroundDownRight.setScale(SCALE_BG);


        this.addChild(backgroundUpLeft,MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundUpRight,MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundDownLeft,MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundDownRight,MAP_ZORDER_BACKGROUND);
    },

    test: function (){
        // cc.log(" grid" + this.getMapPosFromGridPos(cc.p(40,40)).x + " "
        //     + this.getMapPosFromGridPos(cc.p(40,40)).y);
        var builderHut = new BuilderHut();
        // cc.log(" grid" + this.getMapPosFromGridPos(cc.p(1,1)).x
        //     + " " + this.getMapPosFromGridPos(cc.p(1,1)).y);
        //
        // cc.log(" screen" + this.getScreenPosFromMapPos(this.getMapPosFromGridPos(cc.p(1,1))).x +
        //     " " + this.getScreenPosFromMapPos(this.getMapPosFromGridPos(cc.p(1,1))).y);
        this.setScale(1)
        builderHut.setPosition( this.getScreenPosFromMapPos(this.getMapPosFromGridPos(cc.p(1,1))));
        this.setScale(ZOOM_DEFAULT)

        this.addChild(builderHut,MAP_ZORDER_BUILDING);
    },


    setBuildingAtGridPos: function (building, gridPos , size) {
        var mapPos = this.getMapPosFromGridPos(gridPos);
        building.setPosition(mapPos);
        this.addChild(building,MAP_ZORDER_BUILDING);
    },


    getMapPosFromGridPos: function (gridPos) {

        var posA = cc.pLerp(CORNER_BOTTOM,CORNER_RIGHT,gridPos.x / GRID_SIZE);
        var posB = cc.pLerp(CORNER_BOTTOM,CORNER_LEFT,gridPos.y / GRID_SIZE);
        var posC = cc.pLerp(CORNER_LEFT,CORNER_TOP,gridPos.x / GRID_SIZE);
        var posD = cc.pLerp(CORNER_RIGHT,CORNER_TOP,gridPos.y / GRID_SIZE);


        // cc.log("posA:" + posA.x + " " + posA.y);
        // cc.log("posB:" + posB.x + " " + posB.y);
        // cc.log("posC:" + posC.x + " " + posC.y);
        // cc.log("posD:" + posD.x + " " + posD.y);

        return cc.pIntersectPoint(posA,posC,posB,posD);
    }


});

