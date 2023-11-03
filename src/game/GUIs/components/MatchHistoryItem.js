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
        this._time.setString(data.time);

        // troop list

        this._result.setString(data.isWin ? "CHIẾN THẮNG": "THẤT BẠI");
        this._percentage.setString(data.percentage*100 + "%");
        this._elxirGot.setString(data.elixirGot);
        this._goldGot.setString(data.goldGot);
        this._trophy.setString(data.isWin?"":"-" + data.trophy);

    }
})