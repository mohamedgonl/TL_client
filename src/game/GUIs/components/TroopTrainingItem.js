var TroopTrainingItem = cc.Node.extend({
    _troopCfgId: null,
    ctor: function (cfgId) {
        this._super();
        this._troopCfgId = cfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_TRAINING_ITEM);
        this._node = node.getChildByName("bg");
        cc.eventManager.addListener(clickEventListener(this.handleCancleTroopTraining.bind(this)), this._node);
        this.loadData();
        this.addChild(node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_icon");
        icon.loadTexture(TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);
    },

    handleCancleTroopTraining: function () {

    }
})