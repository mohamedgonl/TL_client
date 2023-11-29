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
        this.initDropTroopBorder();
    },

    createTroopAtGridPos: function (type, posX, posY) {
        LogUtils.writeLog("create troop : " + type + " " + posX + " " + posY)
        let troop = null;
        switch (type) {
            case 'ARM_1':
                troop = new Warrior(posX, posY);
                break;
            case 'ARM_2':
                troop = new Archer(posX, posY);
                break;
            case 'ARM_3':
                troop = new Thief(posX, posY);
                break;
            case 'ARM_4':
                troop = new Giant(posX, posY);
                break;
            case 'ARM_6':
                troop = new Bomber(posX, posY);
            default:
                cc.log("NOT FOUND TROOP TYPE");
        }

        if (troop) {
            if (this.idTroop === undefined) this.idTroop = 0;
            else this.idTroop++;

            let posToAdd = this.getMapPosFromGridPos({x: posX, y: posY});
            this.addChild(troop, MAP_ZORDER_TROOP);
            troop.setPosition(posToAdd);
            troop.setId(this.idTroop);

            //droptroop animation
            let dropTroopAction = res_troop.EFFECT.DROP_TROOP.ANIM;
            let cloneDropTroopAction = dropTroopAction.clone();
            let animate = cc.animate(cloneDropTroopAction);
            let dropTroop = new cc.Sprite(res_troop.EFFECT.DROP_TROOP[0]);
            dropTroop.runAction(animate);
            this.addChild(dropTroop, MAP_ZORDER_DROP_TROOP);
            dropTroop.setPosition(posToAdd);
            dropTroop.setScale(0.5);
            //biến mất sau frame cuối
            this.scheduleOnce(function () {
                if (dropTroop)
                    dropTroop.setVisible(false);
            }, 0.5);

            cc.director.getRunningScene().onDropTroop({
                troopType: type,
                posX,
                posY
            })
        }
    },

    //load all building in map manager and add it to MapLayer
    loadBuilding: function () {
        const listBuildings = BattleManager.getInstance().getAllGameObjects();
        for (let building of listBuildings.values()) {
            this.addBuildingToLayer(building);
        }
    },

    initDropTroopBorder: function () {
        this._borderDropTroop = new cc.DrawNode();

        const grid = BattleManager.getInstance().getDropTroopGrid();

        const BATTLE_CELL_SCALE = 3;

        //draw bottom lines
        for (let i = BATTLE_CELL_SCALE; i < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE; i++) {
            let j = BATTLE_CELL_SCALE;
            let startLine = 0;
            while (j < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE) {
                if (grid[i][j] === 0 && grid[i - 1][j] > 0) {
                    startLine = j;
                    while (grid[i][j] === 0 && grid[i - 1][j] > 0)
                        j++;
                    //draw from startLine to j
                    this._borderDropTroop.drawSegment(this.getMapPosFromGridPos(cc.p(i, startLine)), this.getMapPosFromGridPos(cc.p(i, j)), 0.5, cc.Color(250, 0, 0, 255));
                }
                j++;
            }
        }
        //draw top lines
        for (let i = BATTLE_CELL_SCALE; i < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE; i++) {
            let j = BATTLE_CELL_SCALE;
            let startLine = 0;
            while (j < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE) {
                if (grid[i][j] === 0 && grid[i + 1][j] > 0) {
                    startLine = j;
                    while (grid[i][j] === 0 && grid[i + 1][j] > 0)
                        j++;
                    //draw from startLine to j
                    this._borderDropTroop.drawSegment(this.getMapPosFromGridPos(cc.p(i + 1, startLine)), this.getMapPosFromGridPos(cc.p(i + 1, j)), 0.5, cc.Color(250, 0, 0, 255));
                }
                j++;
            }
        }
        //draw right lines
        for (let j = BATTLE_CELL_SCALE; j < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE; j++) {
            let i = BATTLE_CELL_SCALE;
            let startLine = 0;
            while (i < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE) {
                if (grid[i][j] === 0 && grid[i][j - 1] > 0) {
                    startLine = i;
                    while (grid[i][j] === 0 && grid[i][j - 1] > 0)
                        i++;
                    //draw from startLine to i
                    this._borderDropTroop.drawSegment(this.getMapPosFromGridPos(cc.p(startLine, j)), this.getMapPosFromGridPos(cc.p(i, j)), 0.5, cc.Color(250, 0, 0, 255));
                }
                i++;
            }
        }
        //draw left lines
        for (let j = BATTLE_CELL_SCALE; j < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE; j++) {
            let i = BATTLE_CELL_SCALE;
            let startLine = 0;
            while (i < GRID_SIZE_BATTLE - BATTLE_CELL_SCALE) {
                if (grid[i][j] === 0 && grid[i][j + 1] > 0) {
                    startLine = i;
                    while (grid[i][j] === 0 && grid[i][j + 1] > 0)
                        i++;
                    //draw from startLine to i
                    this._borderDropTroop.drawSegment(this.getMapPosFromGridPos(cc.p(startLine, j + 1)), this.getMapPosFromGridPos(cc.p(i, j + 1)), 0.5, cc.Color(250, 0, 0, 255));
                }
                i++;
            }
        }

        this._borderDropTroop.setVisible(false);
        this.addChild(this._borderDropTroop, MAP_ZORDER_BUILDING + 1);
        this.showBorderDropTroop();
    },

    resetState: function () {
        const listBuildings = BattleManager.getInstance().getAllGameObjects();
        for (let building of listBuildings.values()) {
            this.removeBuilding(building);
        }
        this.removeChild(this._borderDropTroop);
        this._borderDropTroop = null;
    },

    //add building to layer with gridPos of it
    addBuildingToLayer: function (building, zOrder) {
        if (building == null) {
            return;
        }

        const buildingConfig = LoadManager.getInstance().getConfig(building._type, building._level);
        let sizeX = buildingConfig.width * GRID_BATTLE_RATIO;
        let sizeY = buildingConfig.height * GRID_BATTLE_RATIO;

        let gridPosX = building._posX;
        let gridPosY = building._posY;

        let buildingCenterX = gridPosX + sizeX / 2;
        let buildingCenterY = gridPosY + sizeY / 2;

        //nếu buildingCenterX không phải là số nguyên, add vào giữa của ô trung tâm
        if (buildingCenterX % 1 !== 0 || buildingCenterY % 1 !== 0) {
            buildingCenterX = Math.floor(buildingCenterX);
            buildingCenterY = Math.floor(buildingCenterY);
            this.addGameObjectToMapLayer(building, buildingCenterX, buildingCenterY,  true);
        }
        //add vào góc trái dưới của ô trung tâm
        else {
            this.addGameObjectToMapLayer(building, buildingCenterX, buildingCenterY)
        }

    },

    //add event listener for map
    addEventListener: function () {

        //scale by scroll
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,

            onMouseScroll: this.zoom.bind(this)
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

        this.addChild(tmxMap, BATTLE_CONST.ZORDER_GRID);

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


        this.addChild(backgroundUpLeft, BATTLE_CONST.ZORDER_BACKGROUND);
        this.addChild(backgroundUpRight, BATTLE_CONST.ZORDER_BACKGROUND);
        this.addChild(backgroundDownLeft, BATTLE_CONST.ZORDER_BACKGROUND);
        this.addChild(backgroundDownRight, BATTLE_CONST.ZORDER_BACKGROUND);
    },

    getZOrder: function (gameObject) {
        // gridPos cang thap thi zỎder cang cao, cao nhat la MAP_ZORDER_BUILDING
        return BATTLE_CONST.ZORDER_BUILDING - gameObject.y;
    },

    onTouchBegan: function (touch) {
        if(this.onModeDropTroop) return;
        this.positionTouchBegan = touch.getLocation();
        this.positionMoved = null;
        this.timeStartTouch = Date.now();
        this.schedule(this.checkModeDropTroop, 0.1)
    },
    checkModeDropTroop: function () {
        cc.log("check mode drop troop chedule")
        if (this.onModeDropTroop) return;
        if (this.timeStartTouch === null) return;

        let timeNow = Date.now();
        let deltaTime = timeNow - this.timeStartTouch;
        //if > 0.5s, drop troop
        if (deltaTime > 400) {
            this.onModeDropTroop = true;
            this.unschedule(this.checkModeDropTroop);
            this.schedule(this.loopDropTroop, 0.2);
        }
    },
    loopDropTroop: function () {

        if (this.onModeDropTroop) {
            let position = this.positionMoved;
            if (position == null) position = this.positionTouchBegan;
            this.onClickDropTroop(position);

        }
    },

    //if not in move building mode, move view, else move building
    onDrag: function (event) {
        this.positionMoved = event.getLocation();
        if (this.onModeDropTroop) return;

        if (this.timeStartTouch) {
            //neu di chuyen qua 10 pixel dat lai timeStartTouch
            let locationInScreen = event.getLocation();
            let distance = cc.pDistance(locationInScreen, this.positionTouchBegan);
            if (distance > 10) {
                this.timeStartTouch = null;
                this.unschedule(this.checkModeDropTroop);
            }
        }

        this.moveView(event.getDelta());
    },

    onTouchEnded: function (event) {
        let timeNow = Date.now();
        let deltaTime = timeNow - this.timeStartTouch;
        if(deltaTime < 400) {
            var locationInScreen = event.getLocation();
            var distance = cc.pDistance(locationInScreen, this.positionTouchBegan);
            if (distance < 10) this.onClickDropTroop(this.positionTouchBegan);
            // return;
        }


        this.timeStartTouch = null;
        this.unschedule(this.checkModeDropTroop);
        this.onModeDropTroop = false;
        this.unschedule(this.loopDropTroop);
    },

    onClickDropTroop: function (locationInScreen) {
        let tick = cc.director.getRunningScene().battleLayer.tick;
        if (tick !== undefined && tick === this.oldTick) {
            cc.log("tick same")
            cc.log(tick + " " + this.oldTick)
            return;
        }

        //random in -10 +10 pixel
        let locationDrop = cc.pAdd(locationInScreen, cc.p(Math.random() * 10 - 5, Math.random() * 10 - 5));
        let gridPos = this.getGridPosFromScreenPos(locationDrop);
        //get type of chosen slot
        let type = cc.director.getRunningScene().battleUILayer.getTypeOfChosenSlot();
        if (type == null || !gridPos) return;
        let canDropTroop = BattleManager.getInstance().getDropTroopGrid()[gridPos.x][gridPos.y];

        if (!canDropTroop) {
            this.showBorderDropTroop();
            //todo: show text
            return;
        }

        if (BattleManager.getInstance().listUsedTroop.get(type) >= BattleManager.getInstance().listTroops.get(type)) {
            return;
        }

        if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.PREPARING) {
            cc.director.getRunningScene().onStartBattle();
        }
        this.createTroopAtGridPos(type, gridPos.x, gridPos.y);
        //anim create troop


        //get battleUILayer to minus 1 troop
        cc.director.getRunningScene().battleUILayer.onInitTroop();
        this.oldTick = tick;
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

    addGameObjectToMapLayer: function (gameObject, gridPosX, gridPosY, isCenter = false) {
        let posToAdd = this.getMapPosFromGridPos({x: gridPosX, y: gridPosY}, isCenter);
        gameObject.setPosition(posToAdd);
        gameObject._bottom.setPosition(posToAdd);
        let zOrder = this.getZOrder(gameObject);
        cc.log("add game object to map layer: " + zOrder)
        this.addChild(gameObject, zOrder);
        this.addChild(gameObject._bottom, BATTLE_CONST.ZORDER_BOTTOM);
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

    showBorderDropTroop: function () {
        if (this._borderDropTroop.isVisible())
            return;
        const self = this;
        this._borderDropTroop.setVisible(true);
        this.schedule(function () {
            if (self._borderDropTroop)
                self._borderDropTroop.setVisible(false);
        }, 0, 0, 3);
    },

    addBullet: function (bullet) {
        this.addChild(bullet, MAP_ZORDER_BULLET);
        if (bullet._explosion) {
            this.addChild(bullet._explosion, MAP_ZORDER_BULLET);
        }
    },

    gameLoop: function (dt) {
    },
});

