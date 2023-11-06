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
        this.battleEndLayer = new BattleEndLayer();
        this.loadingView = new Loading(Loading.STOP);
        this.popUpLayer = new PopupLayer();

        this.battleEndLayer.setVisible(false);
        // this.battleEndLayer.setActive(false);

        this.addChild(this.battleLayer);
        this.addChild(this.battleUILayer);
        this.addChild(this.battleEndLayer);
        this.addChild(this.loadingView);
        this.addChild(this.popUpLayer);
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    countDown: function () {
        if (this.timeLeft <= 0) {
            if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.PREPARING)
                this.onStartBattle();
            else if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.HAPPENNING)
                this.onEndBattle();
        }
        this.setTimeLeft(this.timeLeft - 1);
    },

    stopCountDown: function () {
        this.unschedule(this.countDown);
    },

    setTimeLeft: function (timeLeft) {
        this.timeLeft = timeLeft;
        this.battleUILayer.setTimeLeft(timeLeft);
    },

    onStartBattle: function () {
        if (BattleManager.getInstance().battleStatus !== BATTLE_STATUS.PREPARING)
            return;
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.START_BATTlE, tick: this.tick,});
        BattleManager.getInstance().battleStatus = BATTLE_STATUS.HAPPENNING;
        this.setTimeLeft(BATTlE_LIMIT_TIME + 1);
        this.battleUILayer.onStartBattle();
    },

    onDropTroop: function (data) {
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.DROP_TROOP, tick: this.tick, data});
    },

    onEndBattle: function () {
        //send action end game
        if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.HAPPENNING) {
            //send action end
            const starAmount = BattleManager.getInstance().starAmount;
            const robbedGold = BattleManager.getInstance().robbedGold;
            const robbedElixir = BattleManager.getInstance().robbedElixir;
            const trophyAmount = starAmount > 0 ? BattleManager.getInstance().winPoint : BattleManager.getInstance().losePoint;
            const listTroops = BattleManager.getInstance().getListUsedTroops();
            testnetwork.connector.sendEndBattle({
                result: starAmount > 0,
                starAmount,
                trophyAmount,
                robbedGold,
                robbedElixir,
                listTroops,
                tick: this.tick,
            });

            this.stopCountDown();
            BattleManager.getInstance().battleStatus = BATTLE_STATUS.END;

            const self = this;
            //scheduleOnce
            this.schedule(function () {
                self.battleUILayer.onEndBattle();
                self.battleEndLayer.show();
            }, 1, 0, 0);
        } else if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.PREPARING) {
            this.goToGameScene();
        }
    },

    onFindMatch: function () {
        let currentGold = BattleManager.getInstance().getPlayerResource(RESOURCE_TYPE.GOLD);
        if (currentGold < GOLD_FIND_MATCH) {
            BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ vàng để tìm trận đấu!");
            return;
        }
        const loadingView = new Loading(Loading.START);
        this.stopCountDown();
        this.addChild(loadingView);

        this.battleLayer.resetState();
        BattleManager.getInstance().resetState();

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

        this.battleLayer.onLoadDataSuccess();
        this.battleUILayer.onLoadDataSuccess();
        this.loadingView.stopLoading();

        this.timeLeft = BATTlE_PREPARE_TIME;
        this.battleUILayer.setTimeLeft(this.timeLeft);

        this.schedule(this.countDown, 1);
    },

    onFindMatchFail: function (errorCode) {
        cc.log("Find match fail: " + errorCode);
    },

    goToGameScene: function () {
        const loadingView = new Loading(Loading.START);
        this.addChild(loadingView);
        loadingView.startLoading(function () {
            cc.director.runScene(new GameScene());
        })
    },

    gameLoop: function (dt) {
        this.battleLayer.gameLoop(dt);
        for (let defence of BattleManager.getInstance().listDefences) {
            if (!defence.isDestroy())
                defence.gameLoop(dt);
        }
        for (let bullet of BattleManager.getInstance().listBullets) {
            if (bullet.active)
                bullet.gameLoop(dt);
        }
        for (let troop of BattleManager.getInstance().listCurrentTroop) {
            troop.gameLoop(dt);
        }
        this.tick++;
    },
});
