LoadManager.getInstance();

var MapLayer = cc.Layer.extend({

    chosenBuilding: null, onModeMovingBuilding: false, canDragBuilding: false, onModeBuyBuilding: false,

    ctor: function () {

        this._super();
        this.setAnchorPoint(0, 0);
        //create label hello world at 0,0
        this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.tempPosChosenBuilding = {
            x: 0, y: 0
        }
        // this.init();
    }, //init map layer with scale, add event, load background, load building
    init: function () {
        this.setScale(1);
        this.addEventListener();
        this.initBackground();
        this.loadBuilding();
        // this.loadState();
    },

    //load all building in map manager and add it to MapLayer
    loadBuilding: function () {
        let listBuilding = MapManager.getInstance().getAllBuilding();
        for (let i = 0; i < listBuilding.length; i++) {

            let building = listBuilding[i];
            building.addIntoMapLayer();
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
            event: cc.EventListener.KEYBOARD, onKeyPressed: function (keyCode) {
                if (keyCode === cc.KEY.space) {
                    console.log("==================================================================")
                }
                if (keyCode === cc.KEY.x) {
                    let warrior = new Warrior(0, 0);
                    this.addChild(warrior, 999999999);
                }
                if (keyCode === cc.KEY.c) {
                }
                if (keyCode === cc.KEY.z) {
                }

            }.bind(this)

        }, this);
        //listen to multi touch to zoom
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE, onTouchesBegan: function (touches, event) {
                //if only one touch
                if (touches.length === 1) {
                    this.onTouchBegan(touches[0]);
                    return;
                }

            }.bind(this), onTouchesMoved: function (touches, event) {
                if (touches.length === 1) {
                    this.onDrag(touches[0]);
                    return;
                }
                if (touches.length === 2) {
                    this.zoomMultiTouch(touches[0], touches[1]);
                }

            }.bind(this), onTouchesEnded: function (touches, event) {
                if (touches.length === 1) {
                    this.onTouchEnded(touches[0]);
                    return;
                }


            }.bind(this)
        }, this);

    },

    removeBuilding: function (building) {
        //remove child from layer
        if (building === this.chosenBuilding) {
            this.unSelectBuilding();
        }
        building.removeFromParent(true);
    },

    exitModeBuyBuilding: function () {
        if (this.chosenBuilding) this.chosenBuilding.removeFromMapLayer();
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
        if (!this.checkValidPutBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y)) {
            cc.log("invalid put building");
            return;
        }
        //check have builder
        if (PlayerInfoManager.getInstance().builder.current <= 0 && this.chosenBuilding._type !== "BDH_1") {
            cc.log("not enough builder");
            // create content in popup
            let label = new cc.LabelBMFont("Bạn có muốn giải phóng thợ xây", res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
            label.setColor(new cc.Color(150, 78, 3));
            // let price = new cc.LabelBMFont(priceCount, res.FONT.SOJI["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
            // price.setPositionY(-label.getContentSize().height);
            // //price mau xanh la
            // price.setColor(cc.color(0, 255, 0));
            let content = new cc.Node();
            content.addChild(label);
            // content.addChild(price);
            let buyResPopup = new NotiPopup({
                title: "THỢ XÂY BẬN HẾT", acceptCallBack: () => {
                    //remove popup
                    popUpLayer.setVisible(false);
                    PlayerInfoManager.getInstance().freeBuilderByGem();
                    buyResPopup.removeFromParent(true);
                }, content: content, cancleCallBack: () => {
                    popUpLayer.setVisible(false);
                    buyResPopup.removeFromParent(true)
                }
            });
            var popUpLayer = cc.director.getRunningScene().popUpLayer;
            popUpLayer.addChild(buyResPopup)
            popUpLayer.setVisible(true);
            return;
        }

        //price gold, if null -> 0
        let priceGold = LoadManager.getInstance().getConfig(this.chosenBuilding._type, 1, "gold") || 0;
        let priceElixir = LoadManager.getInstance().getConfig(this.chosenBuilding._type, 1, "elixir") || 0;
        let priceGem = LoadManager.getInstance().getConfig(this.chosenBuilding._type, 1, "coin") || 0;
        if (priceGem > 0) {
            if (PlayerInfoManager.getInstance().getResource("gem") < priceGem) {
                BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ G")
                return;
            }
        }

        if (PlayerInfoManager.getInstance().checkEnoughResource(priceGold, priceElixir) === false) {
            let price;
            let type;
            if (priceGold > 0) {
                //price is amout need to enough
                price = priceGold - PlayerInfoManager.getInstance().getResource().gold;
                type = "gold";
            } else {
                price = priceElixir - PlayerInfoManager.getInstance().getResource().elixir;
                type = "elixir";
            }
            NotEnoughResourcePopup.appear(price, type);
            return;
        }

        //gui cho server
        testnetwork.connector.sendBuyBuilding(this.chosenBuilding._type, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y);

    }, onReceivedQuickFinishOfAnother: function (packet) {
        this.acceptBuyBuilding();
    },

    //+ api buyBuilding: 2001
    //   input: type(str, posX(short), posY(short)
    //   output: error, id, type(str), posX, posY, status(short), startTime, endTime

    initBackground: function () {

        //load tmx file 42X42 map grid
        var tmxMap = new cc.TMXTiledMap("res/guis/map/42x42map.tmx");

        tmxMap.setAnchorPoint(0.5, 0.5)
        tmxMap.setPosition(0, 0);
        tmxMap.setScale(GRID_SCALE)

        this.addChild(tmxMap, ZORDER_GRID);


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

    //get ZORDER of troop, building. Depend on position of it, the higher position, the lower ZORDER, max is ZORDER_BUILDING_MAINSPRITE_MAX
    getZOrderByPosition: function (gridPosX, gridPosY) {
        return ZORDER_BUILDING_MAINSPRITE_MAX - gridPosX - gridPosY;
    },

    onTouchBegan: function (touch) {
        this.positionTouchBegan = touch.getLocation();
        if (this.chosenBuilding == null) return;

        let building = this.getBuildingFromTouch(touch.getLocation());
        if (building !== this.chosenBuilding || this.chosenBuilding._type.startsWith(GAMEOBJECT_PREFIX.OBSTACLE)) return;
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

        if (newPos == null) return;

        if (newPos.x !== this.tempPosChosenBuilding.x || newPos.y !== this.tempPosChosenBuilding.y) {
            this.tempPosChosenBuilding = newPos;
            this.chosenBuilding.moveSpriteToGridPos(newPos.x, newPos.y);
        }
    },

    onTouchEnded: function (event) {

        var locationInScreen = event.getLocation();
        var distance = cc.pDistance(locationInScreen, this.positionTouchBegan);
        this.canDragBuilding = false;
        if (distance < 10) this.onClicked(this.positionTouchBegan);

        if (this.onModeBuyBuilding) return;

        //if onModeMoveBuilding and current pos of chosenBuilding is valid, send to server to recheck
        if (this.onModeMovingBuilding) {

            if (this.checkValidPutBuilding(this.chosenBuilding, this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y)) this.exitModeMoveBuilding();
        }
    }, onClicked: function (locationInScreen) {

        if (this.onModeBuyBuilding) return;
        let building = this.getBuildingFromTouch(locationInScreen);
        if (building != null && building._type.startsWith(GAMEOBJECT_PREFIX.RESOURCE) && building._state === 0 && building._showIconHarvest) {
            building.onClickHarvest();
            this.unSelectBuilding();
            return;
        }
        //click building first time or click another building

        //if click nothing -> building = null
        if (building == null) {

            if (this.onModeMovingBuilding) {
                this.exitModeMoveBuilding();
            } else this.unSelectBuilding();
            return;
        }
        if (this.chosenBuilding == null) {
            this.selectBuilding(building);
            return;
        }

        if (this.chosenBuilding !== building) {
            this.unSelectBuilding();
            this.selectBuilding(building);
        }
    },

    selectBuilding: function (building) {
        if (this.onModeBuyBuilding) {
            this.chosenBuilding = building;
            this.tempPosChosenBuilding = cc.p(this.chosenBuilding._posX, this.chosenBuilding._posY);
            building.onSelected();
            return;
        }
        //if have chosen building, unselect it
        this.unSelectBuilding(this.chosenBuilding);

        this.chosenBuilding = building;
        this.tempPosChosenBuilding = cc.p(this.chosenBuilding._posX, this.chosenBuilding._posY);
        building.onSelected();
    },

    unSelectBuilding: function () {

        if (this.chosenBuilding) {
            if (this.onModeMovingBuilding) {
                this.exitModeMoveBuilding();
            }
            this.chosenBuilding.onUnselected();
        }
        this.chosenBuilding = null;
        // this.onModeMovingBuilding = false;

        this.tempPosChosenBuilding = null;
    },

    onReceivedCheckMoveBuilding: function (data) {
        cc.log("ON RECEIVED CHECK MOVE BUILDING", JSON.stringify(data, null, 2))
        //if valid move, move building in map manager
        if (data.error === 0) {
            this.chosenBuilding.moveToGridPos(this.tempPosChosenBuilding.x, this.tempPosChosenBuilding.y);
        } else {
            //move back to old pos
            this.chosenBuilding.moveSpriteToGridPos(this.originGridPosition.x, this.originGridPosition.y);
        }
        this.chosenBuilding.showColorSquare(0);
    },


    enterModeMoveBuilding: function () {

        this.originGridPosition = this.chosenBuilding.getGridPosition();
        this.chosenBuilding.setLocalZOrder(99999);
        this.canDragBuilding = true;
        this.onModeMovingBuilding = true;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        infoLayer.setVisible(false);
    },

    //exit mode move building, send to server to recheck if valid, else move back to old pos
    exitModeMoveBuilding: function () {

        this.chosenBuilding.setLocalZOrder(this.getZOrderByPosition(this.chosenBuilding._posX, this.chosenBuilding._posY));
        this.canDragBuilding = false;
        this.onModeMovingBuilding = false;
        var infoLayer = cc.director.getRunningScene().infoLayer;
        var newPosX = this.tempPosChosenBuilding.x;
        var newPosY = this.tempPosChosenBuilding.y;

        if (this.checkValidPutBuilding(this.chosenBuilding, newPosX, newPosY)) {
            testnetwork.connector.sendMoveBuilding(this.chosenBuilding._id, newPosX, newPosY);
        } else {
            //move back to old pos
            cc.log("MOVE TO OLD")
            this.chosenBuilding.moveSpriteToGridPos(this.originGridPosition.x, this.originGridPosition.y);
        }
        cc.log("EXIT MODE MOVE BUILDING")
        this.chosenBuilding.showColorSquare(0);

        infoLayer.setVisible(true);
    },

    getBuildingFromTouch: function (locationInScreen) {
        let chosenGrid = this.getGridPosFromScreenPos(locationInScreen);
        if (chosenGrid == null) return null;
        if (this.chosenBuilding != null) {
            let width = this.chosenBuilding._width;
            let height = this.chosenBuilding._height;

            //if click in building -> return building
            if (chosenGrid.x >= this.tempPosChosenBuilding.x && chosenGrid.x < this.tempPosChosenBuilding.x + width && chosenGrid.y >= this.tempPosChosenBuilding.y && chosenGrid.y < this.tempPosChosenBuilding.y + height) {
                return this.chosenBuilding;
            }
        }

        let mapGrid = MapManager.getInstance().mapGrid;
        let buildingId = mapGrid[chosenGrid.x][chosenGrid.y];
        if (buildingId === 0) return null;
        if (this.chosenBuilding && buildingId === this.chosenBuilding._id) return null;
        return MapManager.getInstance().getBuildingById(buildingId);
    },

    getMapPosFromScreenPos: function (posInScreen) {

        var posInMap = cc.pSub(posInScreen, this.getPosition());
        let x = posInMap.x / this.getScale();
        let y = posInMap.y / this.getScale();
        return cc.p(x, y);
    },

    //use distance from
    // bottom left grid border and bottom right grid border
    // to get grid pos from map pos
    getGridPosFromMapPos: function (posInMap) {
        // posInMap = cc.pSub(posInMap,cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        //calculate distance by distance formula from point to line
        var distanceFromBottomLeft = Utils.findDistanceFromPointToLine(posInMap, CORNER_BOTTOM, CORNER_LEFT);
        var distanceFromBottomRight = Utils.findDistanceFromPointToLine(posInMap, CORNER_RIGHT, CORNER_BOTTOM);

        var grid_width = Utils.findDistanceFromPointToLine(CORNER_BOTTOM, CORNER_TOP, CORNER_RIGHT);

        var gridX = Math.floor(distanceFromBottomLeft / grid_width * GRID_SIZE);
        var gridY = Math.floor(distanceFromBottomRight / grid_width * GRID_SIZE);


        if (gridX < 0 || gridX >= GRID_SIZE || gridY < 0 || gridY >= GRID_SIZE) return null;

        return cc.p(gridX, gridY);
    }, getGridPosFromScreenPos: function (posInScreen) {
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

        var posA = cc.pLerp(CORNER_BOTTOM, CORNER_RIGHT, gridPos.x / GRID_SIZE);
        var posB = cc.pLerp(CORNER_BOTTOM, CORNER_LEFT, gridPos.y / GRID_SIZE);
        var posC = cc.pLerp(CORNER_LEFT, CORNER_TOP, gridPos.x / GRID_SIZE);
        var posD = cc.pLerp(CORNER_RIGHT, CORNER_TOP, gridPos.y / GRID_SIZE);
        return cc.pIntersectPoint(posA, posC, posB, posD);
    }, getScreenPosFromMapPos: function (posInMap) {
        var posInMap = cc.pSub(posInMap, cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        return cc.pMult(posInMap, this.getScale());
    },

    //use it to add, calculate position to add child in map layer
    //------------------------------------------------------------------------------------------------------------------

    addGameObjectToMapLayer: function (gameObject, gridPosX, gridPosY, zOrder, isCenter = false) {
        let posToAdd = this.getMapPosFromGridPos({x: gridPosX, y: gridPosY}, isCenter);
        this.addChild(gameObject, zOrder);
        gameObject.setPosition(posToAdd);


    }, moveGameObjectInMapLayer: function (gameObject, gridPosX, gridPosY, isCenter = false) {
        let posToAdd = this.getMapPosFromGridPos({x: gridPosX, y: gridPosY}, isCenter);
        gameObject.setPosition(posToAdd);
    }, //------------------------------------------------------------------------------------------------------------------
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
        if (currentBottomBorder < BORDER_LIMIT_BOTTOM) this.setPositionY(pos.y + (currentBottomBorder - BORDER_LIMIT_BOTTOM));
        //top border of screen
        var currentTopBorder = this.getMapPosFromScreenPos(cc.p(0, cc.winSize.height)).y;
        if (currentTopBorder > BORDER_LIMIT_TOP) this.setPositionY(pos.y + (currentTopBorder - BORDER_LIMIT_TOP));

        //left border of screen
        var currentLeftBorder = this.getMapPosFromScreenPos(cc.p(0, 0)).x;
        if (currentLeftBorder < BORDER_LIMIT_LEFT) this.setPositionX(pos.x + (currentLeftBorder - BORDER_LIMIT_LEFT));
        //right border of screen
        var currentRightBorder = this.getMapPosFromScreenPos(cc.p(cc.winSize.width, 0)).x;
        if (currentRightBorder > BORDER_LIMIT_RIGHT) this.setPositionX(pos.x + (currentRightBorder - BORDER_LIMIT_RIGHT));

    },

    onBuyWallSuccess: function () {
        //check left and below is wall or not, if wall, reload sprite of it
        let currentWall = this.lastBuildingBuy;
        if (currentWall == null) return;

        //continue enter mode buy wall, follow direction of last wall and second wall
        let posLastWall = null;
        let posSecondLastWall = null;
        if (currentWall && currentWall._type.startsWith('WAL')) {
            posLastWall = cc.p(currentWall._posX, currentWall._posY);
        }

        //set vị trí theo hướng yêu thích, nếu được
        if (this.secondLastBuildingBuy && this.secondLastBuildingBuy._type.startsWith('WAL')) {

            posSecondLastWall = cc.p(this.secondLastBuildingBuy._posX, this.secondLastBuildingBuy._posY);

            let prevDirectX = posLastWall.x - posSecondLastWall.x;
            let prevDirectY = posLastWall.y - posSecondLastWall.y;

            //nếu là một trong 4 hướng
            if (prevDirectX === 0 && prevDirectY === 1 || prevDirectX === 1 && prevDirectY === 0 || prevDirectX === 0 && prevDirectY === -1 || prevDirectX === -1 && prevDirectY === 0) {
                //nếu đặt tường tiếp theo theo hướng cũ hợp lệ -> đặt tường tiếp theo theo hướng cũ
                if (this.checkValidPutBuilding(new Wall(), posLastWall.x + prevDirectX, posLastWall.y + prevDirectY)) {
                    cc.log("follow direction")
                    this.enterModeBuyBuilding("WAL_1", posLastWall.x + prevDirectX, posLastWall.y + prevDirectY);
                    return;
                }

            }
        }


        //nếu đặt tiếp theo hướng cũ không được hoặc không có hướng cũ -> đặt theo hướng mới hợp lệ
        let dx = [0, 1, 0, -1];
        let dy = [1, 0, -1, 0];
        let bestDirect = -1;

        for (let i = 0; i < 4; i++) {
            let nextX = currentWall._posX + dx[i];
            let nextY = currentWall._posY + dy[i];
            if (this.checkValidPutBuilding(new Wall(), nextX, nextY) === false) continue;
            bestDirect = i;
        }
        //nếu có thể đặt được tường, đặt thêm , nếu không thể thì không đặt tường nữa
        if (bestDirect !== -1)
            this.enterModeBuyBuilding("WAL_1", currentWall._posX + dx[bestDirect], currentWall._posY + dy[bestDirect]);
    },

    buyBuildingSuccess: function (data) {
        this.exitModeBuyBuilding();
        let building = getBuildingFromType(data.type, 1, data.id, data.posX, data.posY, data.status, data.startTime, data.endTime);
        MapManager.getInstance().addBuilding(building, true);
        building.addIntoMapLayer();
        this.selectBuilding(building);

        this.secondLastBuildingBuy = this.lastBuildingBuy;
        this.lastBuildingBuy = building;

        if (data.type === BUILDING_TYPE.WALL) {
            building.reloadSpriteWallAround();
            this.onBuyWallSuccess();
        }

        if (data.status !== 0) {
            cc.log("call start build")
            building.startBuild(data.startTime, data.endTime);
        }


    },


    enterModeBuyBuilding: function (buildingType, posX, posY) {
        if (this.onModeBuyBuilding) {

            this.exitModeBuyBuilding();
        } else (this.chosenBuilding !== null)
        {
            this.unSelectBuilding();
        }
        this.onModeBuyBuilding = true;

        //init building and set it to chosen building
        this.chosenBuilding = getBuildingFromType(buildingType, 1);

        //set position of building
        let validPosition = this.getEmptyPositionPutBuilding(this.chosenBuilding);
        if (posX && posY) {
            validPosition = cc.p(posX, posY);
        }

        //if not valid position, set to center of map and square to red, else set to valid position and square to green, move screen to see building
        this.chosenBuilding.setGridPosition(validPosition.x, validPosition.y);
        this.tempPosChosenBuilding = cc.p(validPosition.x, validPosition.y);

        this.chosenBuilding.addIntoMapLayer();

        //add button accept and cancel to building
        var buttonAccept = Utils.createButton(res.BUTTON.ACCEPT, SCALE_BUTTON_BUY_BUILDING, OFFSET_BUTTON_BUY_BUILDING, this.acceptBuyBuilding, this);
        this.chosenBuilding._effect.addChild(buttonAccept, ZORDER_BUILDING_EFFECT);
        var buttonCancel = Utils.createButton(res.BUTTON.CANCEL, SCALE_BUTTON_BUY_BUILDING, cc.p(-OFFSET_BUTTON_BUY_BUILDING.x, OFFSET_BUTTON_BUY_BUILDING.y), this.exitModeBuyBuilding, this);
        this.chosenBuilding._effect.addChild(buttonCancel, ZORDER_BUILDING_EFFECT);

        this.chosenBuilding.showColorSquare();

        // move screen to see building
        // let currentPos = this.getPosition();
        // let newPos = this.getMapPosFromGridPos(validPosition);
        // this.setPosition(cc.pSub(currentPos, newPos));
        // this.limitBorder();

        //add building to layer to display


        //set chosen building
        this.selectBuilding(this.chosenBuilding);
    },

    //check valid put building in mapGrid when change position of building or buy building
    checkValidPutBuilding: function (building, newPosX, newPosY) {
        var id = building._id;
        var width = building._width;
        var height = building._height;
        let mapGrid = MapManager.getInstance().mapGrid;


        //check out of map
        if (newPosX < 0 || newPosX + width > 40 || newPosY < 0 || newPosY + height > 40) return false;

        //check overlap
        for (var column = newPosX; column < newPosX + width; column++) for (var row = newPosY; row < newPosY + height; row++) if (mapGrid[column][row] !== 0 && mapGrid[column][row] !== id) return false;

        return true;
    },

    //find empty rect to place building in mapGrid by breadth first search from middle of map
    getEmptyPositionPutBuilding: function (building) {
        let queue = [];
        let visited = [];
        let middleX = GRID_SIZE / 2;
        let middleY = GRID_SIZE / 2;
        queue.push({x: middleX, y: middleY});
        visited[middleX] = [];
        visited[middleX][middleY] = true;

        while (queue.length > 0) {
            let currentPos = queue.shift();
            let currentX = currentPos.x;
            let currentY = currentPos.y;
            let isValid = this.checkValidPutBuilding(building, currentX, currentY);
            if (isValid) return {x: currentX, y: currentY}

            //add 4 neighbor of current pos to queue
            let dx = [0, 0, -1, 1];
            let dy = [-1, 1, 0, 0];
            for (let i = 0; i < 4; i++) {
                let nextX = currentX + dx[i];
                let nextY = currentY + dy[i];

                if (nextX < 0 || nextX >= 40 || nextY < 0 || nextY >= 40) continue;

                if (visited[nextX] == null) visited[nextX] = [];
                if (visited[nextX][nextY] == null) {
                    visited[nextX][nextY] = true;
                    queue.push({x: nextX, y: nextY});
                }
            }
        }

        return null;
    },

    getChosenBuilding: function () {
        return this.chosenBuilding;
    },
});

