var TestScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        cc.log("INIT SCENE");


        // cc.eventManager.addListener({
        //     event: cc.EventListener.KEYBOARD,
        //
        //     onKeyPressed: function (keyCode, event) {
        //         if (keyCode === cc.KEY.space) {
        //             for (let i = 1000; i < 2000; i++) {
        //                 testnetwork.connector.sendLoginRequest(i);
        //             }
        //         }
        //     }
        // },this);


        cc.eventManager.addListener({

            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            swallowTouches: true,

            onTouchBegan: function (event) {
                return true;
            },
            onTouchEnded: function () {
                testnetwork.connector.sendEndGame({
                    result: true,
                    stars: 3,
                    trophy: 16,
                    goldGot: 123,
                    elixirGot: 170,
                    army: {
                        "ARM_1": 1
                    }
                })
                return true;
            }

        }, this);


    },

    testTroop: function (touch) {

    },


})