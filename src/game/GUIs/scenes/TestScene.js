var TestScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.log("INIT SCENE")


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
                this.testTroop(event);
                return true;
            }.bind(this),


        }, this);



    },

    testTroop: function (touch) {
        var locationInScreen = touch.getLocation();
        let troop = new Troop("ARM_1",1);
        // troop.setPosition(this.getScreenPosFromGridPos(cc.p(locationInScreen.x, locationInScreen.y)));
        troop.setPosition(locationInScreen.x, locationInScreen.y);
        this.addChild(troop);

        cc.log("ADD TROOP FOR TESTING WITH POSITION X: "+locationInScreen.x + " Y: "+locationInScreen.y)
    },


})