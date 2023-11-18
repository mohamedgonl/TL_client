var BattleScene = cc.Scene.extend({
    battleLayer: null,
    popUpLayer: null,
    tick: 0,
    secPerTick: Math.round(1.0 / BATTLE_FPS * 1e6) / 1e6,

    ctor: function () {
        this._super();
        PlayerInfoManager.releaseInstance();
        MapManager.releaseInstance();
        ArmyManager.releaseInstance();
        TimeManager.releaseInstance();
        BattleManager.releaseInstance();
        LogUtils.reset();

        this.init();
        BattleManager.getInstance().battleScene = this;
        this.schedule(this.gameLoop, this.secPerTick);
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
                this.onEndBattle(1);
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
        this.setTick(0)
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.START_BATTlE, tick: this.tick,});
        BattleManager.getInstance().onStartBattle();
        this.setTimeLeft(BATTlE_LIMIT_TIME + 1);
        this.battleUILayer.onStartBattle();
    },

    onDropTroop: function (data) {
        testnetwork.connector.sendDoAction({type: ACTION_TYPE.DROP_TROOP, tick: this.tick, data});
    },

    onEndBattle: function (delay = 0) {

        //dispatch event end battle
        let event = new cc.EventCustom(EVENT_NAMES.END_BATTLE);
        cc.eventManager.dispatchEvent(event);

        //send action end game
        if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.HAPPENNING) {

            this.unschedule(this.gameLoop);
            //send action end
            const starAmount = BattleManager.getInstance().starAmount;
            const robbedGold = BattleManager.getInstance().robbedGold;
            const robbedElixir = BattleManager.getInstance().robbedElixir;
            const trophyAmount = starAmount > 0 ? BattleManager.getInstance().winPoint : BattleManager.getInstance().losePoint;
            const listTroops = BattleManager.getInstance().getListUsedTroops();
            let percentage = BattleManager.getInstance().getDestroyedPercentage();

            // testnetwork.connector.sendEndBattle({
            //     result: starAmount > 0,
            //     starAmount,
            //     trophyAmount,
            //     robbedGold,
            //     robbedElixir,
            //     listTroops,
            //     tick: this.tick,
            //     percentage,
            // });
            testnetwork.connector.sendDoAction({type: ACTION_TYPE.END_BATTLE, tick: this.tick,});

            this.stopCountDown();
            BattleManager.getInstance().onEndBattle();

            //scheduleOnce
            if (delay > 0) {
                const self = this;
                this.schedule(function () {
                    self.battleUILayer.onEndBattle();
                    self.battleEndLayer.show();
                }, delay, 0, 0);
            } else {
                this.battleUILayer.onEndBattle();
                this.battleEndLayer.show();
            }
            LogUtils.writeFile();
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
        BattleManager.getInstance().loadFromServer(data);

        this.battleLayer.onLoadDataSuccess();
        this.battleUILayer.onLoadDataSuccess();
        this.loadingView.stopLoading();

        this.timeLeft = BATTlE_PREPARE_TIME;
        this.battleUILayer.setTimeLeft(this.timeLeft);

        this.schedule(this.countDown, 1);
    },

    onFindMatchFail: function (errorCode) {
        cc.director.runScene(new GameScene());
    },

    goToGameScene: function () {
        const loadingView = new Loading(Loading.START);
        this.addChild(loadingView);
        loadingView.startLoading(function () {
            cc.director.runScene(new GameScene());
        })
    },

    gameLoop: function (dt) {
        if (BattleManager.getInstance().battleStatus === BATTLE_STATUS.HAPPENNING) {
            //check defences targets
            const listDefences = BattleManager.getInstance().getListDefences();
            const listTroops = BattleManager.getInstance().getListCurrentTroops();
            const listBullets = BattleManager.getInstance().getListBullets();
            const listTroopBullets = BattleManager.getInstance().getListTroopBullets();
            for (let defence of listDefences) {
                if (defence.isDestroy()) {
                    continue;
                }
                defence.validateCurrentTarget();
                if (defence.hasTarget())
                    continue;
                for (let troop of listTroops) {
                    if (!troop.isAlive()) continue;
                    if (defence.checkTarget(troop)) {
                        LogUtils.writeLog("check target :" + this.tick)
                        defence.setTarget(troop);
                        break;
                    }
                }
            }

            for (let defence of listDefences) {
                if (!defence.isDestroy())
                    defence.gameLoop(this.secPerTick);
            }
            for (let bullet of listBullets) {
                if (bullet.active)
                    bullet.gameLoop(this.secPerTick);
            }
            for (let troop of listTroops) {
                troop.gameLoop(this.secPerTick);
            }
            for (let troopBullet of listTroopBullets) {
                if(troopBullet.active)
                    troopBullet.gameLoop(this.secPerTick);
                // else
                // {
                //     listTroopBullets.shift();
                // }
            }
        }
        this.setTick(this.tick + 1)
    },

    setTick: function (tick) {
        this.tick = tick;
        LogUtils.tick = tick;
    }
})

