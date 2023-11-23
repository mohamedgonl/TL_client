var MatchHistoryItem = cc.Node.extend({
    ctor: function (data) {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.MATCH_HISTORY_ITEM);
        this._enemyName = node.getChildByName("enemy_name");
        this._time = node.getChildByName("time");
        this._result = node.getChildByName("result_label");
        this._percentage = node.getChildByName("percentage");
        this._elxirGot = node.getChildByName("elixir_got");
        this._goldGot = node.getChildByName("gold_got");
        this._trophy = node.getChildByName("trophy");
        this._stars = node.getChildByName("stars");
        this._replayButton = node.getChildByName("button_replay");
        this._replayButton.addClickEventListener(this.onTouchReplay.bind(this))
        this.setScaleX(1.15);
        // this._node = node;
        this.addChild(node);
        this.initData(data);
    },
    initData: function (data) {
        this.id = data.id;
        this._enemyName.setString(data.enemyName);
        this._time.setString(fr.getTimeDifferenceString(TimeManager.getInstance().getCurrentTimeInSecond(), data.time));
        this._result.setString(data.isWin ? "CHIẾN THẮNG" : "THẤT BẠI");
        this._percentage.setString(data.percentage + "%");
        this._elxirGot.setString(data.elixirGot);
        this._goldGot.setString(data.goldGot);
        this._trophy.setString(data.trophy);

        data.troops.map((troop, index) => {
            let troopItem = new TroopItem(troop.cfgId, troop.count);
            troopItem.setPosition(MATCH_DETAIL_TROOP_POS.x + index * (TROOP_ITEM_WIDTH + TROOP_ITEM_MARGIN), MATCH_DETAIL_TROOP_POS.y);
            this.addChild(troopItem);
        });

        let stars = this._stars.getChildren();
        for (let i = data.stars; i < 3; i++) {
            ColorUlties.setGrayObjects(stars[i]);
        }
    },
    onTouchReplay: function () {
        const loadingView = new Loading(Loading.START);

        MapManager.getInstance().gameScene.addChild(loadingView);

        const matchId = this.id;

        loadingView.startLoading(function () {
            cc.eventManager.removeAllListeners();
            cc.director.runScene(new BattleScene({onReplay: true}));
            testnetwork.connector.sendGetMatchInfo(matchId);
        });
    }
})