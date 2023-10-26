var GameScene = cc.Scene.extend({

    mapLayer: null,
    popUpLayer: null,

    ctor: function () {
        this._super();

        PlayerInfoManager.releaseInstance();
        MapManager.releaseInstance();
        ArmyManager.releaseInstance();
        TimeManager.releaseInstance();

        const mapManager = MapManager.getInstance();
        mapManager.gameScene = this;
        cc.log(" ##############" + mapManager.gameScene)
        this.init();
    },

    init: function () {
        //load config and resource
        LoadManager.getInstance();

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
        this.loadingView = new Loading(Loading.STOP);
        this.popUpLayer.setVisible(false);

        this.addChild(this.mapLayer);
        this.addChild(this.infoLayer);
        this.addChild(this.popUpLayer);
        this.addChild(this.loadingView);

        // this.setVisible(false);
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
        PlayerInfoManager.getInstance().setResource(data);
    },

    onReceiveUserInfo: function (userInfo) {
        PlayerInfoManager.getInstance().setPlayerInfo({
            name: userInfo.name,
            avatar: userInfo.avatar,
            level: userInfo.level,
            rank: userInfo.rank
        });
        PlayerInfoManager.getInstance().setResource({
            gold: userInfo.gold,
            elixir: userInfo.elixir,
            gem: userInfo.gem,
        });

        testnetwork.connector.sendGetArmyInfo();
    },

    onReceiveArmyInfo: function (armyInfo) {
        // MapManager.getInstance().loadFromServer(armyInfo.listTroops);
        // cc.log("NHAN THONG TIN VE LINH : "+JSON.stringify(armyInfo.listTroops))
        ArmyManager.getInstance().setArmyAmount(armyInfo.listTroops);
        testnetwork.connector.sendGetMapInfo();
    },

    onReceiveMapInfo: function (mapInfo) {
        MapManager.getInstance().loadFromServer(mapInfo.listBuildings);
        testnetwork.connector.sendGetTimeServer();
    },
    onReceiveTimeServer: function (time) {
        TimeManager.getInstance().setDeltaTimeClientServer(time);
        this.onReceiveAllData();
    },

    onReceiveAllData: function () {
        cc.log("onReceiveAllData");
        this.mapLayer.init();
        this.infoLayer.loadResources();
        this.popUpLayer.init();
        // this.setVisible(true);
        ArmyManager.getInstance().initTroopSprites();
        this.loadingView.stopLoading();
    },

});
