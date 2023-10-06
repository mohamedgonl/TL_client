var TrainTroopPage = cc.Node.extend({
    _curPage: null,
    _available: true,
    _curBarrack: null,
    _trainingItem: null,
    ctor: function (curPage) {
        this._super();
        this._curPage = curPage;
        this._curBarrack = ArmyManager.Instance().getBarrackList()[this._curPage];
        this._trainingItem = [];

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

    getBarrackId: function () {
      return this._curBarrack.getId();
    },

    initListTroops: function () {


        for (let i = 0; i < TROOPS_LIST.length; i++) {
            let troopCfgId = TROOPS_LIST[i].troopCfgId;
            let available = TROOPS_LIST[i].available && TROOP_BASE[troopCfgId]["barracksLevelRequired"] >= this._curBarrack.level;
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
        let count = this._curBarrack.getTrainingSpace();
        let max = this._curBarrack.getMaxSpace();
        let popUpTitle = this._trainPopup.getChildByName("title");
        popUpTitle.setString("Nhà lính " + (this._curPage+1) + " (" + count + "/" + max + ")");
    },

    handleChangePage: function (addition) {
        let trainPopup = this.getParent();
        trainPopup.changePage(this._curPage+addition);
    },

    handleClosePopup: function () {
        let trainTroopPopup = this.getParent();
        trainTroopPopup.close();
    },

    handleCancleTroopTraining: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let troopCfgId = event.data.cfgId;
        let trainingQueue = this._trainingQueue;
        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if (trainingQueue[i].cfgId === troopCfgId) {
                // this.onTrainSuccess(troopCfgId );
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

    handleTrainTroop: function (event) {
        testnetwork.connector.sendRequestTrainingCreate({cfgId: event.data.cfgId, count: event.data.count, barrackId: this._curBarrack.getId()});
    },

    onCanCreateTrain: function (event) {
        cc.log("ON CAN CREATE TRAIN ::::::::::::::::::::::::::", event.data.cfgId);

        let troopCfgId = event.data.cfgId;
        let count = event.data.count || 1;

        let trainingQueue =  this._curBarrack.getTrainingList();

        let found = this._curBarrack.addToTrainingQueue({cfgId: troopCfgId, count: count});

        if (!found) {
            // create new waiting troop item;
            let waitingTroop = new TroopTrainingItem(troopCfgId);
            if (trainingQueue.length === 1) {
                this._curBarrack.setLastTrainingTime(event.data.lastTrainingTime);
                this._trainContainer.setVisible(true);
                waitingTroop.setPosition(CURRENT_TROOP_TRAINING_POS.x, CURRENT_TROOP_TRAINING_POS.y);

                this.schedule(this.updateTrainTime, 1);

            } else if (trainingQueue.length === 2) {
                waitingTroop.setPosition(FIRST_WAITING_TRAINING_TROOP_POS.x, FIRST_WAITING_TRAINING_TROOP_POS.y);
            } else {
                let lastTroopWaiting = trainingQueue[trainingQueue.length - 1];
                waitingTroop.setPosition(lastTroopWaiting.getPosition().x - TROOP_TRAIN_WAITING_SPACE - TROOP_TRAINING_ITEM_WIDTH, lastTroopWaiting.getPosition().y)
            }
            this._trainingItem.push(waitingTroop);
            this._trainContainer.addChild(waitingTroop);
        }
        else {
            let item = this._trainingItem.find(e => e.getCfgId() === event.data.cfgId);
            item.setCount(item.getCount() + 1);
        }

        this._totalTime = this._totalTime + TroopUltis.getTrainingTime(troopCfgId);
        this.updateTotalTimeString();

        this.updateTrainingPopupTitle();
        this.updateDoneNowPrice();

    },

    updateAndGetTotalTrainingTime: function () {
        let total = 0;
        let trainingQueue = this._curBarrack.getTrainingList();
        for (let i = 0; i < trainingQueue.length; i++) {
            total += TroopUltis.getTrainingTime(trainingQueue[i].cfgId) * trainingQueue[i].getCount();
        }
        this._totalTime = total;
        return this._totalTime;
    },

    updateTrainTime: function () {

        let trainingQueue = this._curBarrack.getTrainingList();
        cc.log("UPDATE TRAIN TIME :::::::::::::::::::::::::::::::::::", trainingQueue.length)
        let curTroopTime = this._trainContainer.getChildByName("current");
        let curTroopTrainTime = TroopUltis.getTrainingTime(trainingQueue[0].cfgId);
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");

        if (!this._available) {
            timeString.setString("DỪNG");
            processBar.setPercent(100);
            this.unschedule(this.updateTrainTime);

        } else {
            let timeLeft = this._curBarrack.getLastTrainingTime() + curTroopTrainTime - TimeManager.Instance().getCurrentTimeInSecond();
            timeString.setString(timeLeft + "s");

            let processBarPercent = (TimeManager.Instance().getCurrentTimeInSecond() - this._curBarrack.getLastTrainingTime()) / curTroopTrainTime * 100;
            processBar.setPercent(processBarPercent);
        }

        // update total time
        this._totalTime = this._totalTime - 1;
        this.updateTotalTimeString();
        this.updateDoneNowPrice();

        if (TimeManager.Instance().getCurrentTimeInSecond() >= this._curBarrack.getLastTrainingTime() + curTroopTrainTime) {
            testnetwork.connector.sendRequestTrainingSuccess({isDoneNow: 0, barrackId: this._curBarrack.getId()})
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

    onTrainSuccess: function (data) {

        this._curBarrack.removeFromTrainingQueue({cfgId: data.cfgId, count: 1, currentTime: data.lastTrainingTime});

        if (this._curBarrack.getTrainingList().length === 0) {
            this._trainContainer.setVisible(false);
            this._trainingItem = [];
            this.unschedule(this.updateTrainTime);
        } else {
            let curTroopTime = this._trainContainer.getChildByName("current");
            let processBar = curTroopTime.getChildByName("current_process");
            let timeString = curTroopTime.getChildByName("current_time_string");
            processBar.setPercent(0);
            let item = this._trainingItem[this._trainingItem.length - 1];
            item.setCount(item.getCount() - 1);
            let troopTrainTime = TroopUltis.getTrainingTime(this._curBarrack.getTrainingList()[0].cfgId);
            timeString.setString(troopTrainTime + "s");
        }

        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN_SUCCESS);
        event.data = {count: 1, cfgId: data.cfgId};
        cc.eventManager.dispatchEvent(event);

        this.updateTrainingPopupTitle();
    },


    handleClickDoneNow: function () {

    }

})