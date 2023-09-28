var TrainTroopPopup = cc.Layer.extend({
    _curPage : 0,
    _pageCount: 3,
    ctor: function () {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.TRAIN_TROOP);
        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        let trainPopup = node.getChildByName("train_popup");
        let prevButton = trainPopup.getChildByName("button_prev");
        let nextButton = trainPopup.getChildByName("button_next");

        prevButton.addClickEventListener(this.handleChangePage.bind(this, this._curPage -1));
        nextButton.addClickEventListener(this.handleChangePage.bind(this, this._curPage +1));

        this._timeInfo = trainPopup.getChildByName("time_info");
        this._trainInfo = trainPopup.getChildByName("train_info");
        this._listTroop = trainPopup.getChildByName("list_troop_container");

        this._troopTrainingItem = this._trainInfo.getChildByName("troop_training");

        this.initListTroops();

        this.addChild(node);
    },

    initListTroops: function () {

        TROOPS_LIST.map((troop, index) => {
            let troopItem = new  TroopListItem(troop.troopCfgId);
            this._listTroop.addChild(troopItem);
            troopItem.setPositionX(LIST_TROOP_START_POS_X + index * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE));
        })

    },

    handleChangePage : function (page) {


        // đổi tên nhà lính
    },

    handleCancleTroopTraining: function () {

    },

    handleTrainTroop: function () {

    }



})