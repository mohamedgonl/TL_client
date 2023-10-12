var TrainTroopPage = cc.Node.extend({

    ctor: function (curPage) {
        this._super();

        this._curPage = null;
        this._available = true;
        this._curBarrack = null;
        this._trainingItem = null;
        this._timePassed = 0;
        this._isActive = false;
        this._troopListItem = [];

        this._curPage = curPage;
        this._curBarrack = ArmyManager.Instance().getBarrackList()[this._curPage];

        // lưu các sprite nằm trong training container
        this._trainingItem = [];


        let node = CCSUlties.parseUIFile(res_ui.TRAIN_TROOP);
        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);

        this._trainPopup = node.getChildByName("train_popup");
        this._trainContainer = this._trainPopup.getChildByName("training_container");

        let prevButton = node.getChildByName("button_prev");
        let nextButton = node.getChildByName("button_next");
        let closeButton = node.getChildByName("button_close");
        let doneNowButton = this._trainContainer.getChildByName("button_done_now");

        prevButton.addClickEventListener(this.handleChangePage.bind(this, -1));
        nextButton.addClickEventListener(this.handleChangePage.bind(this, 1));
        closeButton.addClickEventListener(this.handleClosePopup.bind(this));

        cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN + this._curPage, this.handleTrainTroop.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE + this._curPage, this.handleCancleTroopTraining.bind(this));
        cc.eventManager.addListener(clickEventListener(this.handleClickDoneNow.bind(this)), doneNowButton);
        cc.eventManager.addCustomListener(TRAINING_EVENTS.UPDATE_SPACE + this._curPage, this.updateSpace.bind(this));


        this.initListTroops();
        this.updateTrainingPopupTitle();

        this.initTotalTrainingTime();
        this.addChild(node);
    },

    initTrainingList: function () {
        let events = []
        this._curBarrack.getTrainingList().map(e => {
            let event = {};
            event.data = {
                cfgId: e.cfgId,
                count: e.count,
                lastTrainingTime: this._curBarrack.getLastTrainingTime(),
                isInit: true
            }
            events.push(event);
        });
        this.onCanCreateTrain(events);
    },

    updateUI: function (time) {
        if (this.checkAvailable()) {
            if (time) this._interval = time;
            this._isActive = true;
            this.schedule(this.updateTrainTime, this._interval);
        }
    },

    stopUpdateUI: function () {
        this._isActive = false;
        this.unschedule(this.updateTrainTime);
    },


    getBarrackId: function () {
        return this._curBarrack.getId();
    },

    initListTroops: function () {
        for (let i = 0; i < TROOPS_LIST.length; i++) {
            let troopCfgId = TROOPS_LIST[i].troopCfgId;
            let troopItem = new TroopListItem(troopCfgId, TROOP_BASE[troopCfgId]["barracksLevelRequired"], this._curPage, i);
            let indexOfLine = i >= TROOPS_LIST.length / 2 ? i - TROOPS_LIST.length / 2 : i;
            let posX = LIST_TROOP_START_POS.x + indexOfLine * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE);
            let posY = i >= TROOPS_LIST.length / 2
                ? LIST_TROOP_START_POS.y - TROOP_ITEM_SIZE - TROOP_ITEM_SPACING
                : LIST_TROOP_START_POS.y
            troopItem.setPosition(posX, posY);
            this._troopListItem.push()
            this._trainPopup.addChild(troopItem);
        }
    },

    checkAvailable: function () {
        let currentSpace = ArmyManager.Instance().getCurrentSpace();
        let maxSpace = ArmyManager.Instance().getMaxSpace();
        if (currentSpace >= maxSpace) {
            this._available = false;
        }

        if (!this._available) {
            let curTroopTime = this._trainContainer.getChildByName("current");
            let processBar = curTroopTime.getChildByName("current_process");
            let timeString = curTroopTime.getChildByName("current_time_string");
            timeString.setString("DỪNG");
            processBar.setPercent(100);
        }
        return this._available;
    },


    updateSpace: function (event) {
        this._space = event.data.space;
        this.updateTrainingPopupTitle();
    },

    updateSpaceAfterTrainLabel: function () {
        let title = this._trainContainer.getChildByName("total_troop_string");
        let currentSpace = ArmyManager.Instance().getCurrentSpace();
        let maxSpace = ArmyManager.Instance().getMaxSpace();
        let barrackCurrentSpace = this._curBarrack.getTrainingSpace();
        title.setString("Tổng số quân sau khi huấn luyện: " + (currentSpace + barrackCurrentSpace) + "/" + maxSpace);
    },

    updateTrainingPopupTitle: function () {
        let count = this._curBarrack.getTrainingSpace();
        let max = this._curBarrack.getMaxSpace();
        let popUpTitle = this._trainPopup.getChildByName("title");
        popUpTitle.setString("Nhà lính " + (this._curPage + 1) + " (" + count + "/" + max + ")");
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

    initTotalTrainingTime: function () {
        let total = 0;
        let trainingQueue = this._curBarrack.getTrainingList();
        for (let i = 0; i < trainingQueue.length; i++) {
            total += TroopUltis.getTrainingTime(trainingQueue[i].cfgId) * trainingQueue[i].getCount();
        }
        this._totalTime = total;
        return this._totalTime;
    },


    handleChangePage: function (addition) {
        let trainPopup = this.getParent();
        trainPopup.changePage(this._curPage + addition);
    },

    handleClosePopup: function () {
        let trainTroopPopup = this.getParent();
        trainTroopPopup.close();
    },

    handleCancleTroopTraining: function (event) {
        cc.log("CANCLE TRAIN :::: " + JSON.stringify(event))
        this.stopUpdateUI();
        testnetwork.connector.sendRequestCancleTrain({cfgId: event.data.cfgId, barrackId: event.data.barrackId})
    },

    handleTrainTroop: function (event) {
        testnetwork.connector.sendRequestTrainingCreate({
            cfgId: event.data.cfgId,
            count: event.data.count,
            barrackId: this._curBarrack.getId()
        });
    },

    handleClickDoneNow: function () {
        this.stopUpdateUI()
        testnetwork.connector.sendRequestTrainingSuccess({isDoneNow: 1, barrackId: this._curBarrack.getId()})
    },

    updateCurrentTroopTimeInfo: function (curTroopTrainTime) {

        let curTroopTime = this._trainContainer.getChildByName("current");
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");

        let timeLeft = this._curBarrack.getLastTrainingTime() + curTroopTrainTime - TimeManager.Instance().getCurrentTimeInSecond();
        timeString.setString(timeLeft + "s");

        let processBarPercent = (TimeManager.Instance().getCurrentTimeInSecond() - this._curBarrack.getLastTrainingTime()) / curTroopTrainTime * 100;
        processBar.setPercent(processBarPercent);

    },

    updateTrainTime: function () {

        let trainingQueue = this._curBarrack.getTrainingList();
        if (trainingQueue.length > 0) {
            let curTroopTrainTime = TroopUltis.getTrainingTime(trainingQueue[0].cfgId);

            this.updateCurrentTroopTimeInfo(curTroopTrainTime);

            // update total time
            this._totalTime = this._totalTime - 1;

            this.updateTotalTimeString();
            this.updateDoneNowPrice();

            if (TimeManager.Instance().getCurrentTimeInSecond() >= this._curBarrack.getLastTrainingTime() + curTroopTrainTime) {
                this.stopUpdateUI();
                testnetwork.connector.sendRequestTrainingSuccess({isDoneNow: 0, barrackId: this._curBarrack.getId()})
            }
        } else {
            this.cleanUI();
        }

        if (!this.checkAvailable()) {
            this.stopUpdateUI();
        }

    },

    cleanUI: function () {
        this._trainContainer.setVisible(false);
        if (this._trainingItem.length > 0) {
            this._trainingItem[0].removeFromParent();
        }
        this._trainingItem = [];
        let curTroopTime = this._trainContainer.getChildByName("current");
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");
        timeString.setString("");
        processBar.setPercent(0);
        this._totalTime = 0;
        this.updateTotalTimeString();
        this.stopUpdateUI();
    },


    onCanCreateTrain: function (events) {
        cc.log("ON CAN CREATE TRAIN ::::::::::::::::::::::::::" + JSON.stringify(events));

        events.map(event => {

            let troopCfgId = event.data.cfgId;
            if (!troopCfgId) return;

            let count = event.data.count || 1;
            let trainingQueue = this._curBarrack.getTrainingList();

            // update UI
            let found = false;
            if (!event.data.isInit) found = this._curBarrack.addToTrainingQueue({cfgId: troopCfgId, count: count});

            if (!found) {
                // create new waiting troop item;
                let waitingTroop = new TroopTrainingItem(troopCfgId, this._curPage);
                if (trainingQueue.length === 1) {
                    if (!event.data.isInit) this._curBarrack.setLastTrainingTime(event.data.lastTrainingTime);
                    this._trainContainer.setVisible(true);
                    waitingTroop.setPosition(CURRENT_TROOP_TRAINING_POS.x, CURRENT_TROOP_TRAINING_POS.y);

                } else if (trainingQueue.length === 2) {
                    waitingTroop.setPosition(FIRST_WAITING_TRAINING_TROOP_POS.x, FIRST_WAITING_TRAINING_TROOP_POS.y);
                } else {
                    let lastTroopWaiting = this._trainingItem[this._trainingItem.length - 1];
                    waitingTroop.setPosition(lastTroopWaiting.getPosition().x - TROOP_TRAIN_WAITING_SPACE - TROOP_TRAINING_ITEM_WIDTH, lastTroopWaiting.getPosition().y)
                }
                this._trainingItem.push(waitingTroop);
                this._trainContainer.addChild(waitingTroop);
            } else {
                let item = this._trainingItem.find(e => e.getCfgId() === event.data.cfgId);
                item.setCount(item.getCount() + 1);
            }

            this._totalTime = this._totalTime + TroopUltis.getTrainingTime(troopCfgId);


            this.updateTotalTimeString();
            this.updateTrainingPopupTitle();
            this.updateDoneNowPrice();
            this.updateSpaceAfterTrainLabel();
        })

        if (!this._isActive && events.length > 0) {
            this.updateUI(1);
        }
    },

    onTrainSuccess: function (data) {
        cc.log("ON TRAIN SUCCESS " + JSON.stringify(data));
        this.updateUI(1)

        this._curBarrack.removeFromTrainingQueue({cfgId: data.cfgId, count: 1, currentTime: data.lastTrainingTime});

        if (this._curBarrack.getTrainingList().length === 0) {
            this.cleanUI();
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

        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN_SUCCESS + this._curPage);
        event.data = {count: 1, cfgId: data.cfgId};
        cc.eventManager.dispatchEvent(event);

        ArmyManager.Instance().updateArmyAmount([{cfgId: data.cfgId, count: 1}], this._curPage)
        this.updateTrainingPopupTitle();
    },

    onDoneNowSuccess: function (data) {
        this.stopUpdateUI();
        this._trainContainer.setVisible(false);
        ArmyManager.Instance().updateArmyAmount(this._curBarrack.getTrainingList(), this._curPage);
        this._curBarrack.setTrainingList([]);
        this._curBarrack.setLastTrainingTime(data.lastTrainingTime);
        this._trainingItem.map(e => {
            e.removeFromParent();
        });
        this._trainingItem = [];
        this.cleanUI();
        this.updateTrainingPopupTitle();
        PlayerInfoManager.Instance().setResource({gem: data.gem});
    },

    onCancelTrainTroopSuccess: function (event) {
        // cc.log("ON CANCLE TRAIN TROOP" );
        // this.updateUI(1)
        let troopCfgId = event.data.cfgId;
        this._curBarrack.removeFromTrainingQueue({
            cfgId: troopCfgId,
            count: 1,
            currentTime: event.data.lastTrainingTime
        })
        let trainingQueue = this._trainingItem;

        // update ui
        for (let i = 0; i < trainingQueue.length; i++) {

            if (trainingQueue[i].getCfgId() === troopCfgId) {
                let count = trainingQueue[i].getCount();
                trainingQueue[i].setCount(count - 1);
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


                this.updateTrainingPopupTitle();
                this.updateSpaceAfterTrainLabel();
                this._totalTime = this._totalTime - TroopUltis.getTrainingTime(troopCfgId);
                this.updateTotalTimeString();

                this.updateUI(1);
                return;
            }
        }


        cc.log("BUG:::: Handle Cancle Training:::: not found troopcfgId:::", troopCfgId);
    }


})