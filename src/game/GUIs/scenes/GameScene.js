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
        this.popUpLayer.setVisible(false);
        this.addChild(this.popUpLayer);


        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (keyCode) {
                if(keyCode == cc.KEY.s)
                {
                    //change visible of popup
                    let visible = this.popUpLayer.isVisible();
                    this.popUpLayer.setVisible(!visible);
                    if(!visible){
                        this.popUpLayer.appear("shop");
                    }
                }
            }.bind(this)
        }, this);
    },
    getPopUpLayer: function () {
        return this.popUpLayer;
    }
});