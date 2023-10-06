var MapLayer = cc.Layer.extend({

    chosenBuilding: null,
    onModeMovingBuilding: false,
    canDragBuilding: false,
    ctor: function () {

        this._super();

        this.tempPosChosenBuilding= {
            x: 0,
            y: 0
        }

        this.init();
    },

    //init map layer with scale, add event, load background, load building
    init: function () {

        this.setScale(ZOOM_DEFAULT);
        this.addEvent();
        this.initBackground();
        this.loadBuilding();
    },

    //load all building in map manager and add it to MapLayer
    loadBuilding: function () {
        var listBuilding = MapManager.Instance().getAllBuilding();
        for(var i = 0; i < listBuilding.length; i++)
        {
            var building = listBuilding[i];
            this.addBuildingToLayer(building);
        }
    },

    //add building to layer with gridPos of it
    addBuildingToLayer: function (building) {
        if(building == null) {
            cc.log("ERORR::::::::add building to layer null");
            return;
        }
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
        this.addChild(building,this.getZOrderBuilding(gridPosX,gridPosY));
    },

    //add event listener for map layer
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
                if(keyCode === cc.KEY.space)
                {
                    this.test();
                }

            }.bind(this)

        },this);
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

    getZOrderBuilding: function (gridPosX,gridPosY) {
        return MAP_ZORDER_BUILDING + (GRID_SIZE -gridPosX) + (GRID_SIZE -gridPosY);
    },

    onTouchBegan: function (touch) {
        this.positionTouchBegan = touch.getLocation();
        if(this.chosenBuilding == null ) return;

        let building = this.getBuildingFromTouch(touch.getLocation());
        if(building !== this.chosenBuilding
            ||this.chosenBuilding._type.startsWith("OBS"))
            return;
        this.enterModeMoveBuilding();
    },

    //if not in move building mode, move view, else move building
    onDrag: function (event) {

        //move view while drag while not move building

        if(!this.canDragBuilding) {
            this.moveView(event.getDelta());
            return;
        }

        //move building
        if(this.chosenBuilding == null) return;

        let newPos = this.getGridPosFromScreenPos(event.getLocation());

        if(newPos.x !== this.tempPosChosenBuilding.x || newPos.y !== this.tempPosChosenBuilding.y)
        {
            this.moveBuildingInLayer(this.chosenBuilding,newPos.x,newPos.y);

        }
    },
    onTouchEnded: function (event) {
        var locationInScreen = event.getLocation();
        var distance = cc.pDistance(locationInScreen,this.positionTouchBegan);
        this.canDragBuilding = false;
        if(distance < 10) this.onClicked(this.positionTouchBegan);

    },

    getBuildingFromTouch: function (locationInScreen) {
        let chosenGrid = this.getGridPosFromScreenPos(locationInScreen);

        if(this.onModeMovingBuilding)
        {
            let width = this.chosenBuilding._width;
            let height = this.chosenBuilding._height;

            cc.log("-----------------------------------")
            cc.log("chosen grid: " + chosenGrid.x + " " + chosenGrid.y)
            cc.log("width: " + width + " height: " + height)
            cc.log("current pos: " + this.tempPosChosenBuilding.x + " " + this.tempPosChosenBuilding.y)
            cc.log("-----------------------------------")
            //if click in building -> return building
            if(chosenGrid.x >= this.tempPosChosenBuilding.x && chosenGrid.x < this.tempPosChosenBuilding.x + width
                && chosenGrid.y >= this.tempPosChosenBuilding.y && chosenGrid.y < this.tempPosChosenBuilding.y + height)
            {
                cc.log("click temp building")
                return this.chosenBuilding;
            }

        }

        let mapGrid = MapManager.Instance().mapGrid;
        let buildingId = mapGrid[chosenGrid.x][chosenGrid.y];
        if(buildingId === 0) return null;
        return MapManager.Instance().getBuildingById(buildingId);
    },

    onClicked: function (locationInScreen) {



        let building = this.getBuildingFromTouch(locationInScreen);


        //if click nothing -> building = null
        if(building == null) {

            if(this.onModeMovingBuilding)
            {
                this.exitModeMoveBuilding();
            }
            this.unSelectBuilding();
            return;
        }

        //click building first time or click another building
        if(this.chosenBuilding == null || this.chosenBuilding !== building)
        {
            this.selectBuilding(building);
        }

    },

    selectBuilding: function (building) {

        //if have chosen building, unselect it
        this.unSelectBuilding(this.chosenBuilding);


        cc.log("select building " + building._id);
        building.onSelected();
        this.chosenBuilding = building;
        this.tempPosChosenBuilding = cc.p(this.chosenBuilding._posX,this.chosenBuilding._posY);
    },

    unSelectBuilding: function () {

        if(this.chosenBuilding) {
            cc.log("unselect building " + this.chosenBuilding._id);
            this.chosenBuilding.onUnselected();
        }
        this.chosenBuilding = null;
        // this.onModeMovingBuilding = false;

        this.tempPosChosenBuilding = null;
    },

    onReceivedCheckMoveBuilding: function (data) {
        //if valid move, move building in map manager
        if(data.error ===0 ) {
            MapManager.Instance().moveBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y)
        }
        else
        {
            //move back to old pos
            this.moveBuildingInLayer(this.chosenBuilding,this.chosenBuilding._posX,this.chosenBuilding._posY);
        }
    },


    enterModeMoveBuilding: function () {
        this.chosenBuilding.setLocalZOrder(999);
        this.canDragBuilding = true;
        this.onModeMovingBuilding = true;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        //if chosen building can put in new pos, set green square, else set red square
        if(MapManager.Instance().checkValidPutBuilding(this.chosenBuilding,this.chosenBuilding._posX, this.chosenBuilding._posY)){
            this.chosenBuilding.setSquare(1);
        }
        else{
            this.chosenBuilding.setSquare(2);
        }
        infoLayer.setVisible(false);
    },
    exitModeMoveBuilding: function () {
        this.canDragBuilding = false;
        this.onModeMovingBuilding = false;
        var infoLayer = cc.director.getRunningScene().infoLayer;

        var newPosX = this.tempPosChosenBuilding.x;
        var newPosY = this.tempPosChosenBuilding.y;
        var mapManager = MapManager.Instance();

        if(mapManager.checkValidPutBuilding(this.chosenBuilding, newPosX, newPosY))
        {
            //testnetwork.connector.sendMoveBuilding(this.chosenBuilding._id,newPosX,newPosY);
            this.onReceivedCheckMoveBuilding({error:0})
        }
        else
        {
            //move back to old pos
            this.moveBuildingInLayer(this.chosenBuilding,this.chosenBuilding._posX,this.chosenBuilding._posY);
        }
        this.chosenBuilding.setSquare(0);
        infoLayer.setVisible(true);
    },

    // move view of building, not change building pos in MapManager and Building
    moveBuildingInLayer: function (building, newPosX, newPosY) {
        if(building == null) return;

        this.tempPosChosenBuilding = {x: newPosX, y: newPosY};
        //change color of square
        if(MapManager.Instance().checkValidPutBuilding(building,newPosX,newPosY)){
            building.setSquare(1);
        }
        else{
            building.setSquare(2);
        }

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
        var distanceFromBottomRight = findDistanceFromPointToLine(posInMap, CORNER_RIGHT, CORNER_BOTTOM);

        var grid_width = findDistanceFromPointToLine(CORNER_BOTTOM, CORNER_TOP, CORNER_RIGHT);

        var gridX = Math.floor(distanceFromBottomLeft/grid_width * GRID_SIZE);
        var gridY = Math.floor(distanceFromBottomRight/grid_width * GRID_SIZE);

        if(gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE)
            return null;

        return cc.p(gridX, gridY);
    },

    //
    getGridPosFromScreenPos: function (posInScreen) {
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
        var  currentPos = this.getPosition();
        var newPos = cc.pAdd(currentPos, delta);
        this.setPosition(newPos);
        this.limitBorder();
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



    test: function (){

        //add building to layer
        // this.addTemporaryBuilding("TOW_1");
        this.print();
    },
    addTemporaryBuilding: function (buildingType) {
        var building = getBuildingFromType(buildingType,1)
        let validPosition = MapManager.Instance().getEmptyPositionPutBuilding(building);
        building.setGridPosition(validPosition.x,validPosition.y);
        this.addBuildingToLayer(building);
        this.selectBuilding(building)
    },
    print: function () {

    }


});
