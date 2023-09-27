var GameScene = cc.Scene.extend({

    mapLayer: null,
    popUpLayer: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this.mapLayer = new MapLayer();
        this.addChild(this.mapLayer);
        this.popUpLayer = new PopupLayer();
        this.addChild(this.popUpLayer)

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if(keyCode == cc.KEY.s)
                {
                    //change visible of popup
                    this.popUpLayer.setVisible(!this.popUpLayer.isVisible());
                }
            }.bind(this)
        }, this);
    },
    getPopUpLayer: function () {
        return this.popUpLayer;
    }
});