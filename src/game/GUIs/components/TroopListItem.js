var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    _count: 0,
    ctor: function (troopCfgId, available = true, barrackRequired, curBarrack) {
        this._super();
        this._troopCfgId = troopCfgId;
        this._curBarrack = curBarrack;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._node = node.getChildByName("troop_item");

        if(available) {
            cc.eventManager.addListener(clickEventListener(this.handleTrainTroop.bind(this)).clone(), this._node);
            cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE, this.handleCancleTroopTraining.bind(this));
        }
        else {
            // this._node.setColor(cc.color(56,56,56));
            this._node.setOpacity(128)
        }

        this.setCostDisplay(available, barrackRequired);

        this.loadData();
        this.addChild(node);
    },

    setCostDisplay :function (available, barrackRequired) {
        let costContainer = this._node.getChildByName("cost_container")
        if(available) {
            let costString =costContainer.getChildByName("cost");
            let cost = TROOP[this._troopCfgId][this._level]["trainingElixir"];
            costString.setString(cost);
        }
        else {
            costContainer.setVisible(false);
            let barRequired = this._node.getChildByName("bar_required");
            barRequired.setVisible(true);
            let barRqString = barRequired.getChildByName("bar_rq_string");
            let label = new cc.LabelBMFont("Yêu cầu\nNhà lính cấp "+ barrackRequired, res.FONT.FISTA["16"], 120, cc.TEXT_ALIGNMENT_CENTER);
            label.setColor(cc.color(255, 0, 0))
            barRqString.addChild(label);
        }
    },



    loadData: function () {
        let icon = this._node.getChildByName("troop_image");
        icon.loadTexture(TROOP_BIG_ICON_BASE_URL+this._troopCfgId+".png");
        icon.ignoreContentAdaptWithSize(true);

        let infoButton = this._node.getChildByName("button_info");
        infoButton.addClickEventListener(this.handleClickTroopInfo.bind(this));


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
        let barList = ArmyManager.Instance().getBarrackList();
        let curentSpace = barList[this._curBarrack].getTrainingSpace();
        let maxSpace = barList[this._curBarrack].getMaxSpace();
        if( curentSpace + TROOP_BASE[this._troopCfgId]["housingSpace"] <= maxSpace) {
            this.setCount(this._count+1);
            let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN);
            let cfgId = this._troopCfgId;
            event.data = {cfgId: cfgId};
            cc.eventManager.dispatchEvent(event);

            testnetwork.connector.sendRequestTrainingCreate({cfgId: cfgId, count: 1, barrackId: barList[this._curBarrack].getId()})
        }
    },


})