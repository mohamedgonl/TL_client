var LoginView = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        const node = CCSUlties.parseUIFile(res_ui.LOGIN_SCENE);
        node.setAnchorPoint(0, 0);
        node.setPosition(0, 0);

        const loginButton = node.getChildByName("Button_1");
        loginButton.addTouchEventListener(this.handleClickLogin, this);

        const textFieldUID = node.getChildByName("login-textfield");
        this.textFieldUID = textFieldUID;

        const messageText = gv.commonText("", this.width / 2, textFieldUID.y - 110);
        this.messageText = messageText;

        this.addChild(node);
        this.addChild(messageText);
    },

    handleClickLogin: function () {
        const uid = Number(this.textFieldUID.getString());
        if (uid > 0) {
            this.messageText.setColor(cc.color(255, 255, 255));
            this.messageText.setString("login: " + uid);
        } else {
            this.messageText.setColor(cc.color(255, 0, 0));
            this.messageText.setString('UID không hợp lệ!');
        }
    },

    textFieldEvent: function (sender, type) {
        // if (this.messageText.getString().length > 0) {
        //     this.messageText.setColor(cc.color(255, 255, 255));
        //     this.messageText.setColor(cc.color(255, 255, 255));
        // }
    }
});

