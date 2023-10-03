

var GameScene = cc.Scene.extend({

    mapLayer: null,
    popUpLayer: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {


        this.mapLayer = MapManager.Instance();

        // cc.log("map layer " + JSON.stringify(this.mapLayer, null, 2));

        this.infoLayer = InfoLayer.Instance();
        // cc.log("info layer " + JSON.stringify(this.infoLayer, null, 2));

        this.popUpLayer = new PopupLayer();
        this.popUpLayer.setVisible(false);


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


        this.addChild(this.mapLayer);
        this.addChild(this.infoLayer);
        this.addChild(this.popUpLayer)
    }
});
