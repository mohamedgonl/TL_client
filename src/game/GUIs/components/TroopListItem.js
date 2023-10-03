var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    _count: 0,
    ctor: function (troopCfgId) {
        this._super();
        this._troopCfgId = troopCfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._node = node.getChildByName("troop_item");
        cc.eventManager.addListener(clickEventListener(this.handleTrainTroop.bind(this)).clone(), this._node);
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE, this.handleCancleTroopTraining.bind(this));

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
        cc.log("CLICK TROOP INFO")

    },

    handleCancleTroopTraining : function (event) {
        let troopCfgId = event.data.cfgId;
        if(this._troopCfgId === troopCfgId) {
            this.setCount(this._count - 1);
        }
    },

    setCount : function (count) {
        this._count = count;
        let countString = this._node.getChildByName("count_string");
        if(count > 0) {
            countString.setString("x"+count);
        }
        else {
            countString.setString("");
        }
    },

    handleTrainTroop: function () {
        this.setCount(this._count+1);
        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN);
        let cfgId = this._troopCfgId;
        event.data = {cfgId: cfgId};
        cc.eventManager.dispatchEvent(event);
    },


})