


let PopupLayer = cc.Layer.extend({
    _shopPopup: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {
        cc.log("INIT POPUPLAYER");
        this._shopPopup =  new ShopPopup();
        this._shopPopup.setVisible(false);
        this.addChild( this._shopPopup);
    },


    appear: function (popUpId) {
        this._shopPopup.setVisible(true);
        PopupEffect.appear(this._shopPopup)
    },

    disappear: function () {

    },

    push: function (popup) {
        this.addChild(popup);
    },

    pop: function () {

    }

});

// var popUpLayer = new PopupLayer();

