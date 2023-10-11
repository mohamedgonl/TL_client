var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    _count: 0,
    ctor: function (troopCfgId, available = true, barrackRequired, curPage) {
        this._super();
        this._troopCfgId = troopCfgId;
        this._curPage = curPage;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._node = node.getChildByName("troop_item");
        this._available = available;

        if(available) {
            let item = this;
            cc.eventManager.addListener(clickEventListener(item.handleTrainTroop.bind(item)).clone(), item._node);
            cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE+curPage, this.handleCancleTroopTraining.bind(this));

            cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN_SUCCESS+curPage, (event)=>{
                let count = event.data.count;
                let cfgId = event.data.cfgId;
                if(cfgId === item._troopCfgId) {
                   item.setCount(item._count - count);
                }
            });
        }
        else {
            ColorUlties.setGrayObjects([this._node, ]);

        }
        this.loadData();
        this.setCostDisplay(available, barrackRequired);
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
        icon.setTexture(TROOP_BIG_ICON_BASE_URL+this._troopCfgId+".png");
        if(!this._available) {
            ColorUlties.setGrayObjects(icon)
        }

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

    handleTrainTroop: function (isHold = false) {
        let price = TROOP[this._troopCfgId][1]["trainingElixir"];
        if(PlayerInfoManager.Instance().getResource().elixir >= price) {
            let barList = ArmyManager.Instance().getBarrackList();
            let curentSpace = barList[this._curPage].getTrainingSpace();
            let maxSpace = barList[this._curPage].getMaxSpace();
            if( curentSpace + TROOP_BASE[this._troopCfgId]["housingSpace"] <= maxSpace) {
                let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN+this._curPage);
                let cfgId = this._troopCfgId;
                event.data = {cfgId: cfgId, count: 1, hold: isHold};
                cc.eventManager.dispatchEvent(event);
            }
        }
        else {
            let costContainer = this._node.getChildByName("cost_container");
            costContainer.setColor(COLOR_SHOP_RED);
        }

    },


})