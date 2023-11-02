var BattleEndLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        var node = CCSUlties.parseUIFile(res_ui.BATTLE_END);
        node.setContentSize(cc.winSize);
        ccui.helper.doLayout(node);

        this.iconWin = node.getChildByName("icon_win");
        this.iconLose = node.getChildByName("icon_lose");

        this.star1 = node.getChildByName("star1_win");
        this.star2 = node.getChildByName("star2_win");
        this.star3 = node.getChildByName("star3_win");

        this.goldText = node.getChildByName("text_gold");
        this.elixirText = node.getChildByName("text_elixir");
        this.trophyText = node.getChildByName("text_trophy");

        this.troopItem = node.getChildByName("node_troop_item");

        this.homeBtn = node.getChildByName("button_home");

        this.homeBtn.addClickEventListener(this.onClickHome.bind(this));

        this.addChild(node);
    },

    show: function () {
        const starAmount = BattleManager.getInstance().starAmount;
        const isWin = starAmount > 0;
        const gold = BattleManager.getInstance().robbedGold;
        const elixir = BattleManager.getInstance().robbedElixir;
        const trophy = isWin ? BattleManager.getInstance().winPoint : BattleManager.getInstance().losePoint;

        this.iconWin.setVisible(isWin);
        this.iconLose.setVisible(!isWin);

        this.star1.setVisible(starAmount > 0);
        this.star2.setVisible(starAmount > 1);
        this.star3.setVisible(starAmount > 2);

        this.goldText.setString(gold);
        this.elixirText.setString(elixir);
        this.trophyText.setString(isWin ? trophy : ("-" + trophy));

        this.setVisible(true);
    },

    onClickHome: function () {
        cc.director.getRunningScene().goToGameScene();
    },

});