var TroopListItem = cc.Node.extend({
    ctor: function (troopCfgId, curPage, index) {
        this._super();
        this._troopCfgId = null;
        this._level = 1;
        this._space = null;
        this._count = 0;
        this._tempCount = 0;
        this._isLongPress = false;
        this._index = index;
        this._troopCfgId = troopCfgId;
        this._curPage = curPage;
        let node = CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM);
        this._nodeButton = node.getChildByName("troop_item_button")
        this._node = this._nodeButton.getChildByName("troop_item");
        this._cost = TROOP[this._troopCfgId][this._level]["trainingElixir"];
        this._curBarrack = ArmyManager.getInstance().getBarrackList()[curPage];
        this._barrackRequired = TROOP_BASE[this._troopCfgId]["barracksLevelRequired"];

        // this._nodeShadow =   CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM).getChildByName("troop_item_button").getChildByName("troop_item");
        // this._troopImageShadow =   CCSUlties.parseUIFile(res_ui.TROOPS_LIST_ITEM).getChildByName("troop_item_button").getChildByName("troop_item");
        // ColorUlties.setGrayObjects([this._nodeShadow, this._troopImageShadow])

        this.loadData();

        let item = this;
        // cc.eventManager.addListener(clickEventListener(item.handleTrainTroop.bind(item)).clone(), item._nodeButton);
        this._nodeButton.addTouchEventListener(this.handleTrainTroop.bind(this))
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
            cc.log("RESOURCE_CHANGED")
            this.recheck();
        })

        cc.eventManager.addCustomListener(EVENT_NAMES.BUILDING_UPDATED, (e) => {
            if (this._curBarrack.getId() === e.getUserData().id) {
                this.recheck();
            }
        });
        this.recheck();
        this.addChild(node);

    },

    recheck: function () {
        this.setCostDisplay()
        this.checkAvailable();
    },

    checkAvailable: function () {

        this._available = TROOPS_LIST[this._index].available && (this._barrackRequired <= this._curBarrack._level);
        let price = TROOP[this._troopCfgId][1]["trainingElixir"];
        if (!this._available) {
            this._nodeButton.setOpacity(90);
        } else {
            this._nodeButton.setOpacity(255);
        }
        cc.log(this._troopCfgId + " " + PlayerInfoManager.getInstance().getResource("elixir") + " " + price)
        if (PlayerInfoManager.getInstance().getResource("elixir") < price) {
            this._available = false;
            let costContainer = this._node.getChildByName("cost_container");
            costContainer.getChildByName("cost").setColor(COLOR_REQUIRED_TROOP);
        } else {
            let costContainer = this._node.getChildByName("cost_container");
            costContainer.getChildByName("cost").setColor(COLOR_SHOP_WHITE);
        }

    },

    setCostDisplay: function () {
        let costContainer = this._node.getChildByName("cost_container")
        if (this._barrackRequired <= this._curBarrack._level) {
            let barRequired = this._node.getChildByName("bar_required");
            barRequired.setVisible(false);
            costContainer.setVisible(true);
            let costString = costContainer.getChildByName("cost");
            costString.setString(this._cost);
        } else {
            costContainer.setVisible(false);
            let barRequired = this._node.getChildByName("bar_required");
            barRequired.setVisible(true);
            let barRqString = barRequired.getChildByName("bar_rq_string");
            if(!this.label){
                let label = new cc.LabelBMFont("Yêu cầu\nNhà lính cấp " + this._barrackRequired, res.FONT.FISTA["16"], 120, cc.TEXT_ALIGNMENT_CENTER);
                label.setColor(COLOR_REQUIRED_TROOP)
                barRqString.addChild(label);
                this.label = label;
            }
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
        cc.log("CLICK TROOP INFO");
        if (TROOP_ANIMS_LIST.indexOf(this._troopCfgId) !== -1) {
            let itemInfoLayer = new TroopInfoPopup(this._troopCfgId);
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            popUpLayer.addChild(itemInfoLayer);
        }

    },

    handleCancleTroopTraining: function (event) {
        let troopCfgId = event.data.cfgId;
        if (this._troopCfgId === troopCfgId) {
            this.setCount(this._count - 1);
        }
    },

    setCount: function (count) {
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

    handleTrainTroop: function (sender, type) {
        if(this._available) {
        cc.log("CREATE TROOP ::: " + this._troopCfgId + " PAGE :" + this._curPage)
            if (type === ccui.Widget.TOUCH_BEGAN) {
                this.setScale(BUTTON_TOUCH_SCALE_BIG);
                this.schedule(this.handleLongPress, LONG_PRESS_THRESHOLD);
            }
            if (type === ccui.Widget.TOUCH_ENDED || type === ccui.Widget.TOUCH_MOVED) {
                this.setScale(1);
                this.unschedule(this.handleLongPress);

                this.dispatchTrainEvent(this._isLongPress ? this._tempCount : 1, false, true);

                this._tempCount = 0;
                this._isLongPress = false;
            }
        }
    },

    handleLongPress: function () {
        cc.log("HANDLE  LONG PRESS")
        if (this._available) {
            let barList = ArmyManager.getInstance().getBarrackList();
            let currentSpace = barList[this._curPage].getTrainingSpace();
            let maxSpace = barList[this._curPage].getMaxSpace();
            if (currentSpace + TROOP_BASE[this._troopCfgId]["housingSpace"] <= maxSpace) {
                let action = cc.sequence(cc.scaleTo(LONG_PRESS_THRESHOLD / 2, BUTTON_TOUCH_SCALE_BIG), cc.scaleTo(LONG_PRESS_THRESHOLD, 1))
                this.runAction(action);
                this._tempCount++;
                this._isLongPress = true;
                this.updateResource();
                this.dispatchTrainEvent(1, true, false);
            }
        }
    },

    dispatchTrainEvent: function (count, longPressRunning, longPressEnd) {
        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN + this._curPage);
        let cfgId = this._troopCfgId;
        event.data = {cfgId: cfgId, count: count, longPressRunning: longPressRunning, longPressEnd: longPressEnd};
        cc.eventManager.dispatchEvent(event);
    },

    updateResource: function () {
        let trainCost = TROOP[this._troopCfgId][this._level]["trainingElixir"];
        PlayerInfoManager.getInstance().changeResource("elixir", -trainCost);
    }


})