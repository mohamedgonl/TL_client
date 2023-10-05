


let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    _trainTroopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {


    },


    appear: function (popUpId, data) {

        this.setVisible(true);
        let popupScreen;
        switch (popUpId) {
            case "shop": {
                if(!this._shopPopup){
                    this._shopPopup =  new ShopPopup();
                    this._shopPopup.setVisible(false);
                    this.addChild( this._shopPopup);
                }
                popupScreen = this._shopPopup;
                break;
            }
            case "train": {
                if(!this._trainTroopPopup) {
                    this._trainTroopPopup = new TrainTroopPopup();
                    this._trainTroopPopup.setVisible(false);
                    this.addChild(this._trainTroopPopup);
                }
                popupScreen = this._trainTroopPopup;
                break;
            }
            case "pop_up" :  {

            }
        }
        popupScreen.setVisible(true);
        PopupEffect.appear(popupScreen);

    },

    disappear: function (popUpId) {

        switch (popUpId) {
            case "shop": {
                this._shopPopup.handleClickClose();
                break;
            }
            case "train": {
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

