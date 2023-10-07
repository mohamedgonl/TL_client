var TroopTrainingItem = cc.Node.extend({
    _troopCfgId: null,
    _count : null,
    ctor: function (cfgId) {
        this._super();
        this._troopCfgId = cfgId;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_TRAINING_ITEM);
        this._node = node.getChildByName("bg");
        cc.eventManager.addListener(clickEventListener(this.handleCancleTroopTraining.bind(this)), this._node);
        this.setCount(1);
        this.loadData();
        this.addChild(node);
    },

    loadData: function () {
        let icon = this._node.getChildByName("troop_icon");
        icon.loadTexture(TROOP_SMALL_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);
    },

    handleCancleTroopTraining: function () {
        this.setCount(this._count - 1);
        let event = new cc.EventCustom(TRAINING_EVENTS.CANCLE);
        let cfgId = this._troopCfgId;
        event.data = {cfgId: cfgId};
        cc.eventManager.dispatchEvent(event);
    },

    getCount: function () {
        return this._count;
    },

    setCount : function (count) {
        let countString = this._node.getChildByName("count_string");
        countString.setString("x"+count);
        this._count = count;
    },

    getCfgId:  function () {
        return this._troopCfgId;
    },




})