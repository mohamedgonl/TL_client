var MapLayer = cc.Layer.extend({

    chosenBuilding: null,
    onModeMovingBuilding: false,
    canDragBuilding: false,
    onModeBuyBuilding: false,

    ctor: function () {

        this._super();
        //cc.log("+++++++++++++++++++++",JSON.stringify(this.getPosition(),null,2));
        this.setAnchorPoint(0,0);
        //create label hello world at 0,0
        this.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.tempPosChosenBuilding = {
            x: 0,
            y: 0
        }
        this.init();
    },
    //init map layer with scale, add event, load background, load building
    init: function () {
        this.setScale(1);
        this.addEventListener();
        this.initBackground();
        this.loadBuilding();
    },
    onEnter: function () {
        this._super();
        ArmyManager.Instance().initTroopSprites();
    },
    //load all building in map manager and add it to MapLayer
    loadBuilding: function () {
        var listBuilding = MapManager.Instance().getAllBuilding();
        for (var i = 0; i < listBuilding.length; i++) {
            var building = listBuilding[i];
            this.addBuildingToLayer(building);
        }
    },

    //add building to layer with gridPos of it
    addBuildingToLayer: function (building,zOrder) {
        if (building == null) {
            cc.log("ERORR::::::::add building to layer null");
            return;
        }

        let sizeX = building._width;
        let sizeY = building._height;
        let gridPosX = building._posX;
        let gridPosY = building._posY;

        let buildingCenterX = gridPosX + sizeX / 2;
        let buildingCenterY = gridPosY + sizeY / 2;
        let zOrderValue = zOrder == null ? this.getZOrderBuilding(gridPosX, gridPosY) : zOrder;

        //nếu buildingCenterX không phải là số nguyên, add vào giữa của ô trung tâm
        if(buildingCenterX % 1 !== 0 || buildingCenterY % 1 !== 0)
        {
            buildingCenterX = Math.floor(buildingCenterX);
            buildingCenterY = Math.floor(buildingCenterY);
            this.addGameObjectToMapLayer(building,buildingCenterX,buildingCenterY,zOrderValue,true);
        }
        //add vào góc trái dưới của ô trung tâm
        else
        {
            this.addGameObjectToMapLayer(building,buildingCenterX,buildingCenterY,zOrderValue)
        }

    },

    //add event listener for map
    addEventListener: function () {

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

                if (keyCode === cc.KEY.x) {
                    // this.setScale(3)
                    // this.x += 2*(this.x - cc.winSize.width / 2);
                    // this.y += 2*(this.y - cc.winSize.height / 2);

                }
                if (keyCode === cc.KEY.c) {

                }
                if (keyCode === cc.KEY.z) {
                }

            }.bind(this)

        }, this);

    },

    removeBuilding: function (building) {
        //remove child from layer
        if(building === this.chosenBuilding)
        {
            this.unSelectBuilding();
        }
        building.removeFromParent(true);
    },

    exitModeBuyBuilding: function () {
        if(this.chosenBuilding)
            this.chosenBuilding.removeFromParent(true);
        this.chosenBuilding = null;
        this.onModeBuyBuilding = false;
        this.tempPosChosenBuilding = null;
        //bat lai info
        var infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.setVisible(true);
    },

    //check client, if valid, send to server to recheck
    acceptBuyBuilding: function () {
        //check valid put building   OK
        if (!MapManager.Instance().checkValidPutBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y)) {
            cc.log("invalid put building");
            return;
        }

        //check have builder
        if (PlayerInfoManager.Instance().builder.current <= 0) {
            cc.log("not enough builder");
            return;
        }

        //price gold, if null -> 0
        let priceGold = LoadManager.Instance().getConfig(this.chosenBuilding._type, 1, "gold") || 0;
        let priceElixir = LoadManager.Instance().getConfig(this.chosenBuilding._type, 1, "elixir") || 0;
        if (PlayerInfoManager.Instance().checkEnoughResource(priceGold, priceElixir) === false)
        {
            cc.log("not enough resource");
            return;
        }

        //gui cho server
        cc.log("send buy building request",this.chosenBuilding._type,this.tempPosChosenBuilding.x,this.tempPosChosenBuilding.y)
        testnetwork.connector.sendBuyBuilding(this.chosenBuilding._type, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y);


    },

    //+ api buyBuilding: 2001
    //   input: type(str, posX(short), posY(short)
    //   output: error, id, type(str), posX, posY, status(short), startTime, endTime

    initBackground: function () {

        //load tmx file 42X42 map grid
        var tmxMap = new cc.TMXTiledMap("res/guis/map/42x42map.tmx");

        tmxMap.setAnchorPoint(0.5, 0.5)
        tmxMap.setPosition(0,0);
        tmxMap.setScale(GRID_SCALE)

        this.addChild(tmxMap, MAP_ZORDER_GRID);


        //load 4 corner of  background

        //center of backgrounds
        var centerX = 0 + OFFSET_BACKGROUND_X;
        var centerY = 0 + OFFSET_BACKGROUND_Y;

        var backgroundUpLeft = new cc.Sprite("res/guis/map/bg_up_left.png");
        var backgroundUpRight = new cc.Sprite("res/guis/map/bg_up_right.png");
        var backgroundDownLeft = new cc.Sprite("res/guis/map/bg_down_left.png");
        var backgroundDownRight = new cc.Sprite("res/guis/map/bg_down_right.png");

        backgroundUpLeft.setAnchorPoint(1, 0);
        backgroundUpRight.setAnchorPoint(0, 0);
        backgroundDownLeft.setAnchorPoint(1, 1);
        backgroundDownRight.setAnchorPoint(0, 1);

        backgroundUpLeft.setPosition(centerX + 1, centerY - 1);
        backgroundUpRight.setPosition(centerX - 1, centerY - 1);
        backgroundDownLeft.setPosition(centerX + 1, centerY + 1);
        backgroundDownRight.setPosition(centerX - 1, centerY + 1);

        backgroundUpLeft.setScale(SCALE_BG);
        backgroundUpRight.setScale(SCALE_BG);
        backgroundDownLeft.setScale(SCALE_BG);
        backgroundDownRight.setScale(SCALE_BG);


        this.addChild(backgroundUpLeft, MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundUpRight, MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundDownLeft, MAP_ZORDER_BACKGROUND);
        this.addChild(backgroundDownRight, MAP_ZORDER_BACKGROUND);
    },

    getZOrderBuilding: function (gridPosX, gridPosY) {
        // gridPos cang thap thi zỎder cang cao, cao nhat la MAP_ZORDER_BUILDING
        return MAP_ZORDER_BUILDING - gridPosX - gridPosY;
    },

    onTouchBegan: function (touch) {
        cc.log("location:",JSON.stringify(this.getPosition(),null,2));
        cc.log("mapPos:",JSON.stringify(this.getMapPosFromScreenPos(touch.getLocation()),null,2));
        this.positionTouchBegan = touch.getLocation();
        if (this.chosenBuilding == null) return;

        let building = this.getBuildingFromTouch(touch.getLocation());
        if (building !== this.chosenBuilding || this.chosenBuilding._type.startsWith("OBS")) return;
        this.enterModeMoveBuilding();
    },

    //if not in move building mode, move view, else move building
    onDrag: function (event) {

        //move view while drag while not move building

        if (!this.canDragBuilding) {
            this.moveView(event.getDelta());
            return;
        }

        //move building
        if (this.chosenBuilding == null) return;

        let newPos = this.getGridPosFromScreenPos(event.getLocation());

        if(newPos == null) return;

        if (newPos.x !== this.tempPosChosenBuilding.x || newPos.y !== this.tempPosChosenBuilding.y) {
            this.moveBuildingInLayer(this.chosenBuilding, newPos.x, newPos.y);

        }
    },

    onTouchEnded: function (event) {
        var locationInScreen = event.getLocation();
        var distance = cc.pDistance(locationInScreen, this.positionTouchBegan);
        this.canDragBuilding = false;
        if (distance < 10) this.onClicked(this.positionTouchBegan);

        if(this.onModeBuyBuilding) return;

        //if onModeMoveBuilding and current pos of chosenBuilding is valid, send to server to recheck
        if (this.onModeMovingBuilding) {

            if(MapManager.Instance().checkValidPutBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y))
                this.exitModeMoveBuilding();
        }
    },
    onClicked: function (locationInScreen) {

        if (this.onModeBuyBuilding) return;
        let building = this.getBuildingFromTouch(locationInScreen);
        //click building first time or click another building

        //if click nothing -> building = null
        if (building == null) {

            if (this.onModeMovingBuilding) {
                this.exitModeMoveBuilding();
            }
            else this.unSelectBuilding();
            return;
        }
        if (this.chosenBuilding == null) {
            this.selectBuilding(building);
            return;
        }

        if(this.chosenBuilding !== building)
        {
            this.unSelectBuilding();
            this.selectBuilding(building);
        }
    },

    selectBuilding: function (building) {
        if (this.onModeBuyBuilding)
        {
            this.chosenBuilding = building;
            return;
        }
        //if have chosen building, unselect it
        this.unSelectBuilding(this.chosenBuilding);
        this.tempPosChosenBuilding = cc.p(building._posX, building._posY);
        // building.setLocalZOrder(MAP_ZORDER_BUILDING+1);

        this.chosenBuilding = building;
        this.tempPosChosenBuilding = cc.p(this.chosenBuilding._posX, this.chosenBuilding._posY);
        building.onSelected();
    },

    unSelectBuilding: function () {

        if (this.chosenBuilding) {
            if(this.onModeMovingBuilding)
            {
                this.exitModeMoveBuilding();
            }
            this.chosenBuilding.setLocalZOrder(this.getZOrderBuilding(this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y));
            this.chosenBuilding.onUnselected();
        }
        this.chosenBuilding = null;
        // this.onModeMovingBuilding = false;

        this.tempPosChosenBuilding = null;
    },

    onReceivedCheckMoveBuilding: function (data) {
        //if valid move, move building in map manager
        if (data.error === 0) {
            MapManager.Instance().moveBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y)
        } else {
            //move back to old pos
            this.moveBuildingInLayer(this.chosenBuilding, this.chosenBuilding._posX, this.chosenBuilding._posY);
        }
    },

    enterModeMoveBuilding: function () {
        this.chosenBuilding.setLocalZOrder(MAP_ZORDER_BUILDING+1);
        this.canDragBuilding = true;
        this.onModeMovingBuilding = true;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        //if chosen building can put in new pos, set green square, else set red square
        if (MapManager.Instance().checkValidPutBuilding(this.chosenBuilding, this.chosenBuilding._posX, this.chosenBuilding._posY)) {
            this.chosenBuilding.setSquare(1);
        } else {
            this.chosenBuilding.setSquare(2);
        }
        infoLayer.setVisible(false);
    },

    //exit mode move building, send to server to recheck if valid, else move back to old pos
    exitModeMoveBuilding: function () {

        this.chosenBuilding.setLocalZOrder(this.getZOrderBuilding(this.chosenBuilding._posX, this.chosenBuilding._posY));
        this.canDragBuilding = false;
        this.onModeMovingBuilding = false;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        var newPosX = this.tempPosChosenBuilding.x;
        var newPosY = this.tempPosChosenBuilding.y;
        var mapManager = MapManager.Instance();

        if (mapManager.checkValidPutBuilding(this.chosenBuilding, newPosX, newPosY)) {
            testnetwork.connector.sendMoveBuilding(this.chosenBuilding._id,newPosX,newPosY);
        } else {
            //move back to old pos
            this.moveBuildingInLayer(this.chosenBuilding, this.chosenBuilding._posX, this.chosenBuilding._posY);
        }
        this.chosenBuilding.setSquare(0);

        infoLayer.setVisible(true);
    },

    // move view of building, not change building pos in MapManager and Building
    moveBuildingInLayer: function (building, newPosX, newPosY) {
        if (building == null) return;

        this.tempPosChosenBuilding = {x: newPosX, y: newPosY};
        //change color of square
        if (MapManager.Instance().checkValidPutBuilding(building, newPosX, newPosY)) {
            building.setSquare(1);
        } else {
            building.setSquare(2);
        }

        var sizeX = building._width;
        var sizeY = building._height;

        var buildingCenterX = newPosX + sizeX / 2;
        var buildingCenterY = newPosY + sizeY / 2;

        // let middleScreen = cc.p(cc.winSize.width/2,cc.winSize.height/2);
        // let newPosInMap = cc.pAdd(this.getMapPosFromGridPos(cc.p(buildingCenterX,buildingCenterY)),middleScreen);

        let newPosInMap = this.getMapPosFromGridPos(cc.p(buildingCenterX,buildingCenterY));
        building.setPosition(newPosInMap);

    },

    getBuildingFromTouch: function (locationInScreen) {
        //cc.log("+++++++++++++++++++getBuildingFromTouch",JSON.stringify(locationInScreen,null,2));
        let chosenGrid = this.getGridPosFromScreenPos(locationInScreen);
        if (chosenGrid == null) return null;
        if (this.chosenBuilding != null) {
            let width = this.chosenBuilding._width;
            let height = this.chosenBuilding._height;

            //if click in building -> return building
            if (chosenGrid.x >= this.tempPosChosenBuilding.x && chosenGrid.x < this.tempPosChosenBuilding.x + width
                && chosenGrid.y >= this.tempPosChosenBuilding.y && chosenGrid.y < this.tempPosChosenBuilding.y + height) {
                return this.chosenBuilding;
            }
        }

        let mapGrid = MapManager.Instance().mapGrid;
        let buildingId = mapGrid[chosenGrid.x][chosenGrid.y];
        if (buildingId === 0) return null;
        if (this.chosenBuilding && buildingId === this.chosenBuilding._id) return null;
        return MapManager.Instance().getBuildingById(buildingId);
    },

    getMapPosFromScreenPos: function (posInScreen) {

        var posInMap = cc.pSub(posInScreen, this.getPosition()) ;
        let x = posInMap.x / this.getScale();
        let y = posInMap.y / this.getScale();
        //cc.log("+++++++++++++++++++getMapPosFromScreenPos",JSON.stringify(posInMap,null,2));
        return cc.p(x, y);
    },

    //use distance from
    // bottom left grid border and bottom right grid border
    // to get grid pos from map pos
    getGridPosFromMapPos: function (posInMap) {
        // posInMap = cc.pSub(posInMap,cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        //calculate distance by distance formula from point to line
        var distanceFromBottomLeft = findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_LEFT);
        var distanceFromBottomRight = findDistanceFromPointToLine(posInMap, CORNER_RIGHT, CORNER_BOTTOM);

        var grid_width = findDistanceFromPointToLine(CORNER_BOTTOM, CORNER_TOP, CORNER_RIGHT);

        var gridX = Math.floor(distanceFromBottomLeft / grid_width * GRID_SIZE);
        var gridY = Math.floor(distanceFromBottomRight / grid_width * GRID_SIZE);


        if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE)
            return null;

        return cc.p(gridX, gridY);
    },
    getGridPosFromScreenPos: function (posInScreen) {
        var posInMap = this.getMapPosFromScreenPos(posInScreen);
        return this.getGridPosFromMapPos(posInMap);
    },

    getMapPosFromGridPos: function (gridPos,isCenter=false) {

        if(isCenter===true)
        {
            gridPos = cc.p(gridPos.x + 0.5, gridPos.y + 0.5);
        }
        var posA = cc.pLerp(CORNER_BOTTOM, CORNER_RIGHT, gridPos.x / GRID_SIZE);
        var posB = cc.pLerp(CORNER_BOTTOM, CORNER_LEFT, gridPos.y / GRID_SIZE);
        var posC = cc.pLerp(CORNER_LEFT, CORNER_TOP, gridPos.x / GRID_SIZE);
        var posD = cc.pLerp(CORNER_RIGHT, CORNER_TOP, gridPos.y / GRID_SIZE);
        return cc.pIntersectPoint(posA, posC, posB, posD);
    },
    getScreenPosFromMapPos: function (posInMap) {
        var posInMap = cc.pSub(posInMap,cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        return cc.pMult(posInMap, this.getScale());
    },

    //use it to add, calculate position to add child in map layer
    //------------------------------------------------------------------------------------------------------------------

    addGameObjectToMapLayer: function (gameObject,gridPosX,gridPosY,zOrder,isCenter=false) {
        let posToAdd = this.getMapPosFromGridPos({x:gridPosX,y:gridPosY},isCenter);
        this.addChild(gameObject,zOrder);
        gameObject.setPosition(posToAdd);
    },
    //------------------------------------------------------------------------------------------------------------------
    moveView: function (delta) {
        var currentPos = this.getPosition();
        var newPos = cc.pAdd(currentPos, delta);
        this.setPosition(newPos);
        this.limitBorder();
    },

    //use config zoom max, min, zoom step to zoom by scroll
    zoom: function (event) {
        let location = event.getLocation();
        let mapPos = this.getMapPosFromScreenPos(location);

        var delta = event.getScrollY();
        var scale = this.getScale();
        let oldScale = this.getScale();
        // Tính toán tâm zoom dựa trên vị trí chuột
        var zoomCenter = cc.p(0,0);

        // Nếu cuộn chuột lên, zoom vào; ngược lại, zoom ra
        if (delta < 0) {
            scale += ZOOM_STEP;
            if (scale > ZOOM_MAX) {
                scale = ZOOM_MAX;
            }

        } else {
            scale -= ZOOM_STEP;
            if (scale < ZOOM_MIN) {
                scale = ZOOM_MIN;
            }
        }
        let ratio = scale/oldScale;
        this.x -= mapPos.x*(ratio-1);
        this.y -= mapPos.y*(ratio-1);

        this.setScale(scale);

        this.limitBorder();
    },

    //if moveView or Zoom out of map, move back
    limitBorder: function () {

        var pos = this.getPosition();
        //bottom border of screen
        var currentBottomBorder = this.getMapPosFromScreenPos(cc.p(0, 0)).y;
        if (currentBottomBorder < BORDER_LIMIT_BOTTOM)
            this.setPositionY(pos.y + (currentBottomBorder - BORDER_LIMIT_BOTTOM));
        //top border of screen
        var currentTopBorder = this.getMapPosFromScreenPos(cc.p(0, cc.winSize.height)).y;
        if (currentTopBorder > BORDER_LIMIT_TOP)
            this.setPositionY(pos.y + (currentTopBorder - BORDER_LIMIT_TOP));

        //left border of screen
        var currentLeftBorder = this.getMapPosFromScreenPos(cc.p(0, 0)).x;
        if (currentLeftBorder < BORDER_LIMIT_LEFT)
            this.setPositionX(pos.x + (currentLeftBorder - BORDER_LIMIT_LEFT));
        //right border of screen
        var currentRightBorder = this.getMapPosFromScreenPos(cc.p(cc.winSize.width, 0)).x;
        if (currentRightBorder > BORDER_LIMIT_RIGHT)
            this.setPositionX(pos.x + (currentRightBorder - BORDER_LIMIT_RIGHT));

    },

    enterModeBuyBuilding: function (buildingType) {
        if(this.onModeBuyBuilding){

            this.exitModeBuyBuilding();
        }
        else (this.chosenBuilding !== null)
        {
            this.unSelectBuilding();
        }
        this.onModeBuyBuilding = true;

        //init building and set it to chosen building
        this.chosenBuilding = getBuildingFromType(buildingType, 1)

        //add button accept and cancel to building
        var buttonAccept = createButton(res.BUTTON.ACCEPT,SCALE_BUTTON_BUY_BUILDING,OFFSET_BUTTON_BUY_BUILDING,this.acceptBuyBuilding,this);
        this.chosenBuilding.addChild(buttonAccept, MAP_ZORDER_GUI);
        var buttonCancel = createButton(res.BUTTON.CANCEL,SCALE_BUTTON_BUY_BUILDING,cc.p(-OFFSET_BUTTON_BUY_BUILDING.x, OFFSET_BUTTON_BUY_BUILDING.y),this.exitModeBuyBuilding,this);
        this.chosenBuilding.addChild(buttonCancel, MAP_ZORDER_GUI);

        //set position of building
        let validPosition = MapManager.Instance().getEmptyPositionPutBuilding(this.chosenBuilding);

        //if not valid position, set to center of map and square to red, else set to valid position and square to green, move screen to see building
        if(validPosition == null) {
            validPosition = cc.p(GRID_SIZE / 2, GRID_SIZE / 2)
            this.chosenBuilding.setSquare(2);
        }
        else
        {
            this.chosenBuilding.setSquare(1);
        }
        this.chosenBuilding.setGridPosition(validPosition.x, validPosition.y);
        this.tempPosChosenBuilding = cc.p(validPosition.x, validPosition.y);

        //move screen to see building
        let currentPos = this.getPosition();
        let newPos = this.getMapPosFromGridPos(validPosition);
        this.setPosition(cc.pSub(currentPos,newPos));
        this.limitBorder();

        //add building to layer to display
        this.addBuildingToLayer(this.chosenBuilding,MAP_ZORDER_BUILDING);

        //set chosen building
        this.selectBuilding(this.chosenBuilding);
    },
    getChosenBuilding: function () {
        return this.chosenBuilding;
    },
});

