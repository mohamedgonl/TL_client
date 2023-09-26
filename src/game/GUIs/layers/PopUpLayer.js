


let PopupLayer = cc.Layer.extend({

    ctor: function () {
        this._super();
        this.init();
    },

    init : function () {
        cc.log("INIT POPUPLAYER");
        let shopPopup =  new ShopPopup();
        this.addChild(shopPopup);
    },


    appear: function () {

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

