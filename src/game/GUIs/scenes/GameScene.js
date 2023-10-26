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
        this.armyManager = ArmyManager.Instance();

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if (keyCode == cc.KEY.s) {
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

        this.setVisible(false);
        //send request to server
        testnetwork.connector.sendGetUserInfo();
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    getMapLayer: function () {
        return this.mapLayer;
    },
    getInfoLayer: function () {
        return this.infoLayer;
    },

    onBuyResourceSuccess: function (data) {
        PlayerInfoManager.Instance().setResource(data);
    },

    onReceiveUserInfo: function (userInfo) {
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

        testnetwork.connector.sendGetArmyInfo();
    },

    onReceiveArmyInfo: function (armyInfo) {
        // MapManager.Instance().loadFromServer(armyInfo.listTroops);
        // cc.log("NHAN THONG TIN VE LINH : "+JSON.stringify(armyInfo.listTroops))
        ArmyManager.Instance().setArmyAmount(armyInfo.listTroops);
        testnetwork.connector.sendGetMapInfo();
    },

    onReceiveMapInfo: function (mapInfo) {
        MapManager.Instance().loadFromServer(mapInfo.listBuildings);
        testnetwork.connector.sendGetTimeServer();
    },
    onReceiveTimeServer: function (time) {
        TimeManager.Instance().setDeltaTimeClientServer(time);
        this.onReceiveAllData();
    },

    onReceiveAllData: function () {
        cc.log("onReceiveAllData");
        this.mapLayer.init();
        this.infoLayer.loadResources();

        this.setVisible(true);
    },

});
