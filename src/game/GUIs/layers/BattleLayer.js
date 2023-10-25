var BattleLayer = cc.Layer.extend({
    ctor: function () {

        this._super();
        this.setAnchorPoint(0, 0);
        //create label hello world at 0,0
        this.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.tempPosChosenBuilding = {
            x: 0,
            y: 0
        }
        this.init();
    },
    //init map layer with scale, add event, load background, load building
    init: function () {
        this.initBackground();
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

});

