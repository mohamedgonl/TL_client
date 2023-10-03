

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

        let shopButton = new ccui.Button(res.BUTTON.SHOP,"","");
        shopButton.setPosition(cc.winSize.width - shopButton.getContentSize().width / 2, shopButton.getContentSize().height / 2);

        var trainTroopButton = new ccui.Button(res.BUTTON.TRAIN_TROOP, "", "");
        trainTroopButton.setPosition(trainTroopButton.getContentSize().width / 2, trainTroopButton.getContentSize().height / 2);
        this.addChild(trainTroopButton);
        this.addChild(shopButton);

        shopButton.addClickEventListener(()=>{
            if(this.popUpLayer.isVisible()) {
                this.popUpLayer.disappear();
            }
            else {
                this.popUpLayer.appear("shop");
            }
        })

        trainTroopButton.addClickEventListener(()=>{
            if(this.popUpLayer.isVisible()) {
                this.popUpLayer.disappear();
            }
            else {
                this.popUpLayer.appear("train");
            }
        })

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
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    onBuyResourceSuccess: function (data) {

        PlayerInfoManager.Instance().setResource(data);
    }

});
