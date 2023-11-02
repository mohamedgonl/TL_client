var NotEnoughResourcePopup = cc.Node.extend({
    ctor: function (amount, type, callback) {
        this._super();
        this.type = type;
        this.amount = amount;
        this.callback = callback;

        //note: gemCost = (int) Math.ceil((double) gold / 400) + (int) Math.ceil((double) elixir / 500);
        let gemCost;
        let currentG = PlayerInfoManager.getInstance().getResource("gem");
        if(type === "gold")
            gemCost = Utils.calculateGBuyRes(amount, 0);
        else
            gemCost = Utils.calculateGBuyRes(0, amount);

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

        //thêm vào content 1 dòng: gemCost + icon gem
        let gemCostLabel = new cc.LabelBMFont("Giá: "+ gemCost, res.FONT.SOJI[20], 350, cc.TEXT_ALIGNMENT_CENTER);
        gemCostLabel.setAnchorPoint(cc.p(0.7, 1));
        gemCostLabel.setPositionY(-label.getContentSize().height - price.getContentSize().height);
        let gemIcon = new cc.Sprite(res.ICON.GEM);
        gemIcon.setPositionX(gemCostLabel.getContentSize().width  );
        gemIcon.setPositionY(label.getContentSize().height/2);
        gemIcon.setAnchorPoint(cc.p(0, 0)  );
        gemCostLabel.addChild(gemIcon);



        let content = new cc.Node();
        content.addChild(label);
        content.addChild(price);
        content.addChild(gemCostLabel);

        let popUpLayer = cc.director.getRunningScene().getPopUpLayer();

        let buyResPopup = new NotiPopup({
            title: "THIẾU TÀI NGUYÊN",
            acceptCallBack: () => {
                popUpLayer.setVisible(false);

                //nếu tiền cần tiêu > tổng kho
                //check kho chứa, nếu amount + kho chứa > max thì ko cho mua
                let maxAmount = PlayerInfoManager.getInstance().getMaxResource()[type];
                let currentAmount = PlayerInfoManager.getInstance().getResource(type);

                if(amount + currentAmount > maxAmount){
                    let str ="";
                    if(type === "gold")
                        str = "Vàng";
                    else
                        str = "Dầu";
                    BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn cần mở rộng kho "+str);
                    return;
                }

                //nếu không đủ G
                if(gemCost > currentG){
                    BasicPopup.appear("THIẾU TÀI NGUYÊN", "Bạn không đủ G");
                    return;
                }

                //nếu ok , gửi cho server
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
