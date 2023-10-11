var CheatPopup = cc.Layer.extend({
    ctor: function (data) {
        this._super();
        let popup = this;
        data = data || {};
        let title = data.title || "CHEAT";
        // let content = data.content;
        let cancleText = data.cancleText || "HỦY BỎ";
        let acceptText = data.acceptText || "OK";
        let cancleCallBack = data.cancleCallBack || function () {
            popup.removeFromParent(true);
        };
        let acceptCallBack = data.acceptCallBack || function () {
        };
        let enableCloseButton = data.enableCloseButton || false;

        let node = CCSUlties.parseUIFile(res_ui.CHEAT_POPUP);

        let _title = node.getChildByName("popup_title");
        _title.setString(title);

        let _cancleButton = node.getChildByName("button_cancle");
        _cancleButton.getChildByName("cancle_string").setString(cancleText);
        cc.eventManager.addListener(clickEventListener(cancleCallBack).clone(), _cancleButton);

        let _acceptButton = node.getChildByName("button_ok");
        _acceptButton.getChildByName("ok_string").setString(acceptText);

        const tfGold = node.getChildByName("tf-gold");
        const tfElixir = node.getChildByName("tf-elixir");
        const tfGem = node.getChildByName("tf-gem");

        cc.eventManager.addListener(clickEventListener(() => {
            const gold = parseInt(tfGold.getString());
            const elixir = parseInt(tfElixir.getString());
            const gem = parseInt(tfGem.getString());

            if (gold >= 0 || elixir >= 0 || gem >= 0) {
                acceptCallBack({gold, elixir, gem});
                popup.removeFromParent(true);
            }
        }).clone(), _acceptButton);

        // let _content = node.getChildByName("content");
        // _content.addChild(content);

        if (enableCloseButton) {
            // handle close
        }

        node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(node);
    },

})


