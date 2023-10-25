let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    _trainTroopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this._trainTroopPopup = new TrainTroopPopup();
        this.addChild(this._trainTroopPopup);
    },

    appear: function (popUpId, data) {
        cc.log("APPEAR : ", this.isVisible())
        this.setVisible(true);
        let popupScreen;
        switch (popUpId) {
            case POPUP_IDS.SHOP: {
                if (!this._shopPopup) {
                    this._shopPopup = new ShopPopup();
                    this.addChild(this._shopPopup);
                }
                popupScreen = this._shopPopup;
                break;
            }
            case POPUP_IDS.TRAIN: {
                popupScreen = this._trainTroopPopup;
                this._trainTroopPopup.open(data.page);
                break;
            }
            case POPUP_IDS.FIGHT: {
                if (!this._fightPopup) {
                    this._fightPopup = new FightPopup();
                    this.addChild(this._fightPopup);
                }
                popupScreen = this._fightPopup;
                break;
            }
        }

        popupScreen.setVisible(true);
        PopupEffect.appear(popupScreen);
    },

    disappear: function (popUpId, closePopupLayer = true) {
        switch (popUpId) {
            case POPUP_IDS.SHOP: {
                this._shopPopup.handleClickClose(closePopupLayer);
                break;
            }
            case POPUP_IDS.TRAIN: {
                this._trainTroopPopup.close();
                break;
            }
            case POPUP_IDS.FIGHT: {
                this._fightPopup.handleClickClose(closePopupLayer);
                break;
            }
        }
    },

    getTrainingPopup: function () {
        return this._trainTroopPopup;
    },

    push: function (popup) {
        this.addChild(popup);
    },

    pop: function () {

    }

});

// var popUpLayer = new PopupLayer();

