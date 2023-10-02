var TrainTroopPopup = cc.Layer.extend({
    _curPage : 1,
    _pageCount: 3,
    _curBarrack: 0,
    _space: 50,
    _trainingQueue: null,

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
        cc.eventManager.addCustomListener("train_troop", this.handleTrainTroop.bind(this))

        // this._timeInfo = trainPopup.getChildByName("time_info");
        this._trainInfo = trainPopup.getChildByName("train_info");
        // this._listTroop = trainPopup.getChildByName("list_troop_container");
        //
        this._troopTrainingItem = this._trainInfo.getChildByName("troop_training");
        //
        this.initListTroops();
        this.updateTrainingPopupTitle();

        this.addChild(node);
    },

    initListTroops: function () {
        TROOPS_LIST.map((troop, index) => {
            let troopItem = new TroopListItem(troop.troopCfgId);
            troopItem.setPosition(LIST_TROOP_START_POS.x + index * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE), LIST_TROOP_START_POS.y);
            this._trainPopup.addChild(troopItem);
        })
    },
    pushToTrainingList: function (troopTrainingItem) {
        if(this._trainingQueue.length === 0) {

        }
        else {

        }
    },

    enableTroopList: function () {

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

    handleCancleTroopTraining: function () {

    },

    handleTrainTroop: function (event) {
        cc.log("CATCH event:::", event.getEventName());
        let troopCfgId = event.data.cfgId;
        let trainingQueue = this._trainingQueue;
        let found = false;
        for (let i = 0; i < trainingQueue.length; i++) {
            // if this type of troop already in queue
            if(trainingQueue[i].cfgId === troopCfgId) {
                trainingQueue[i].count ++ ;
                found = true;
                break;
            }
        }
        if(!found) {
            // create new waiting troop item;
            let waitingTroop = new TroopTrainingItem(troopCfgId);
            trainingQueue.push({
                cfgId: troopCfgId,
                count: 1
            })
        }
    }



})