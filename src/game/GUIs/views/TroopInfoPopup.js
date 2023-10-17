

var TroopInfoPopup = cc.Layer.extend({
    ctor: function (cfgId) {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.TROOP_INFO);
        this._node = node.getChildByName("troop_info");
        this._cfgId = cfgId;

        this.setInfo();
        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);

        let buttonClose =  this._node.getChildByName("button_close");
        buttonClose.addClickEventListener(this.handleClose.bind(this));

        this.addChild(node);
        PopupEffect.appear(this._node);

    },

    handleClose : function (sender, type) {
        PopupEffect.disappear(this._node, ()=>{ this.removeFromParent()});
    }
    ,

    setInfo : function () {
        let level = 1;
        let data = TROOPS_INFO[this._cfgId];
        let title = this._node.getChildByName("title");
        title.setString(data.name + " cấp "+ level);

        // adding item image
        let itemIcon = this._node.getChildByName("troop_image");
        itemIcon.loadTexture(TROOP_BIG_ICON_BASE_URL + this._cfgId + ".png");

        //set progress bar info

        let progressBarContainer = this._node.getChildByName("progress_bar");
        let progressBars = progressBarContainer.getChildren();

        progressBars.map((e,index) => {
            let processTitle =  e.getChildByName("title");
            processTitle.setString(data.info[index].title);

            let processIcon = e.getChildByName("icon");
            processIcon.loadTexture(data.info[index].icon);

            let processBar = e.getChildByName("process");
            processBar.setPercent(data.info[index].bar_percent * 100);

        })

        // set specific info
        let rightInfo = this._node.getChildByName("info_right");
        let infoLabels = rightInfo.getChildren();
        infoLabels.map((e, index) => {
            e.setString(data.data[index]);
        })

        // adding description
        let content = this._node.getChildByName("content");
        let label = new cc.LabelBMFont(data.description, res.FONT.FISTA["16"], 600, cc.TEXT_ALIGNMENT_CENTER);
        label.setColor(cc.color(155, 75, 10))
        content.addChild(label);


    }
})