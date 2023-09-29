var TrainTroopPopup = cc.Layer.extend({
    _curPage : 0,
    _pageCount: 3,
    _curBarrack: 0,
    ctor: function () {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.TRAIN_TROOP);
        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        this._trainPopup = node.getChildByName("train_popup");
        let prevButton = node.getChildByName("button_prev");
        let nextButton = node.getChildByName("button_next");
        let closeButton = node.getChildByName("button_close");

        prevButton.addClickEventListener(this.handleChangePage.bind(this, this._curPage -1));
        nextButton.addClickEventListener(this.handleChangePage.bind(this, this._curPage +1));
        closeButton.addClickEventListener(this.handleClosePopup.bind(this));

        // this._timeInfo = trainPopup.getChildByName("time_info");
        // this._trainInfo = trainPopup.getChildByName("train_info");
        // this._listTroop = trainPopup.getChildByName("list_troop_container");
        //
        // this._troopTrainingItem = this._trainInfo.getChildByName("troop_training");
        //
        this.initListTroops();

        this.addChild(node);
    },

    initListTroops: function () {
        TROOPS_LIST.map((troop, index) => {
            let troopItem = new TroopListItem(troop.troopCfgId);
            troopItem.setPosition(LIST_TROOP_START_POS.x + index * (TROOP_ITEM_SPACING + TROOP_ITEM_SIZE), LIST_TROOP_START_POS.y);
            this._trainPopup.addChild(troopItem);
        })
    },





    handleChangePage : function (page) {
        // đổi tên nhà lính

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

    handleTrainTroop: function () {

    }



})