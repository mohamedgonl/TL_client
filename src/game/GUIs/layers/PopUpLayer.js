


var PopupLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        // this.setOpacity(0);
        this.init();
    },

    init : function () {
        let bg =  new Shop();
        bg.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(bg)
    },

});

