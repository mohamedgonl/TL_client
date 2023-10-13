


let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    _trainTroopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {
        this._trainTroopPopup = new TrainTroopPopup();
        this.addChild(this._trainTroopPopup);
    },


    appear: function (popUpId, data) {
        cc.log("APPEAR : ", this.isVisible())
        this.setVisible(true);
        let popupScreen;
        switch (popUpId) {
            case "shop": {
                if(!this._shopPopup){
                    this._shopPopup =  new ShopPopup();
                    this.addChild( this._shopPopup);
                }
                popupScreen = this._shopPopup;
                break;
            }
            case "train": {
                popupScreen = this._trainTroopPopup;
                this._trainTroopPopup.open(data.page);
                break;
            }
        }

        popupScreen.setVisible(true);
        PopupEffect.appear(popupScreen);

    },

    disappear: function (popUpId, closePopupLayer = true) {
        cc.log(this.isVisible())
        switch (popUpId) {
            case "shop": {
                this._shopPopup.handleClickClose(closePopupLayer);
                break;
            }
            case "train": {
                this._trainTroopPopup.close();
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

