var TroopListItem = cc.Node.extend({
    _troopCfgId: null,
    _level: 1,
    _space: null,
    _count: 0,
    ctor: function (troopCfgId, curPage, i) {

        this._super();
        this._i = i;
        this._troopCfgId = troopCfgId;
        this._curPage = curPage;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._nodeButton = node.getChildByName("troop_item_button")
        this._node = this._nodeButton.getChildByName("troop_item");
        this._cost = TROOP[this._troopCfgId][this._level]["trainingElixir"];
        this._curBarrack = ArmyManager.Instance().getBarrackList()[curPage];
        this._barrackRequired = TROOP_BASE[this._troopCfgId]["barracksLevelRequired"];
        this._troopImage = this._node.getChildByName("troop_image");

        // this._nodeShadow =   CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM).getChildByName("troop_item_button").getChildByName("troop_item");
        // this._troopImageShadow =   CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM).getChildByName("troop_item_button").getChildByName("troop_item");
        // ColorUlties.setGrayObjects([this._nodeShadow, this._troopImageShadow])

        this.loadData();

        let item = this;
        // cc.eventManager.addListener(clickEventListener(item.handleTrainTroop.bind(item)).clone(), item._nodeButton);
        this._nodeButton.addClickEventListener(this.handleTrainTroop.bind(this))
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE + this._curPage, this.handleCancleTroopTraining.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN_SUCCESS + this._curPage, (event) => {
            let count = event.data.count;
            let cfgId = event.data.cfgId;
            if (cfgId === item._troopCfgId) {
                item.setCount(item._count - count);
            }
        });
        cc.eventManager.addCustomListener(TRAINING_EVENTS.DONE_NOW + this._curPage, (event) => {
            this.setCount(0);
        });

        cc.eventManager.addCustomListener(EVENT_NAMES.RESOURCE_CHANGED, (e) => {
            this.recheck();
        })
        this.recheck();
        this.addChild(node);
    },

    recheck: function () {
        this.checkAvailable();
        this.setCostDisplay()
    },

    checkAvailable: function () {

        this._available = TROOPS_LIST[this._i].available && (this._barrackRequired >= this._curBarrack._level);

        let price = TROOP[this._troopCfgId][1]["trainingElixir"];
        if (!this._available) {
            // this._node.getParent().replaceChild(this._nodeShadow, this._node);
            // this._troopImage.getParent().replaceChild(this._troopImageShadow, this._troopImage);
            ColorUlties.setGrayObjects([this._node, this._troopImage])
        } else {
            // this._troopImage, this._node
        }
        if (PlayerInfoManager.Instance().getResource("elixir") < price) {
            this._available = false;
            let costContainer = this._node.getChildByName("cost_container");
            costContainer.getChildByName("cost").setColor(COLOR_SHOP_RED);
        } else {
            let costContainer = this._node.getChildByName("cost_container");
            costContainer.getChildByName("cost").setColor(COLOR_SHOP_WHITE);
        }

    },

    setCostDisplay: function () {
        let costContainer = this._node.getChildByName("cost_container")
        if (this._barrackRequired <= this._curBarrack._level) {
            let costString = costContainer.getChildByName("cost");
            costString.setString(this._cost);
        } else {
            costContainer.setVisible(false);
            let barRequired = this._node.getChildByName("bar_required");
            barRequired.setVisible(true);
            let barRqString = barRequired.getChildByName("bar_rq_string");
            let label = new cc.LabelBMFont("Yêu cầu\nNhà lính cấp " + this._barrackRequired, res.FONT.FISTA["16"], 120, cc.TEXT_ALIGNMENT_CENTER);
            label.setColor(cc.color(181, 26, 0))
            barRqString.addChild(label);
        }
    },


    loadData: function () {
        let icon = this._node.getChildByName("troop_image");
        icon.setTexture(TROOP_BIG_ICON_BASE_URL + this._troopCfgId + ".png");

        let infoButton = this._node.getChildByName("button_info");
        infoButton.addClickEventListener(this.handleClickTroopInfo.bind(this));


        let levelString = this._node.getChildByName("level");
        levelString.setString(this._level);

    },

    handleClickTroopInfo: function () {
        cc.log("CLICK TROOP INFO")

    },

    handleCancleTroopTraining: function (event) {
        let troopCfgId = event.data.cfgId;
        if (this._troopCfgId === troopCfgId) {
            this.setCount(this._count - 1);
        }
    },

    setCount: function (count) {
        cc.log("SETCOUNT ", this._count)
        this._count = count;
        let countString = this._node.getChildByName("count_string");
        if (count > 0) {
            countString.setString("x" + count);
        } else {
            countString.setString("");
        }
    },

    increaseCount: function (count) {
        this._count += count;
        cc.log("INCREASE ", this._count)
        this.setCount(this._count);
    },

    handleTrainTroop: function (isHold = false) {
        cc.log("CREATE TROOP ::: " + this._troopCfgId + " PAGE :" + this._curPage)

        if (this._available) {
            let barList = ArmyManager.Instance().getBarrackList();
            let currentSpace = barList[this._curPage].getTrainingSpace();
            let maxSpace = barList[this._curPage].getMaxSpace();
            if (currentSpace + TROOP_BASE[this._troopCfgId]["housingSpace"] <= maxSpace) {
                let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN + this._curPage);
                let cfgId = this._troopCfgId;
                event.data = {cfgId: cfgId, count: 1, hold: isHold};
                cc.eventManager.dispatchEvent(event);
            }
        }
    },


})