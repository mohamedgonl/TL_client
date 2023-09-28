


let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {
        this._shopPopup =  new ShopPopup();
        this._shopPopup.setVisible(false);
        this.addChild( this._shopPopup);
    },


    appear: function (popUpId) {
        if(popUpId === "shop"){
            this.setVisible(true);
            this._shopPopup.setVisible(true);
            PopupEffect.appear(this._shopPopup);
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

