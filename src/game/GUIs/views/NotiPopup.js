var NotiPopup = cc.Layer.extend({
    ctor: function ({title, content, cancleButton, acceptButton,
                        cancleButtonContent, acceptButtonContent, cancleCallBack,
                        acceptCallBack}) {
        this._super();
        let node = CCSUlties.parseUIFile();

        this.addChild(node);

    },

    setData : function () {
        
    }
})