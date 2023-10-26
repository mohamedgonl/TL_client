var BattleScene = cc.Scene.extend({
    battleLayer: null,
    popUpLayer: null,

    ctor: function () {
        this._super();
        BattleManager.getInstance().loadFromServer(MapManager.getInstance().getAllBuilding());
        this.init();
        BattleManager.getInstance().battleScene = this;
    },

    init: function () {
        //load config and resource
        LoadManager.getInstance();
        // this.armyManager = ArmyManager.getInstance();

        this.battleLayer = new BattleLayer();
        this.battleUILayer = new BattleUILayer();
        this.loadingView = new Loading(Loading.STOP);

        this.addChild(this.battleLayer);
        this.addChild(this.battleUILayer);
        this.addChild(this.loadingView);
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    onFindMatchSuccess: function (data) {
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
});
