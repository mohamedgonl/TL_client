var TrainTroopPage = cc.Node.extend({
    _curPage: null,
    _available: true,
    _curBarrack: null,
    _isActive: false,
    _troopListItem: [],
    _totalTime: 0,
    _curTroopTimeLeft: null,
    ctor: function (curPage) {
        this._super();

        this._curPage = curPage;
        this._curBarrack = ArmyManager.getInstance().getBarrackList()[this._curPage];

        // lưu các sprite nằm trong training container
        this._trainingItems = [];
        this._troopListItem = [];


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
        doneNowButton.addClickEventListener(this.handleClickDoneNow.bind(this));

        cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN + this._curPage, this.handleTrainTroop.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE + this._curPage, this.handleCancleTroopTraining.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.UPDATE_SPACE + this._curPage, this.updateSpace.bind(this));

        this.initListTroops();
        this.updateTrainingPopupTitle();
        this._doneNowButton = doneNowButton;
        // this.initTotalTrainingTime();
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
        cc.log("EVENTS TROOP _____________________________________________________ \n" + JSON.stringify(events));
        if (events.length > 0) {
            this.updateCurrentTroopTimeInfo(true, events[0].data.cfgId)
        }
        this.onCanCreateTrain(events);
    },

    updateUI: function (time, doNow = false) {

        if (this.checkAvailable()) {
            if (time) this._interval = time;
            this._isActive = true;
            if (doNow) this.updateTrainTime();
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
        this._troopListItem = [];
        for (let i = 0; i < TROOPS_LIST.length; i++) {
            let troopCfgId = TROOPS_LIST[i].troopCfgId;
            let troopItem = new TroopListItem(troopCfgId, this._curPage, i);
            let indexOfLine = i >= TROOPS_LIST.length / 2 ? i - TROOPS_LIST.length / 2 : i;
            let posX = LIST_TROOP_START_POS.x + indexOfLine * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE);
            let posY = i >= TROOPS_LIST.length / 2
                ? LIST_TROOP_START_POS.y - TROOP_ITEM_SIZE - TROOP_ITEM_SPACING
                : LIST_TROOP_START_POS.y
            troopItem.setPosition(posX, posY);
            this._troopListItem.push(troopItem)
            this._trainPopup.addChild(troopItem);
        }
    },

    checkAvailable: function () {
        let currentSpace = ArmyManager.getInstance().getCurrentSpace();
        let maxSpace = ArmyManager.getInstance().getMaxSpace();
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
        let currentSpace = ArmyManager.getInstance().getCurrentSpace();
        let maxSpace = ArmyManager.getInstance().getMaxSpace();
        let barrackCurrentSpace = this._curBarrack.getTrainingSpace();
        let curCount = (currentSpace + barrackCurrentSpace);
        title.setString("Tổng số quân sau khi huấn luyện: " + curCount + "/" + maxSpace);
        this.updateDoneNowButton(curCount <= maxSpace)
    },

    updateTrainingPopupTitle: function () {
        cc.log("DEBUG ::: " + JSON.stringify(ArmyManager.getInstance()))
        cc.log("_____LOG _________", this._curBarrack.getTrainingSpace());
        let count = this._curBarrack.getTrainingSpace();
        let max = this._curBarrack.getMaxSpace();
        let popUpTitle = this._trainPopup.getChildByName("title");
        popUpTitle.setString("Nhà lính " + (this._curPage + 1) + " (" + count + "/" + max + ")");
    },

    updateDoneNowPrice: function () {
        // update done now price
        let doneNowPrice = Math.ceil(this._totalTime / 60);
        let buttonDoneNowString = this._trainContainer.getChildByName("done_now_text").getChildByName("done_now_cost");
        buttonDoneNowString.setString(doneNowPrice);
        let doneNowButton = this._trainContainer.getChildByName("button_done_now");
        let gem = PlayerInfoManager.getInstance().getResource().gem;
        doneNowButton.setEnabled(doneNowPrice !== 0 && doneNowPrice <= gem)
    },

    updateTotalTimeString: function () {
        cc.log("UPDATE TOTAL TIME ::: " + this._totalTime)
        let totalTimeString = this._trainContainer.getChildByName("total_time_string");
        totalTimeString.setString(this._totalTime + "s");
    },

    updateDoneNowButton: function (available) {
        this._doneNowButton.setEnabled(available);
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

        if (event.data.longPressRunning) {
            this.onCanCreateTrain([event], true);
        }
        if (event.data.longPressEnd) {
            cc.log("TRAIN TROOP :" + JSON.stringify(event))
            testnetwork.connector.sendRequestTrainingCreate({
                cfgId: event.data.cfgId,
                count: event.data.count,
                barrackId: this._curBarrack.getId()
            });
        }
    },

    handleClickDoneNow: function () {
        this.stopUpdateUI()
        testnetwork.connector.sendRequestTrainingSuccess({isDoneNow: 1, barrackId: this._curBarrack.getId()})
    },

    updateCurrentTroopTimeInfo: function (isNew = false, cfgId) {
        cc.log("UPDATE CURRENT TROOP TIME ::: " + this._curTroopTimeLeft);

        let troopCfgId;
        if (isNew) {
            this._curTroopTimeLeft = Math.ceil(TROOP_BASE[cfgId]['trainingTime'] / 10);
            troopCfgId = cfgId;
        } else {
            this._curTroopTimeLeft--;
            troopCfgId = this._curBarrack.getTrainingList()[0].cfgId;
        }

        let curTroopTime = this._trainContainer.getChildByName("current");
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");

        // let timeLeft = this._curBarrack.getLastTrainingTime() + curTroopTrainTime - TimeManager.getInstance().getCurrentTimeInSecond();
        timeString.setString(this._curTroopTimeLeft + "s");

        let curTroopTrainTime = Math.ceil(TROOP_BASE[troopCfgId]['trainingTime'] / 10);
        let processBarPercent = (curTroopTrainTime - this._curTroopTimeLeft) / curTroopTrainTime * 100;
        processBar.setPercent(processBarPercent);

    },

    updateTrainTime: function () {
        cc.log("DOING")
        let trainingQueue = this._curBarrack.getTrainingList();
        if (trainingQueue.length > 0) {

            this.updateCurrentTroopTimeInfo(false);

            // update total time
            this._totalTime = this._totalTime - 1;

            this.updateTotalTimeString();
            this.updateDoneNowPrice();

            if (this._curTroopTimeLeft <= 0) {
                this.stopUpdateUI();
                let lastTrainTime = this._curBarrack.getLastTrainingTime();
                let curTroopTrainTime = TROOP_BASE[this._curBarrack.getTrainingList()[0].cfgId]["trainingTime"] / 10;
                setTimeout(() => {
                    testnetwork.connector.sendRequestTrainingSuccess({
                        isDoneNow: 0,
                        barrackId: this._curBarrack.getId()
                    });
                }, ((lastTrainTime + curTroopTrainTime) - TimeManager.getInstance().getCurrentTimeInSecond()) * 1000)
            }
        } else {
            this.cleanUI();
        }

        if (!this.checkAvailable()) {
            this.stopUpdateUI();
        }

    },

    createNewItemInTrainingList: function (event) {
        cc.log("CREATE NEW ITEM " + JSON.stringify(event))
        let waitingTroop = new TroopTrainingItem(event.data.cfgId, this._curPage);
        waitingTroop.setCount(event.data.count);
        if (this._trainingItems.length === 0) {
            if (!event.data.isInit) this._curBarrack.setLastTrainingTime(event.data.lastTrainingTime);
            this._trainContainer.setVisible(true);
            waitingTroop.setPosition(CURRENT_TROOP_TRAINING_POS.x, CURRENT_TROOP_TRAINING_POS.y);

        } else if (this._trainingItems.length === 1) {
            waitingTroop.setPosition(FIRST_WAITING_TRAINING_TROOP_POS.x, FIRST_WAITING_TRAINING_TROOP_POS.y);
        } else {
            let lastTroopWaiting = this._trainingItems[this._trainingItems.length - 1];
            waitingTroop.setPosition(lastTroopWaiting.getPosition().x - TROOP_TRAIN_WAITING_SPACE - TROOP_TRAINING_ITEM_WIDTH, lastTroopWaiting.getPosition().y)
        }
        this._trainingItems.push(waitingTroop);
        this._trainContainer.addChild(waitingTroop);
    },

    cleanUI: function () {
        this._trainContainer.setVisible(false);
        if (this._trainingItems.length > 0) {
            this._trainingItems[0].removeFromParent();
        }
        this._trainingItems = [];
        let curTroopTime = this._trainContainer.getChildByName("current");
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");
        timeString.setString("");
        processBar.setPercent(0);
        this._totalTime = 0;
        this.updateTotalTimeString();
        this.stopUpdateUI();
    },


    onCanCreateTrain: function (events, isLongPress = false) {
        cc.log("ON CAN CREATE TRAIN ::::::::::::::::::::::::::" + JSON.stringify(events));
        events.map(event => {

            let troopCfgId = event.data.cfgId;
            if (!troopCfgId) return;

            let count = event.data.count || 1;

            // update UI
            let found = false;

            if (!event.data.isInit) {
                if (this._curBarrack.getTrainingList().length === 0) {
                    this.updateCurrentTroopTimeInfo(true, troopCfgId);
                }
                found = this._curBarrack.addToTrainingQueue({cfgId: troopCfgId, count: count});
            }

            if (!found) {
                cc.log("CREATE NEW ITEM")
                this.createNewItemInTrainingList(event)
            } else {
                let itemTraining = this._trainingItems.find(e => e.getCfgId() === event.data.cfgId);
                itemTraining.increaseCount(count);
            }

            let itemTroop = this._troopListItem.find(e => e._troopCfgId === event.data.cfgId);
            itemTroop.increaseCount(count);

            this._totalTime = this._totalTime + TroopUltis.getTrainingTime(troopCfgId) * count;

            this.updateTotalTimeString();
            this.updateTrainingPopupTitle();
            this.updateDoneNowPrice();
            this.updateSpaceAfterTrainLabel();
        })

        if (!this._isActive && events.length > 0 && !isLongPress) {
            this.updateUI(1);
        }
    },

    onTrainSuccess: function (data) {
        cc.log("ON TRAIN SUCCESS " + JSON.stringify(data));

        this._curBarrack.removeFromTrainingList({cfgId: data.cfgId, count: 1, currentTime: data.lastTrainingTime});

        if (this._curBarrack.getTrainingList().length === 0) {
            this.cleanUI();
        } else {
            this.updateTrainingListItems(0);

            let troopCfgId = (this._curBarrack.getTrainingList()[0].cfgId);
            this.updateCurrentTroopTimeInfo(true, troopCfgId);

            this.updateUI(1)
        }

        let event = new cc.EventCustom(TRAINING_EVENTS.TRAIN_SUCCESS + this._curPage);
        event.data = {count: 1, cfgId: data.cfgId};
        cc.eventManager.dispatchEvent(event);

        ArmyManager.getInstance().updateArmyAmount([{cfgId: data.cfgId, count: 1}], this._curPage)
        this.updateTrainingPopupTitle();
    },

    onDoneNowSuccess: function (data) {
        cc.log("ON DONE NOW " + JSON.stringify(data))
        this.stopUpdateUI();
        this._trainContainer.setVisible(false);
        ArmyManager.getInstance().updateArmyAmount(this._curBarrack.getTrainingList(), this._curPage);
        this._curBarrack.setTrainingList([]);
        this._curBarrack.setLastTrainingTime(data.lastTrainingTime);
        this._trainingItems.map(e => {
            e.removeFromParent();
        });
        this._trainingItems = [];
        this.cleanUI();
        this.updateTrainingPopupTitle();
        PlayerInfoManager.getInstance().setResource({gem: data.gem});
        let event = new cc.EventCustom(TRAINING_EVENTS.DONE_NOW + this._curPage);
        cc.eventManager.dispatchEvent(event);
    },

    updateTrainingListItems: function (removedIndex) {
        this._trainingItems[removedIndex].increaseCount(-1);
        if (this._trainingItems[removedIndex].getCount() === 0) {
            // sắp xếp lại wait queue
            for (let j = this._trainingItems.length - 1; j > removedIndex; j--) {
                this._trainingItems[j].setPositionX(this._trainingItems[j - 1].getPosition().x);
            }
            this._trainingItems[removedIndex].removeFromParent();
            this._trainingItems.splice(removedIndex, 1);
        }

        if (this._trainingItems.length === 0) {
            this._trainContainer.setVisible(false);
        }
    },

    onCancelTrainTroopSuccess: function (event) {

        let troopCfgId = event.data.cfgId;

        this._curBarrack.removeFromTrainingList({
            cfgId: troopCfgId,
            count: 1,
            currentTime: event.data.lastTrainingTime
        })

        // update ui
        for (let i = 0; i < this._trainingItems.length; i++) {

            if (this._trainingItems[i].getCfgId() === troopCfgId) {
                this.updateTrainingListItems(i);
                this.updateTrainingPopupTitle();
                this.updateSpaceAfterTrainLabel();

                let trainingTime = TroopUltis.getTrainingTime(troopCfgId);
                if (i === 0) {
                    this._totalTime -= this._curTroopTimeLeft;
                    this.updateCurrentTroopTimeInfo(true, troopCfgId);
                } else {
                    this._totalTime -= trainingTime;
                }
                this.updateTotalTimeString();
                this.updateUI(1);
                return;
            }
        }


        cc.log("BUG:::: Handle Cancle Training:::: not found troopcfgId:::", troopCfgId);
    }


})