var MapLayer = cc.Layer.extend({

    chosenBuilding: null,
    onModeMovingBuilding: false,
    currentPos : null,
    ctor: function () {

        this._super();
        this.init();
    },

    init: function () {

        this.setScale(1);
        this.addEvent();
        this.initBackground();
        this.loadBuilding();
    },

    loadBuilding: function () {
        //cc.log("load building")
        var listBuilding = MapManager.Instance().getAllBuilding();
        for(var i = 0; i < listBuilding.length; i++)
        {
            var building = listBuilding[i];
            this.addBuildingToLayer(building);
        }
    },
    addBuildingToLayer: function (building)
    {
        if(building == null) return;

        var sizeX = building._width;
        var sizeY = building._height;
        var gridPosX = building._posX;
        var gridPosY = building._posY;

        var previousScaleOfScreen = this.getScale();
        this.setScale(1);

        var buildingCenterX = gridPosX + sizeX / 2;
        var buildingCenterY = gridPosY + sizeY / 2;

        building.setPosition(this.getScreenPosFromGridPos(cc.p(buildingCenterX, buildingCenterY)));

        this.setScale(previousScaleOfScreen);
        this.addChild(building,MAP_ZORDER_BUILDING);
    },

    //add touch, zoom,
    addEvent: function () {

        //add touch
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
                this.onTouchBegan(event);
                return true;
            }.bind(this),

            onTouchEnded: function (event) {
                this.onTouchEnded(event);
                return true;
            }.bind(this),

            onTouchMoved: function (event) {
                this.handMoved = true;
                //cc.log("move event :" + JSON.stringify(event,null,2));
                this.onDrag(event);
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

    onTouchBegan: function (touch) {

        var locationInScreen = touch.getLocation();

        this.positionTouchBegan = locationInScreen;

        var chosenGrid = this.getGridFromScreenPos(locationInScreen);

        var buildingId = MapManager.Instance().mapGrid[chosenGrid.x][chosenGrid.y];

        if(this.chosenBuilding == null ) return;

        if(buildingId == this.chosenBuilding._id)
        {
            // this.onModeMovingBuilding = true;
            this.enterModeMoveBuilding();
        }
        else
        {
            //ve sau update lai thanh khi nha invalid van moveView dc
            //this.onModeMovingBuilding = false;
            this.exitModeMoveBuilding();
        }
    },

    //if not in move building mode, move view, else move building
    onDrag: function (event) {

        //move view while drag while not move building
        if(!this.onModeMovingBuilding) {
            this.moveView(event.getDelta());
            return;
        }

        //move building
        if(this.chosenBuilding == null) return;

        var newPos = this.getGridFromScreenPos(event.getLocation());
        if(newPos.x != this.currentPos.x || newPos.y != this.currentPos.y)
        {
            this.moveBuildingInLayer(this.chosenBuilding,newPos.x,newPos.y);
            this.currentPos = newPos;
        }
    },
    onTouchEnded: function (event) {
        var locationInScreen = event.getLocation();
        var distance = cc.pDistance(locationInScreen,this.positionTouchBegan);

        if(distance < 10) this.onClicked(this.positionTouchBegan);

        if(this.onModeMovingBuilding)
        {
            var newPosX = this.currentPos.x;
            var newPosY = this.currentPos.y;
            var mapManager = MapManager.Instance();
            if(mapManager.checkValidMoveBuilding(this.chosenBuilding, newPosX, newPosY))
            {
                //testnetwork.connector.sendMoveBuilding(this.chosenBuilding._id,newPosX,newPosY);
                this.onReceivedCheckMoveBuilding({error:0})
            }
            else
            {
                //move back to old pos
                this.moveBuildingInLayer(this.chosenBuilding,this.chosenBuilding._posX,this.chosenBuilding._posY);
            }

        }

    },

    onClicked: function (locationInScreen) {

       // cc.log("click event :" + JSON.stringify(locationInScreen,null,2));

        var chosenGrid = this.getGridFromScreenPos(locationInScreen);

        var mapGrid = MapManager.Instance().mapGrid;

        //sau sua thanh getMapGrid de MapGrid khong bi null
        var buildingId = mapGrid[chosenGrid.x][chosenGrid.y];


        //if click nothing -> buildingId = 0
        if(buildingId == 0) {
            this.unSelectBuilding();
            return;
        }

        //click building first time or click another building
        if(this.chosenBuilding == null || this.chosenBuilding._id != buildingId)
        {
            var building = MapManager.Instance().getBuildingById(buildingId);

            this.selectBuilding(building);
        }

    },

    selectBuilding: function (building) {
        this.unSelectBuilding(this.chosenBuilding)

        building.onSelected();
        this.chosenBuilding = building;
        this.currentPos = cc.p(this.chosenBuilding._posX,this.chosenBuilding._posY);
    },

    unSelectBuilding: function () {

        if(this.chosenBuilding) {
            cc.log("unselect building " + this.chosenBuilding._id);
            this.chosenBuilding.onUnselected();
        }
        this.chosenBuilding = null;
        // this.onModeMovingBuilding = false;
        this.exitModeMoveBuilding();
        this.currentPos = null;
    },

    onReceivedCheckMoveBuilding: function (data) {
        cc.log("received in layer map::::::::::::::::::::::::::::::::"+JSON.stringify(data,null,2));
        //if valid move, move building in map manager
        if(data.error ==0) {
            MapManager.Instance().moveBuilding(this.chosenBuilding, this.currentPos.x, this.currentPos.y)
            this.unSelectBuilding();
        }
        else
        {
            //move back to old pos
            this.moveBuildingInLayer(this.chosenBuilding,this.chosenBuilding._posX,this.chosenBuilding._posY);
        }
    },


    enterModeMoveBuilding: function () {
        this.onModeMovingBuilding = true;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.setVisible(false);
    },
    exitModeMoveBuilding: function () {
        this.onModeMovingBuilding = false;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.setVisible(true);
    },


    //use config zoom max, min, zoom step to zoom by scroll



    // move view of building, not change building pos in MapManager and Building
    moveBuildingInLayer: function (building, newPosX, newPosY) {
        cc.log("name building " + building.getName());
        if(building == null) return;

        var sizeX = building._width;
        var sizeY = building._height;
        var previousScaleOfScreen = this.getScale();
        this.setScale(1);

        var buildingCenterX = newPosX + sizeX / 2;
        var buildingCenterY = newPosY + sizeY / 2;

        building.setPosition(this.getScreenPosFromGridPos(cc.p(buildingCenterX, buildingCenterY)));

        this.setScale(previousScaleOfScreen);
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

        var distanceFromBottomLeft = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_LEFT);
        var distanceFromBottomRight = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_RIGHT);

        var grid_width = findDistanceFromPointToLine(CORNER_BOTTOM, CORNER_RIGHT, CORNER_TOP);

        var gridX = Math.floor(distanceFromBottomLeft/grid_width * GRID_SIZE);
        var gridY = Math.floor(distanceFromBottomRight/grid_width * GRID_SIZE);

        return cc.p(gridX, gridY);
    },

    //
    getGridFromScreenPos: function (posInScreen) {
        var posInMap = this.getMapPosFromScreenPos(posInScreen);
        return this.getGridPosFromMapPos(posInMap);
    },


    getMapPosFromGridPos: function (gridPos) {

        var posA = cc.pLerp(CORNER_BOTTOM,CORNER_RIGHT,gridPos.x / GRID_SIZE);
        var posB = cc.pLerp(CORNER_BOTTOM,CORNER_LEFT,gridPos.y / GRID_SIZE);
        var posC = cc.pLerp(CORNER_LEFT,CORNER_TOP,gridPos.x / GRID_SIZE);
        var posD = cc.pLerp(CORNER_RIGHT,CORNER_TOP,gridPos.y / GRID_SIZE);

        return cc.pIntersectPoint(posA,posC,posB,posD);
    },

    getScreenPosFromGridPos: function (posInGrid) {
        var posInMap = this.getMapPosFromGridPos(posInGrid);
        return this.getScreenPosFromMapPos(posInMap);
    },

    moveView: function (delta) {
        var currentPos = this.getPosition();
        var newPos = cc.pAdd(currentPos, delta);
        this.setPosition(newPos);
        this.limitBorder();
    },

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
        MapManager.Instance().test();
    }


});
