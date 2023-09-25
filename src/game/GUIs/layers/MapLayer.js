
var MapLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this.addTouch();
        this.initBackground();
        this.setScale(ZOOM_DEFAULT);
    },

    addTouch: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
                //cc.log("touch began");
                this.touch(event);
                return true;
            }.bind(this),

            onTouchEnded: function (event) {
                //cc.log("touch ended");
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

        var x = locationInMap.x;
        var y = locationInMap.y;
        //cc.log(x + " " + y);
        x = Math.floor(x);
        y = Math.floor(y);
        var check = this.getGridFromScreenPos(locationInWorld);
         cc.log("after" +check.x + " " + check.y);
        //cc.log(x + " " + y);
    },

    //chang screen pos to map pos, map pos not change when zoom or move
    getMapPosFromScreenPos: function (posInScreen) {

        var posInMap = cc.pSub(posInScreen, this.getPosition());

        var originX = cc.winSize.width / 2;
        var originY = cc.winSize.height / 2;
        var x = (posInMap.x - originX) / this.getScale();
        var y = (posInMap.y - originY) / this.getScale();

        return cc.p(x, y);
    },

    //use distance from
    // bottom left grid border and bottom right grid border
    // to get grid pos from map pos
    getGridPosFromMapPos: function (posInMap) {
        //calculate distance by distance formula from point to line

        var distanceFromBottomRight = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_RIGHT);
        var distanceFromBottomLeft = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_LEFT);
        cc.log("pos" +posInMap.x + " " + posInMap.y)
        cc.log("dis" +distanceFromBottomRight + " " + distanceFromBottomLeft)
        var gridX = Math.floor(distanceFromBottomRight / GRID_SIZE*40);
        var gridY = Math.floor(distanceFromBottomLeft / GRID_SIZE*40);

        return cc.p(gridX, gridY);
    },

    //
    getGridFromScreenPos: function (posInScreen) {
        var posInMap = this.getMapPosFromScreenPos(posInScreen);
        return this.getGridPosFromMapPos(posInMap);
    },



    //if moveView or Zoom out of map, move back
    limitBorder: function () {

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

        //load tmx file 42X42 map
        var centerX = cc.winSize.width/2 + OFFSET_BACKGROUND_X;
        var centerY = cc.winSize.height/2 + OFFSET_BACKGROUND_Y;

        var tmxMap = new cc.TMXTiledMap("res/guis/map/42x42map.tmx");
        this.addChild(tmxMap);
        tmxMap.setAnchorPoint(0.5, 0.5)
        tmxMap.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        tmxMap.setScale(SCALE_MAP)

        //load 4 corner of  background
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

        this.addChild(backgroundUpLeft);
        this.addChild(backgroundUpRight);
        this.addChild(backgroundDownLeft);
        this.addChild(backgroundDownRight);

        backgroundUpLeft.setScale(SCALE_BG);
        backgroundUpRight.setScale(SCALE_BG);
        backgroundDownLeft.setScale(SCALE_BG);
        backgroundDownRight.setScale(SCALE_BG);
    }


});


