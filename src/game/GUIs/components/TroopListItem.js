var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    ctor: function (troopCfgId) {
        this._super();
        this._troopCfgId = troopCfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._node = node.getChildByName("troop_item");

        // this._node.addTouchEventListener(this.handleClickTroop, this);

        this.loadData();
        this.addChild(node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_image");
        icon.loadTexture(TROOP_BIG_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);

        let infoButton = this._node.getChildByName("button_info");
        infoButton.addClickEventListener(this.handleClickTroopInfo.bind(this));

        let costString = this._node.getChildByName("cost_container").getChildByName("cost");
        let cost = TROOP[this._troopCfgId][this._level]["trainingElixir"];

        costString.setString(cost);

        let levelString = this._node.getChildByName("level");
        levelString.setString(this._level);

    },

    handleClickTroopInfo: function () {

    },

    handleClickTroop: function (sender, type) {
        cc.log("DEBUG ::::", type);
    }


})