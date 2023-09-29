
var NotiPopup = cc.Layer.extend({
    ctor: function ({title, content, cancleText, acceptText, cancleCallBack = ()=>{}, acceptCallBack = ()=>{}}, enableCloseButton = false) {
        this._super();
        let node = CCSUlties.parseUIFile(res_ui.NOTI_POPUP);

        let _title = node.getChildByName("popup_title");
        _title.setString(title || "THÔNG BÁO");

        let _cancleButton = node.getChildByName("button_cancle");
        _cancleButton .getChildByName("cancle_string").setString(cancleText || "HỦY BỎ");
        _cancleButton.addClickEventListener(cancleCallBack)

        let _acceptButton = node.getChildByName("button_ok");
        _acceptButton.addClickEventListener(acceptCallBack)
        _acceptButton.getChildByName("ok_string").setString(acceptText || "OK");

        let _content = node.getChildByName("content_wrapper").getChildByName("content_string");
        _content.addChild(content);

        if(enableCloseButton){
            // handle close
        }


        this.addChild(node);

    },

})