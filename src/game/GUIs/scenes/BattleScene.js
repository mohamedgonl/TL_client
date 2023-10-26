var BattleScene = cc.Scene.extend({
    battleLayer: null,
    popUpLayer: null,

    ctor: function () {
        this._super();
        BattleManager.Instance().loadFromServer(MapManager.Instance().getAllBuilding());
        this.init();
        // BattleManager.Instance().gameScene = this;
    },

    init: function () {
        //load config and resource
        LoadManager.Instance();
        // this.armyManager = ArmyManager.Instance();

        this.battleLayer = new BattleLayer();
        this.battleUILayer = new BattleUILayer();
        // this.battleInfoLayer = new BattleInfoLayer();
        // this.infoLayer = new InfoLayer();
        // this.popUpLayer = new PopupLayer();
        // this.popUpLayer.setVisible(false);

        this.addChild(this.battleLayer);
        this.addChild(this.battleUILayer);
        // this.addChild(this.battleInfoLayer);
        // this.addChild(this.infoLayer);
        // this.addChild(this.popUpLayer)

    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    onFindMatchSuccess: function (data) {
        BattleManager.Instance().loadFromServer(data);
        PlayerInfoManager.Instance().setResource({
            gold: data.gold,
            elixir: data.elixir,
            gem: data.gem,
        });
        PlayerInfoManager.Instance().setMaxResource({
            gold: data.goldCapacity,
            elixir: data.elixirCapacity,
        });
        this.battleLayer.onLoadDataSuccess();
        this.battleUILayer.onLoadDataSuccess();
    },

    onFindMatchFail: function (errorCode) {
        cc.log("Find match fail: " + errorCode);
    },
});
