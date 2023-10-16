

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

    getMapLayer : function () {
        return this.mapLayer;
    },
    getInfoLayer : function () {
        return this.infoLayer;
    },
    onReceiveUserInfo: function (userInfo) {
        cc.log("ON RECEIVE USER INFO ++++++++++++++++++++++ GAMESCENE")
        PlayerInfoManager.Instance().setPlayerInfo({
            name: userInfo.name,
            avatar: userInfo.avatar,
            level: userInfo.level,
            rank: userInfo.rank
        });
        PlayerInfoManager.Instance().setResource({
            gold: userInfo.gold,
            elixir: userInfo.elixir,
            gem: userInfo.gem,
        });
    },



    onBuyResourceSuccess: function (data) {
        cc.log("ON BUY SUCCESS  ++++++++++++++++++++++")
        PlayerInfoManager.Instance().setResource(data);
    }

});
