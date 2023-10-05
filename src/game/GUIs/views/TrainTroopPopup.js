var TrainTroopPopup = cc.Layer.extend({
    _curPage: 0,
    _trainingQueue: null,
    _available: true,

    ctor: function () {
        this._super();
        // test data;
        this._trainingQueue = [];

        let node = CCSUlties.parseUIFile(res_ui.TRAIN_TROOP);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        this._trainPopup = node.getChildByName("train_popup");
        let prevButton = node.getChildByName("button_prev");
        let nextButton = node.getChildByName("button_next");
        let closeButton = node.getChildByName("button_close");
        let doneNowButton = node.getChildByName("button_done_now");

        prevButton.addClickEventListener(this.handleChangePage.bind(this, -1));
        nextButton.addClickEventListener(this.handleChangePage.bind(this, 1));
        closeButton.addClickEventListener(this.handleClosePopup.bind(this));

        cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN, this.handleTrainTroop.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE, this.handleCancleTroopTraining.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.DONE_NOW, this.handleClickDoneNow.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.UPDATE_SPACE, this.updateSpace.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CREATE_TRAIN_SUCCESS,this.onCanCreateTrain.bind(this));

        let trainPopup = node.getChildByName("train_popup");
        this._trainContainer = trainPopup.getChildByName("training_container");

        this.initListTroops();
        this.updateTrainingPopupTitle();

        this._totalTime = this.updateAndGetTotalTrainingTime();

        this.addChild(node);
    },


    initListTroops: function () {

        for (let i = 0; i < TROOPS_LIST.length; i++) {
            let troopCfgId = TROOPS_LIST[i].troopCfgId;
            let available = TROOPS_LIST[i].available && TROOP_BASE[troopCfgId]["barracksLevelRequired"] >= this._barrackList[this._curPage].level;
            let troopItem = new TroopListItem(troopCfgId, available, TROOP_BASE[troopCfgId]["barracksLevelRequired"], this._curPage);
            let indexOfLine = i >= TROOPS_LIST.length/2 ? i-TROOPS_LIST.length/2 : i;
            let posX =  LIST_TROOP_START_POS.x + indexOfLine * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE);
            let posY = i >= TROOPS_LIST.length/2
                ? LIST_TROOP_START_POS.y - TROOP_ITEM_SIZE - TROOP_ITEM_SPACING
                : LIST_TROOP_START_POS.y
            troopItem.setPosition(posX, posY );
            this._trainPopup.addChild(troopItem);
        }
    },


    updateSpace: function (event) {
        this._space = event.data.space;
        this.updateTrainingPopupTitle();
    },



    updateTrainingPopupTitle: function () {
        let barrackList = ArmyManager.Instance().getBarrackList();
        let count = barrackList[this._curPage].getTrainingSpace();
        let popUpTitle = this._trainPopup.getChildByName("title");
        popUpTitle.setString("Nhà lính " + (this._curPage+1) + " (" + count + "/" + ArmyManager.Instance().getTotalSpace() + ")");
    },

    handleChangePage: function (addition) {
        cc.log("handle page change", addition);

        let page = this._curPage + addition;
        if (page <= 0) {
            this._curPage = ArmyManager.Instance().getBarrackList().length;
        } else if (page > ArmyManager.Instance().getBarrackList().length) {
            this._curPage = 1;
        } else {
            this._curPage = page;
        }
        this.updateTrainingPopupTitle();

        // check lại list troop

        // thay đổi
    },

    handleClosePopup: function () {
        let popUp = this;
        PopupEffect.disappear(this, () => {
            popUp.getParent().setVisible(false);
            popUp.setVisible(false);
        })
    },

    handleCancleTroopTraining: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let troopCfgId = event.data.cfgId;
        let trainingQueue = this._trainingQueue;
        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if (trainingQueue[i].getCfgId() === troopCfgId) {
                this.onTrainSuccess(true, troopCfgId );
                let count = trainingQueue[i].getCount();
                if (count === 0) {
                    // sắp xếp lại wait queue
                    for (let j = trainingQueue.length - 1; j > i; j--) {
                        trainingQueue[j].setPositionX(trainingQueue[j - 1].getPosition().x);
                    }
                    trainingQueue[i].removeFromParent();
                    trainingQueue.splice(i, 1);
                }

                if (trainingQueue.length === 0) {
                    this._trainContainer.setVisible(false);
                }
                return;
            }
        }
        cc.log("BUG:::: Handle Cancle Training:::: not found troopcfgId:::", troopCfgId);
    },

    onCanCreateTrain: function (event) {
        cc.log("CAN CREATE TRAIN ::::::::::", event.data.lastTrainingTime);

        let troopCfgId = event.data.cfgId;
        let count = event.data.count || 1;
        let trainingQueue = this._trainingQueue;
        let found = false;

        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if (trainingQueue[i].getCfgId() === troopCfgId) {
                let count = trainingQueue[i].getCount();
                trainingQueue[i].setCount(count + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            // create new waiting troop item;
            let waitingTroop = new TroopTrainingItem(troopCfgId);
            if (trainingQueue.length === 0) {

                this.lastTrainingTime = event.data.lastTrainingTime;

                this._trainContainer.setVisible(true);

                waitingTroop.setPosition(CURRENT_TROOP_TRAINING_POS.x, CURRENT_TROOP_TRAINING_POS.y);

                this.schedule(this.updateTrainTime, 1);

            } else if (trainingQueue.length === 1) {
                waitingTroop.setPosition(FIRST_WAITING_TRAINING_TROOP_POS.x, FIRST_WAITING_TRAINING_TROOP_POS.y);
            } else {
                let lastTroopWaiting = trainingQueue[trainingQueue.length - 1];
                waitingTroop.setPosition(lastTroopWaiting.getPosition().x - TROOP_TRAIN_WAITING_SPACE - TROOP_TRAINING_ITEM_WIDTH, lastTroopWaiting.getPosition().y)
            }
            this._trainContainer.addChild(waitingTroop);
            trainingQueue.push(waitingTroop);
        }

        this._totalTime = this._totalTime + TroopUltis.getTrainingTime(troopCfgId);
        let barList =ArmyManager.Instance().getBarrackList();
        barList[this._curPage].addToTrainingQueue({cfgId: troopCfgId, count: count});

        this.updateTrainingPopupTitle();
        this.updateDoneNowPrice();
        this.updateTotalTimeString();
    },

    handleTrainTroop: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let barrackId = ArmyManager.Instance().getBarrackList()[this._curPage];
        testnetwork.connector.sendRequestTrainingCreate({cfgId: event.data.cfgId, count: event.data.count, barrackId: barrackId});
    },

    updateAndGetTotalTrainingTime: function () {
        let total = 0;
        for (let i = 0; i < this._trainingQueue.length; i++) {
            total += TroopUltis.getTrainingTime(this._trainingQueue[i].getCfgId()) * this._trainingQueue[i].getCount();
        }
        this._totalTime = total;
        return this._totalTime;
    },

    updateTrainTime: function () {
        let curTroopTime = this._trainContainer.getChildByName("current");
        let curTroopTrainTime = TroopUltis.getTrainingTime(this._trainingQueue[0].getCfgId());
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");

        if (!this._available) {
            timeString.setString("DỪNG");
            processBar.setPercent(100);
            this.unschedule(this.updateTrainTime);

        } else {
            let timeLeft = this.lastTrainingTime + curTroopTrainTime - TimeManager.Instance().getCurrentTimeInSecond();
            timeString.setString(timeLeft + "s");

            let processBarPercent = (TimeManager.Instance().getCurrentTimeInSecond() - this.lastTrainingTime) / curTroopTrainTime * 100;
            processBar.setPercent(processBarPercent);
        }

        // update total time
        this._totalTime = this._totalTime - 1;
        this.updateTotalTimeString();

        this.updateDoneNowPrice();


        if (TimeManager.Instance().getCurrentTimeInSecond() >= this.lastTrainingTime + curTroopTrainTime) {
            // this.onTrainSuccess(false, this._trainingQueue[0].getCfgId());
            let barrackId = ArmyManager.Instance().getBarrackList()[this._curPage].getId();
            testnetwork.connector.sendRequestTrainingSuccess({isDoneNow: 0, barrackId: barrackId})
        }
    },

    updateDoneNowPrice: function () {
        // update done now price
        let doneNowPrice = Math.ceil(this._totalTime / 60);
        let buttonDoneNowString = this._trainContainer.getChildByName("button_done_now").getChildByName("done_now_cost");
        buttonDoneNowString.setString(doneNowPrice);
    },

    updateTotalTimeString: function () {
        let totalTimeString = this._trainContainer.getChildByName("total_time_string");
        totalTimeString.setString(this._totalTime + "s");
    },

    onTrainSuccess: function (isCancle , cfgId) {
        cc.log("CFG ID IN ontrain success :::::", cfgId);
        if (!isCancle) {
            this.removeFirstTroop();
        } else {
            this.updateAndGetTotalTrainingTime();
            this.updateTrainTime();
        }

        this.lastTrainingTime = TimeManager.Instance().getCurrentTimeInSecond();

        if (this._trainingQueue.length === 0) {
            this._trainContainer.setVisible(false);
            this.unschedule(this.updateTrainTime);
        } else {
            let curTroopTime = this._trainContainer.getChildByName("current");
            let processBar = curTroopTime.getChildByName("current_process");
            let timeString = curTroopTime.getChildByName("current_time_string");
            processBar.setPercent(0);
            let troopTrainTime = TroopUltis.getTrainingTime(this._trainingQueue[0].getCfgId());
            timeString.setString(troopTrainTime + "s");
        }
        let currentBarrack = ArmyManager.Instance().getBarrackList()[this._curPage];
        currentBarrack.removeFromTrainingQueue({cfgId: cfgId, count: 1, currentTime: this.lastTrainingTime});

        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN_SUCCESS);
        event.data = {count: 1, cfgId: cfgId};
        cc.eventManager.dispatchEvent(event);
        this.updateTrainingPopupTitle();

    },


    removeFirstTroop: function () {
        let cfgId = this._trainingQueue[0].cfgId;
        if (this._trainingQueue[0].getCount() > 1) {
            this._trainingQueue[0].setCount(this._trainingQueue[0].getCount() - 1);
        } else {
            for (let i = this._trainingQueue.length - 1; i > 0; i--) {
                this._trainingQueue[i].setPositionX(this._trainingQueue[i - 1].getPosition().x);
            }
            this._trainingQueue[0].removeFromParent();
            this._trainingQueue.splice(0, 1);
        }
        return cfgId;
    },

    handleClickDoneNow: function () {

    }

})