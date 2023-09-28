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
    },

    getPopUpLayer: function () {
        return this.popUpLayer;
    },

    onBuyItemSuccess: function () {
        // cập nhập lại các thông tin khi mua 1 item thành công như tài nguyên, bản đồ

    }
});