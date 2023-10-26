var BasicPopup = cc.Node.extend({
    ctor: function (name, string, callback) {
        this._super();
        //get popup layer
        let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
        popUpLayer.setVisible(true);
        let node = CCSUlties.parseUIFile(res_ui.BASIC_POPUP);
        //for all child in node, add to layer
        let children = node.getChildren();
        //add to attribute
        children.map(i => {
            this[i.getName()] = i;
            let childrenOfChildren = i.getChildren();
            childrenOfChildren.map(j => {
                this[i.getName()] [j.getName()] = j;
            })
        })

        //add event for button_cancle
        this.btn_cancel.addClickEventListener(this.onClickCancel.bind(this));
        this.btn_cancel.setPressedActionEnabled(true);
        this.addChild(node);

        this.popup_title.setString(name);

        //create a label to show string and add it to content
        let label = new cc.LabelBMFont(string, res.FONT.FISTA["16"], 350, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(new cc.Color(150, 78, 3));
        label.setAnchorPoint(cc.p(0.5, 0.5));
        this.content.addChild(label);
    },
    onClickCancel: function () {
        this.removeFromParent(true);
        let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
        popUpLayer.setVisible(false);
    }

})
BasicPopup.appear = function (name, string, callback) {
    let popup = new BasicPopup(name,string, callback);
    let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
    popUpLayer.addChild(popup);
    popup.setPosition(cc.winSize.width/2, cc.winSize.height/2);
    popUpLayer.setVisible(true);
}
