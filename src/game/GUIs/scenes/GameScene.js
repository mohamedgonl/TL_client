

var GameScene = cc.Scene.extend({

    mapLayer: null,
    popUpLayer: null,
    ctor: function () {
        this._super();
        this.init();
        MapManager.Instance().gameScene = this;
    },

    init: function () {
        //load config and resource
        LoadManager.Instance();
        this.armyManager= ArmyManager.Instance();

        TimeManager.Instance().setDeltaTimeClientServer();

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if(keyCode == cc.KEY.s)
                {
                    //change visible of popup
                    this.popUpLayer.setVisible(!this.popUpLayer.isVisible());
                }
            }.bind(this)
        }, this);

        this.mapLayer = new MapLayer();
        this.infoLayer = new InfoLayer();
        this.popUpLayer = new PopupLayer();
        this.popUpLayer.setVisible(false);

        this.addChild(this.mapLayer);
        this.addChild(this.infoLayer);
        this.addChild(this.popUpLayer)
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },



    onBuyResourceSuccess: function (data) {
        cc.log("ON BUY SUCCESS  ++++++++++++++++++++++")
        PlayerInfoManager.Instance().setResource(data);
    }

});
