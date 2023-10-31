var BattleScene = cc.Scene.extend({
    battleLayer: null,
    popUpLayer: null,

    ctor: function () {
        this._super();
        PlayerInfoManager.releaseInstance();
        MapManager.releaseInstance();
        ArmyManager.releaseInstance();
        TimeManager.releaseInstance();
        BattleManager.releaseInstance();

        // BattleManager.getInstance().loadFromServer(MapManager.getInstance().getAllBuilding());
        this.init();
        BattleManager.getInstance().battleScene = this;
        this.schedule(this.gameLoop, 1/20);
    },

    init: function () {
        //load config and resource
        LoadManager.getInstance();
        // this.armyManager = ArmyManager.getInstance();

        this.battleLayer = new BattleLayer();
        this.battleUILayer = new BattleUILayer();
        this.loadingView = new Loading(Loading.STOP);
        this.popUpLayer = new PopupLayer();

        this.addChild(this.battleLayer);
        this.addChild(this.battleUILayer);
        this.addChild(this.loadingView);
        this.addChild(this.popUpLayer);
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    onFindMatchSuccess: function (data) {
        cc.log("onLoadDataSuccess::::::::::::::::::::::::::::")
        BattleManager.getInstance().loadFromServer(data);
        PlayerInfoManager.getInstance().setResource({
            gold: data.gold,
            elixir: data.elixir,
            gem: data.gem,
        });
        PlayerInfoManager.getInstance().setMaxResource({
            gold: data.goldCapacity,
            elixir: data.elixirCapacity,
        });
        this.battleLayer.onLoadDataSuccess();
        this.battleUILayer.onLoadDataSuccess();
        this.loadingView.stopLoading();
    },

    onFindMatchFail: function (errorCode) {
        cc.log("Find match fail: " + errorCode);
    },

    gameLoop: function (dt) {
        this.battleLayer.gameLoop(dt);
        for (let defence of BattleManager.getInstance().listDefences) {
            defence.gameLoop(dt);
        }
        for (let bullet of BattleManager.getInstance().listBullets) {
            bullet.gameLoop(dt);
        }
    },
});
