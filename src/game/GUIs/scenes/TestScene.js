var TestScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.log("INIT SCENE")


        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,

            onTouchBegan: function (event) {
              testnetwork.connector.sendBattleMatching()
                return true;
            },

        }, this);



    },

    testTroop: function (touch) {

    },


})