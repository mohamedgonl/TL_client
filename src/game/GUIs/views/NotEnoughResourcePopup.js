var NotEnoughResourcePopup = cc.Node.extend({
    ctor: function (amount, type, callback) {
        this._super();
        this.type = type;
        this.amount = amount;
        this.callback = callback;

        // create content in popup
        let label = new cc.LabelBMFont("Bạn có muốn mua số tài nguyên còn thiếu?", res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(new cc.Color(150, 78, 3));
        let price = new cc.LabelBMFont(amount, res.FONT.SOJI["24"], 350, cc.TEXT_ALIGNMENT_CENTER);
        price.setAnchorPoint(cc.p(0.7, 1));
        price.setPositionY(-label.getContentSize().height);
        //icon ben phai price
        let icon = new cc.Sprite(res.ICON.GOLD);
        if(type === "elixir")
            icon = new cc.Sprite(res.ICON.ELIXIR);

        icon.setPositionX(price.getContentSize().width  );
        icon.setPositionY(label.getContentSize().height/2);
        icon.setAnchorPoint(cc.p(0, 0)  );
        price.addChild(icon);

        let content = new cc.Node();
        content.addChild(label);
        content.addChild(price);

        let popUpLayer = cc.director.getRunningScene().getPopUpLayer();

        let buyResPopup = new NotiPopup({
            title: "THIẾU TÀI NGUYÊN",
            acceptCallBack: () => {
                popUpLayer.setVisible(false);
                //check kho chứa, nếu amount + kho chứa > max thì ko cho mua
                let maxAmount = PlayerInfoManager.Instance().getMaxResource()[type];
                let currentAmount = PlayerInfoManager.Instance().getResource(type);
                cc.log("maxAmount", maxAmount);
                cc.log("currentAmount", currentAmount);
                if(amount + currentAmount > maxAmount){
                    let str ="";
                    if(type === "gold")
                        str = "Vàng";
                    else
                        str = "Dầu";
                    BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn cần mở rộng kho "+str);
                    return;
                }
                if(type === "gold")
                    testnetwork.connector.sendBuyResourceByGem(amount,0);
                else
                    testnetwork.connector.sendBuyResourceByGem(0,amount);


                if(callback != null)
                    callback();
            },
            content: content,
            cancleCallBack: () => {
                popUpLayer.setVisible(false);
                buyResPopup.removeFromParent(true)
            }
        });
        buyResPopup.setAnchorPoint(cc.p(0.5, 0.5));
        this.addChild(buyResPopup);
    }
})
NotEnoughResourcePopup.appear = function (amount, type, callback) {
    let popup = new NotEnoughResourcePopup(amount, type, callback);
    let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
    popUpLayer.addChild(popup);
    popUpLayer.setVisible(true);
}
