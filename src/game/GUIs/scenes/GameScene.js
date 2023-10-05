

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
        ConfigManager.Instance();
        this.armyManager= ArmyManager.Instance();

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
        PlayerInfoManager.Instance().setResource(data);
    }

});
