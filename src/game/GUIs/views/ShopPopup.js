
var ShopPopup = cc.Sprite.extend({
    ctor: function () {
        this._super();
        let json = ccs.load(res_ui.SHOP_POPUP);
        let node = json.node;


        let backButton = node.getChildByName("button_back");

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function () {
                cc.log("Touch button back!")
                return true;
            }
        }, backButton);

        let closeButton = node.getChildByName("button_close");
        let contentWrapper = node.getChildByName("shop_content_wrapper");


        this.addChild(node);
    }
})