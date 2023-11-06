let TroopItem = cc.Node.extend({
    ctor: function (cfgId, count) {
        this._super();
        this._troopCfgId = cfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_TRAINING_ITEM);
        this._node = node.getChildByName("bg");
        this._node.getChildByName("sub_icon").setVisible(false);
        this._node.getChildByName("count_string").setString("x" + count);
        this.loadData();
        this.addChild(node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_icon");
        icon.loadTexture(TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);
    },

})