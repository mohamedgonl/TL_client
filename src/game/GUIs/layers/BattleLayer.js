var BattleLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.setAnchorPoint(0, 0);
        this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.init();
    },
    //init map layer with scale, add event, load background, load building
    init: function () {
        this.setScale(0.8);
        this.addEventListener();
        this.initBackground();
        // this.loadBuilding();
        // this.loadState();
    },

    onLoadDataSuccess: function () {
        this.loadBuilding();
    },

    createTroopAtGridPos: function (type, posX, posY) {
        cc.log("create troop at grid pos: " + type + " " + posX + " " + posY)
        let troop = null;
        switch (type) {
            case 'ARM_1':
                troop = new Warrior(posX, posY);
                break;
            case 'ARM_2':
                troop = new Archer(posX, posY);
                break;
            case 'ARM_3':
                troop = new Giant(posX, posY);
                break;
            case 'ARM_4':
                troop = new Thief(posX, posY);
                break;
            case 'ARM_6':
                troop = new Bomber(posX, posY);
            default:
                cc.log("NOT FOUND TROOP TYPE");
        }
        if (troop) {
            let posToAdd = this.getMapPosFromGridPos({x: posX, y: posY});
            this.addChild(troop, MAP_ZORDER_TROOP);
            troop.setPosition(posToAdd);
        }
    },

    //load all building in map manager and add it to MapLayer
    loadBuilding: function () {
        const listBuildings = BattleManager.getInstance().getAllGameObjects();
        for (let building of listBuildings.values()) {
            this.addBuildingToLayer(building);
        }
    },

    resetState: function () {
        const listBuildings = BattleManager.getInstance().getAllGameObjects();
        for (let building of listBuildings.values()) {
            this.removeBuilding(building);
        }
    },

    //add building to layer with gridPos of it
    addBuildingToLayer: function (building, zOrder) {
        if (building == null) {
            return;
        }

        const buildingConfig = LoadManager.getInstance().getConfig(building._type, building._level);
        let sizeX = buildingConfig.width * 3;
        let sizeY = buildingConfig.height * 3;

        let gridPosX = building._posX;
        let gridPosY = building._posY;

        let buildingCenterX = gridPosX + sizeX / 2;
        let buildingCenterY = gridPosY + sizeY / 2;
        let zOrderValue = zOrder == null ? this.getZOrderBuilding(gridPosX, gridPosY) : zOrder;

        //nếu buildingCenterX không phải là số nguyên, add vào giữa của ô trung tâm
        if (buildingCenterX % 1 !== 0 || buildingCenterY % 1 !== 0) {
            buildingCenterX = Math.floor(buildingCenterX);
            buildingCenterY = Math.floor(buildingCenterY);
            this.addGameObjectToMapLayer(building, buildingCenterX, buildingCenterY, zOrderValue, true);
        }
        //add vào góc trái dưới của ô trung tâm
        else {
            this.addGameObjectToMapLayer(building, buildingCenterX, buildingCenterY, zOrderValue)
        }

    },

    //add event listener for map
    addEventListener: function () {

        //scale by scroll
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseScroll: this.zoom.bind(this)
        }, this);

        //click space to check
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if (keyCode === cc.KEY.space) {
                    console.log("==================================================================")
                }
                if (keyCode === cc.KEY.x) {
                }
                if (keyCode === cc.KEY.c) {
                }
                if (keyCode === cc.KEY.z) {
                }

            }.bind(this)

        }, this);
        //listen to multi touch to zoom
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                //if only one touch
                if (touches.length === 1) {
                    this.onTouchBegan(touches[0]);

                }

            }.bind(this),
            onTouchesMoved: function (touches, event) {
                if (touches.length === 1) {
                    this.onDrag(touches[0]);
                    return;
                }
                if (touches.length === 2) {
                    this.zoomMultiTouch(touches[0], touches[1]);
                }

            }.bind(this),
            onTouchesEnded: function (touches, event) {
                if (touches.length === 1) {
                    this.onTouchEnded(touches[0]);

                }


            }.bind(this)
        }, this);

    },

    removeBuilding: function (building) {
        //remove child from layer
        building.removeFromParent(true);
    },

    initBackground: function () {
        //load tmx file 42X42 map grid
        var tmxMap = new cc.TMXTiledMap("res/guis/map/42x42map.tmx");

        tmxMap.setAnchorPoint(0.5, 0.5)
        tmxMap.setPosition(0, 0);
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
        this.positionTouchBegan = touch.getLocation();
    },

    //if not in move building mode, move view, else move building
    onDrag: function (event) {
        this.moveView(event.getDelta());
    },

    onTouchEnded: function (event) {

        var locationInScreen = event.getLocation();
        var distance = cc.pDistance(locationInScreen, this.positionTouchBegan);
        this.canDragBuilding = false;
        if (distance < 10) this.onClicked(this.positionTouchBegan);

    },

    onClicked: function (locationInScreen) {
        let gridPos = this.getGridPosFromScreenPos(locationInScreen);
        //get type of chosen slot
        let type = cc.director.getRunningScene().battleUILayer.getTypeOfChosenSlot();
        cc.log("choose:::::::::::::::", type);
        if (type == null) return;
        this.createTroopAtGridPos(type, gridPos.x, gridPos.y);
    },


    getMapPosFromScreenPos: function (posInScreen) {
        var posInMap = cc.pSub(posInScreen, this.getPosition());
        let x = posInMap.x / this.getScale();
        let y = posInMap.y / this.getScale();
        // cc.log("get map pos from screen pos: " + x + " " + y)
        return cc.p(x, y);

    },

    //use distance from
    // bottom left grid border and bottom right grid border
    // to get grid pos from map pos
    getGridPosFromMapPos: function (posInMap) {
        //calculate distance by distance formula from point to line
        var distanceFromBottomLeft = Utils.findDistanceFromPointToLine(posInMap, CORNER_BOTTOM_BATTLE, CORNER_LEFT_BATTLE);
        var distanceFromBottomRight = Utils.findDistanceFromPointToLine(posInMap, CORNER_RIGHT_BATTLE, CORNER_BOTTOM_BATTLE);

        var grid_width = Utils.findDistanceFromPointToLine(CORNER_BOTTOM_BATTLE, CORNER_TOP_BATTLE, CORNER_RIGHT_BATTLE);

        var gridX = Math.floor(distanceFromBottomLeft / grid_width * GRID_SIZE_BATTLE);
        var gridY = Math.floor(distanceFromBottomRight / grid_width * GRID_SIZE_BATTLE);

        if (gridX < 0 || gridX >= GRID_SIZE_BATTLE || gridY < 0 || gridY >= GRID_SIZE_BATTLE)
            return null;

        return cc.p(gridX, gridY);
    },

    getGridPosFromScreenPos: function (posInScreen) {
        var posInMap = this.getMapPosFromScreenPos(posInScreen);
        return this.getGridPosFromMapPos(posInMap);
    },

    getMapPosFromGridPos: function (gridPos, isCenter = false, random = false) {
        if (isCenter === true) {
            //floor x y
            gridPos.x = Math.floor(gridPos.x);
            gridPos.y = Math.floor(gridPos.y);
            gridPos = cc.p(gridPos.x + 0.5, gridPos.y + 0.5);
        }
        if (random === true) {
            //rand 0 to 1
            let randX = Math.random();
            let randY = Math.random();
            gridPos.x = Math.floor(gridPos.x);

            gridPos.y = Math.floor(gridPos.y);
            gridPos = cc.p(gridPos.x + randX, gridPos.y + randY);
        }

        var posA = cc.pLerp(CORNER_BOTTOM_BATTLE, CORNER_RIGHT_BATTLE, gridPos.x / GRID_SIZE_BATTLE);
        var posB = cc.pLerp(CORNER_BOTTOM_BATTLE, CORNER_LEFT_BATTLE, gridPos.y / GRID_SIZE_BATTLE);
        var posC = cc.pLerp(CORNER_LEFT_BATTLE, CORNER_TOP_BATTLE, gridPos.x / GRID_SIZE_BATTLE);
        var posD = cc.pLerp(CORNER_RIGHT_BATTLE, CORNER_TOP_BATTLE, gridPos.y / GRID_SIZE_BATTLE);
        return cc.pIntersectPoint(posA, posC, posB, posD);
    },

    getScreenPosFromMapPos: function (posInMap) {
        var posInMap = cc.pSub(posInMap, cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        return cc.pMult(posInMap, this.getScale());
    },

    //use it to add, calculate position to add child in map layer
    //------------------------------------------------------------------------------------------------------------------

    addGameObjectToMapLayer: function (gameObject, gridPosX, gridPosY, zOrder, isCenter = false) {
        let posToAdd = this.getMapPosFromGridPos({x: gridPosX, y: gridPosY}, isCenter);
        this.addChild(gameObject, zOrder);
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
        let ratio = scale / oldScale;
        this.x -= mapPos.x * (ratio - 1);
        this.y -= mapPos.y * (ratio - 1);

        this.setScale(scale);
        this.limitBorder();
    },
    zoomMultiTouch: function (touch1, touch2) {
        let location1 = touch1.getLocation();
        let location2 = touch2.getLocation();
        let location = cc.pMidpoint(location1, location2);
        let mapPos = this.getMapPosFromScreenPos(location);
        let oldScale = this.getScale();
        let distance = cc.pDistance(location1, location2);
        let delta = distance - this.distance;

        // Tính toán giá trị mới của scale
        let scale = this.getScale();
        if (delta > 0) {
            scale += ZOOM_STEP / 2;
            scale = Math.min(scale, ZOOM_MAX);
        } else {
            scale -= ZOOM_STEP / 2;
            scale = Math.max(scale, ZOOM_MIN);
        }

        // Tính toán tỷ lệ giữa scale mới và scale cũ
        let ratio = scale / oldScale;

        // Tính toán vị trí mới và scale mượt hơn
        let targetX = this.x - mapPos.x * (ratio - 1);
        let targetY = this.y - mapPos.y * (ratio - 1);

        this.x = targetX;
        this.y = targetY;

        this.setScale(scale);
        this.limitBorder();


        this.distance = distance;
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

    addBullet: function (bullet, defence) {
        this.addChild(bullet, MAP_ZORDER_BULLET);
    },

    gameLoop: function (dt) {
        //check list troop pos -> add to targetQueue of def
    },
});

