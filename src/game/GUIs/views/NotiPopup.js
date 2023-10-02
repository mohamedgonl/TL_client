
var NotiPopup = cc.Layer.extend({
    ctor: function (data) {
        this._super();
        let popup = this;
        data = data || {};
        let title = data.title || "THÔNG BÁO";
        let content = data.content;
        let cancleText = data.cancleText || "HỦY BỎ";
        let acceptText = data.acceptText || "OK";
        let cancleCallBack = data.cancleCallBack || function () {
            popup.removeFromParent(true);
        };
        let acceptCallBack = data.acceptCallBack || function () {};
        let enableCloseButton = data.enableCloseButton || false;

        let node = CCSUlties.parseUIFile(res_ui.NOTI_POPUP);

        let _title = node.getChildByName("popup_title");
        _title.setString(title);

        let _cancleButton = node.getChildByName("button_cancle");
        _cancleButton.getChildByName("cancle_string").setString(cancleText);
        cc.eventManager.addListener(clickEventListener(cancleCallBack).clone(),_cancleButton);


        let _acceptButton = node.getChildByName("button_ok");
        _acceptButton.getChildByName("ok_string").setString(acceptText);
        cc.eventManager.addListener(clickEventListener(()=>{
            acceptCallBack();
            popup.removeFromParent(true);
        }).clone(), _acceptButton);

        let _content = node.getChildByName("content");
        _content.addChild(content);

        if(enableCloseButton){
            // handle close
        }

        node.setPosition(cc.winSize.width/2, cc.winSize.height/2);
        this.addChild(node);
    },

})


