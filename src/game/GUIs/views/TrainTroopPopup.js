var TrainTroopPopup = cc.Layer.extend({
    _curPage : 1,
    _pageCount: 3,
    _curBarrack: 0,
    _space: 50,
    _trainingQueue: null,
    _available: true,

    ctor: function () {
        this._super();
        // test data;
        this._trainingQueue = [];

        let node = CCSUlties.parseUIFile(res_ui.TRAIN_TROOP);
        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        this._trainPopup = node.getChildByName("train_popup");
        let prevButton = node.getChildByName("button_prev");
        let nextButton = node.getChildByName("button_next");
        let closeButton = node.getChildByName("button_close");

        prevButton.addClickEventListener(this.handleChangePage.bind(this,-1));
        nextButton.addClickEventListener(this.handleChangePage.bind(this, 1));
        closeButton.addClickEventListener(this.handleClosePopup.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.TRAIN, this.handleTrainTroop.bind(this));
        cc.eventManager.addCustomListener(TRAINING_EVENTS.CANCLE, this.handleCancleTroopTraining.bind(this));


        let trainPopup = node.getChildByName("train_popup");
        this._trainContainer = trainPopup.getChildByName("training_container");

        this.initListTroops();
        this.updateTrainingPopupTitle();

        this._totalTime = this.updateAndGetTotalTrainingTime();

        this.addChild(node);
    },

    initListTroops: function () {
        TROOPS_LIST.map((troop, index) => {
            let troopItem = new TroopListItem(troop.troopCfgId);
            troopItem.setPosition(LIST_TROOP_START_POS.x + index * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE), LIST_TROOP_START_POS.y);
            this._trainPopup.addChild(troopItem);
        })
    },

    enableTroopList: function () {

    },

    updateBarrackInfo : function () {

    },

    getCurrentTime: function () {
      let curTime = new Date().getTime() / 1000;
      return Math.floor(curTime);
    },

    updateTrainingPopupTitle: function () {
        let popUpTitle = this._trainPopup.getChildByName("title");
        popUpTitle.setString("Nhà lính "+this._curPage+" ("+this._curBarrack+"/"+this._space+")");
    },

    handleChangePage : function (addition) {
        cc.log("handle page change", addition);

        let page = this._curPage + addition;
        if(page <=0 ){
            this._curPage = this._pageCount;
        }
        else if (page > this._pageCount) {
            this._curPage = 1;
        }else {
            this._curPage = page;
        }
        this.updateTrainingPopupTitle();

        // check lại list troop

        // thay đổi
    },

    handleClosePopup  :function () {
        PopupEffect.disappear(this, ()=>{
            this.setVisible(false);
        })
    },

    handleCancleTroopTraining: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let troopCfgId = event.data.cfgId;
        let trainingQueue = this._trainingQueue;
        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if(trainingQueue[i].getCfgId() === troopCfgId) {
                this.onTrainSuccess(true);
                let count = trainingQueue[i].getCount();
                if(count === 0) {
                    // sắp xếp lại wait queue
                    for (let j = trainingQueue.length - 1; j > i; j--) {
                        trainingQueue[j].setPositionX(trainingQueue[j-1].getPosition().x);
                    }
                    trainingQueue[i].removeFromParent();
                    trainingQueue.splice(i, 1);
                }

                if(trainingQueue.length === 0) {
                    this._trainContainer.setVisible(false);
                }
                return;
            }
        }
        cc.log("BUG:::: Handle Cancle Training:::: not found troopcfgId:::", troopCfgId);
    },

    handleTrainTroop: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let troopCfgId = event.data.cfgId;
        let trainingQueue = this._trainingQueue;
        let found = false;

        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if(trainingQueue[i].getCfgId() === troopCfgId) {
                let count = trainingQueue[i].getCount();
                trainingQueue[i].setCount(count+1) ;
                found = true;
                break;
            }
        }
        if(!found) {
            // create new waiting troop item;
            let waitingTroop = new TroopTrainingItem(troopCfgId);
            if(trainingQueue.length === 0) {

                this.lastTrainingTime = this.getCurrentTime();

                this._trainContainer.setVisible(true);

                waitingTroop.setPosition(CURRENT_TROOP_TRAINING_POS.x, CURRENT_TROOP_TRAINING_POS.y);

                this.schedule(this.updateTrainTime,1);

            } else if(trainingQueue.length === 1) {
                waitingTroop.setPosition(FIRST_WAITING_TRAINING_TROOP_POS.x, FIRST_WAITING_TRAINING_TROOP_POS.y);
            }
            else {
                let lastTroopWaiting = trainingQueue[trainingQueue.length-1];
                waitingTroop.setPosition(lastTroopWaiting.getPosition().x - TROOP_TRAIN_WAITING_SPACE - TROOP_TRAINING_ITEM_WIDTH, lastTroopWaiting.getPosition().y)
            }
            this._trainContainer.addChild(waitingTroop);
            trainingQueue.push(waitingTroop);
        }

        this._totalTime = this._totalTime + TroopUltis.getTrainingTime(troopCfgId);
        this.updateTotalTimeString();
    },

    updateAndGetTotalTrainingTime: function () {
        let total = 0;
        for (let i = 0; i <this._trainingQueue.length; i++) {
            total += TroopUltis.getTrainingTime(this._trainingQueue[i].getCfgId()) * this._trainingQueue[i].getCount();
        }
        this._totalTime = total;
        return this._totalTime;
    },

    updateTrainTime: function () {
        let curTroopTime = this._trainContainer.getChildByName("current");
        let curTroopTrainTime = TroopUltis.getTrainingTime(this._trainingQueue[0].getCfgId()) ;
        let processBar = curTroopTime.getChildByName("current_process");
        let timeString = curTroopTime.getChildByName("current_time_string");

        if(!this._available) {
            timeString.setString("DỪNG");
            processBar.setPercent(100);
            this.unschedule(this.updateTrainTime);

        }else {
            let timeLeft = this.lastTrainingTime + curTroopTrainTime - this.getCurrentTime();
            cc.log("TIME LEFT ::::", this.lastTrainingTime, curTroopTrainTime, this.getCurrentTime());
            timeString.setString(timeLeft + "s");

            let processBarPercent = (this.getCurrentTime() - this.lastTrainingTime)/curTroopTrainTime * 100;
            processBar.setPercent(processBarPercent);
        }

        // update total time
        this._totalTime = this._totalTime - 1;
        this.updateTotalTimeString();

        if(this.getCurrentTime() >= this.lastTrainingTime + curTroopTrainTime) {
            cc.log("train success!");
            this.onTrainSuccess();
        }
    },


    updateTotalTimeString: function () {
        let totalTimeString = this._trainContainer.getChildByName("total_time_string");
        totalTimeString.setString(this._totalTime + "s");
    },

    onTrainSuccess : function (isCancle = false) {
        if(!isCancle) {
            this.removeFirstTroop();
        }
        else {
            this.updateAndGetTotalTrainingTime();
            this.updateTrainTime();
        }


        this.lastTrainingTime = this.getCurrentTime();

        if(this._trainingQueue.length === 0 ) {
            this._trainContainer.setVisible(false);
            this.unschedule(this.updateTrainTime);
        }
        else {
            let curTroopTime = this._trainContainer.getChildByName("current");
            let processBar = curTroopTime.getChildByName("current_process");
            let timeString = curTroopTime.getChildByName("current_time_string");
            processBar.setPercent(0);
            let troopTrainTime = TroopUltis.getTrainingTime(this._trainingQueue[0].getCfgId());
            timeString.setString(troopTrainTime + "s");
        }
    },

    removeFirstTroop : function () {
        if(this._trainingQueue[0].getCount() > 1) {
            this._trainingQueue[0].setCount(this._trainingQueue[0].getCount() - 1);
        }
        else {
            for (let i = this._trainingQueue.length - 1; i > 0; i--) {
                this._trainingQueue[i].setPositionX(this._trainingQueue[i-1].getPosition().x);
            }
            this._trainingQueue[0].removeFromParent();
            this._trainingQueue.splice(0, 1);
        }
    },

})