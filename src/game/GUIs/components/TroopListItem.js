var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    ctor: function (troopCfgId) {
        this._super();
        this._troopCfgId = troopCfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._node = node.getChildByName("troop_item");

        this.loadData();
        // this.addChild(this._node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_image");
        cc.log("ICON IMAGE ::::::", icon)
        icon.loadTexture(TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");
        cc.log("ICON URL :::::: ", TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");

        let infoButton = this._node.getChildByName("button_info");
        infoButton.addClickEventListener(this.handleClickTroopInfo.bind(this));


        let TROOP = JSON.parse(jsb.fileUtils.getStringFromFile(res_cf.TROOP));


        let costString = this._node.getChildByName("cost_container").getChildByName("cost");
        let cost = TROOP[this._troopCfgId][this._level]["trainingElixir"];
        costString.setString(cost);

        let levelString = this._node.getChildByName("level");
        levelString.setString(this._level);

    },



    handleClickTroopInfo: function () {

    }
})