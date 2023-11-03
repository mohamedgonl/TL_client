var MatchHistoryItem = cc.Node.extend({
    ctor: function (data) {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.MATCH_HISTORY_ITEM);
        this._enemyName = node.getChildByName("enemy_name");
        this._time = node.getChildByName("time");
        this._troopList = node.getChildByName("troop_list");
        this._result = node.getChildByName("result_label");
        this._percentage = node.getChildByName("percentage");
        this._elxirGot = node.getChildByName("elixir_got");
        this._goldGot = node.getChildByName("gold_got");
        this._trophy = node.getChildByName("trophy");
        this._stars = node.getChildByName("stars");
        this.setScaleX(1.15);
        this.initData(data);
        this.addChild(node);
    },
    initData : function (data) {
        cc.log(JSON.stringify(data))
        this._enemyName.setString(data.enemyName);
        this._time.setString(fr.getTimeDifferenceString(TimeManager.getInstance().getCurrentTimeInSecond(), data.time));
        this._result.setString(data.isWin ? "CHIẾN THẮNG": "THẤT BẠI");
        this._percentage.setString(data.percentage*100 + "%");
        this._elxirGot.setString(data.elixirGot);
        this._goldGot.setString(data.goldGot);
        this._trophy.setString(data.isWin?"":"-" + data.trophy);

        data.troops.map(troop => {
            let troopItem = new TroopItem(troop.cfgId, troop.count);
            this._troopList.addChild(troopItem);
            troopItem.setPosition(MATCH_DETAIL_TROOP_POS.x, MATCH_DETAIL_TROOP_POS.y);
        })
    }
})


let TroopItem = cc.Node.extend({
    ctor: function (cfgId, count) {
        this._super();
        this._troopCfgId = cfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_TRAINING_ITEM);
        this._node = node.getChildByName("bg");
        this._node.getChildByName("sub_icon").setVisible(false);
        this._node.getChildByName("count_string").setString(count)
        this.loadData();
        this.addChild(node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_icon");
        icon.loadTexture(TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);
    },


})