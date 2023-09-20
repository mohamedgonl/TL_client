


var PopupLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        // this.setOpacity(0);
        this.init();
    },

    init : function () {
        let popUp = Popup.createAsMessage("Hello", "World");
        this.addChild(popUp)
        var camera = new cc.Camera
    },

});
