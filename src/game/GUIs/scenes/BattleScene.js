var BattleScene = cc.Scene.extend({
    battleLayer: null,
    popUpLayer: null,
    tick: 0,

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
        this.schedule(this.gameLoop, 1 / 20);
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

    countDown: function () {
        if (this.timeLeft <= 0) {
            if (this.battleStatus === BATTLE_STATUS.PREPARING)
                this.onStartBattle();
            else if (this.battleStatus === BATTLE_STATUS.HAPPENNING)
                this.onEndBattle();
        }
        this.setTimeLeft(this.timeLeft - 1);
    },

    stopCountDown: function () {
        this.unschedule(this.countDown);
    },

    setTimeLeft: function (timeLeft){
        this.timeLeft = timeLeft;
        this.battleUILayer.setTimeLeft(timeLeft);
    },

    onStartBattle: function () {
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.START_BATTlE, tick: this.tick,});
        this.battleStatus = BATTLE_STATUS.HAPPENNING;
        this.setTimeLeft(BATTlE_LIMIT_TIME + 1);
        this.battleUILayer.onStartBattle();
    },

    onDropTroop: function (data) {
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.DROP_TROOP, tick: this.tick, data});
    },

    onEndBattle: function () {
        //send action end game
        // testnetwork.connector.sendDoAction({
        //     type: 0,
        //     tick: this.tick,
        // });
        this.stopCountDown();
        this.battleStatus = BATTLE_STATUS.END;
    },

    onFindMatch: function () {
        let currentGold = PlayerInfoManager.getInstance().getResource("gold");
        if (currentGold < GOLD_FIND_MATCH) {
            BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ vàng để tìm trận đấu!");
            return;
        }
        const loadingView = new Loading(Loading.START);
        this.stopCountDown();
        this.addChild(loadingView);

        BattleManager.getInstance().resetState();
        this.battleLayer.resetState();

        const self = this;
        loadingView.startLoading(function () {
            testnetwork.connector.sendFindMatch();
            loadingView.removeFromParent(true);
            self.loadingView = new Loading(Loading.STOP);
            self.addChild(self.loadingView);
        });
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

        this.timeLeft = BATTlE_PREPARE_TIME;
        this.battleStatus = BATTLE_STATUS.PREPARING;
        this.battleUILayer.setTimeLeft(this.timeLeft);
        this.schedule(this.countDown, 1);
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
        this.tick++;
    },
});
