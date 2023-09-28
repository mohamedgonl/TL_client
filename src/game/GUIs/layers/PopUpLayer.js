


let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    _trainTroopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {
        this._shopPopup =  new ShopPopup();
        this._shopPopup.setVisible(false);
        this.addChild( this._shopPopup);

        this._trainTroopPopup = new TrainTroopPopup();
        this._trainTroopPopup.setVisible(false);
        this.addChild(this._trainTroopPopup);
    },


    appear: function (popUpId) {
        this.setVisible(true);
        if(popUpId === "shop"){
            this._shopPopup.setVisible(true);
            PopupEffect.appear(this._shopPopup);
        }
        if(popUpId === "train") {
            this._trainTroopPopup.setVisible(true);
            PopupEffect.appear(this._trainTroopPopup);
        }

    },

    disappear: function () {
        this._shopPopup.handleClickClose();
        this.setVisible(false);
    },

    push: function (popup) {
        this.addChild(popup);
    },

    pop: function () {

    }

});

// var popUpLayer = new PopupLayer();

