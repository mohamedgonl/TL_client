var MapLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        cc.log("hahahehe")
        this.addEvent();
        this.initBackground();
        //add image background
        // var background = new cc.Sprite("res/guis/map/test.png");
        // background.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        // this.addChild(background);
        //function create sprite in 4 corner
    },

    addEvent: function () {
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (touch, event) {
                cc.log("touch began");
                this.test(touch);
                return true;
            }.bind(this),

            onTouchEnded: function (touch, event) {
                cc.log("touch ended");
                return true;
            },

            onTouchMoved: function (touch, event) {
                this.moveView(touch.getDelta());
                return true;
            }.bind(this)
        }, this);

        //scale by scroll
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseScroll: this.onMouseScroll.bind(this)
        }, this);
    },
    onMouseScroll: function (event) {
        //zoom max x2 and min x0.5, zoom step 0.1, zoom at mouse position
        var delta = event.getScrollY();
        var scale = this.getScale();
        if (delta < 0) {
            scale += 0.02;
            if (scale > 1) {
                scale = 1;
            }
        }
        else {
            scale -= 0.02;
            if (scale < 0.2) {
                scale = 0.2;
            }
        }
        this.setScale(scale);
    },

    moveView: function (delta) {
        // cc.log("move view");
        var currentPos = this.getPosition();
        var newPos = cc.pAdd(currentPos, delta);
        this.setPosition(newPos);

    },

    test: function (touch) {
        var locationInWorld = touch.getLocation();
        //get location touch in map
        var locationInMap = cc.pSub(locationInWorld, this.getPosition());
        var originX = cc.winSize.width/2;
        var originY = cc.winSize.height/2;
        var x = (locationInMap.x - originX) /this.getScale();
        var y = (locationInMap.y - originY) / this.getScale();

    },

    initBackground: function () {
        //load tmx file 42X42 map
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

        backgroundUpLeft.setPosition(cc.winSize.width/2+1, cc.winSize.height/2-1);
        backgroundUpRight.setPosition(cc.winSize.width/2-1, cc.winSize.height/2-1);
        backgroundDownLeft.setPosition(cc.winSize.width/2+1, cc.winSize.height/2+1);
        backgroundDownRight.setPosition(cc.winSize.width/2-1, cc.winSize.height/2+1);

        this.addChild(backgroundUpLeft);
        this.addChild(backgroundUpRight);
        this.addChild(backgroundDownLeft);
        this.addChild(backgroundDownRight);

        backgroundUpLeft.setScale(SCALE_BG);
        backgroundUpRight.setScale(SCALE_BG);
        backgroundDownLeft.setScale(SCALE_BG);
        backgroundDownRight.setScale(SCALE_BG);
    }

    //function create create a sprite int 1000,550



});
