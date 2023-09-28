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
        this.loginButton = loginButton;

        const textFieldUID = node.getChildByName("login-textfield");
        textFieldUID.addTouchEventListener(this.textFieldEvent, this);
        this.textFieldUID = textFieldUID;

        const messageText = gv.commonText("", this.width / 2, textFieldUID.y - 110);
        this.messageText = messageText;

        this.addChild(node);
        this.addChild(messageText);
    },

    resetMessage: function () {
        if (this.messageText.getString().length > 0) {
            this.messageText.setColor(cc.color(255, 255, 255));
            this.messageText.setString('');
        }
    },

    handleClickLogin: function () {
        this.resetMessage();
        const uid = Number(this.textFieldUID.getString());
        if (uid > 0) {
            // this.messageText.setColor(cc.color(255, 255, 255));
            // this.messageText.setString("login: " + uid);
            this.loginButton.enabled = false;
            this.textFieldUID.enabled = false;
            PlayerInfoManager.setInfo({id: uid});
            gv.gameClient.connect();
        } else {
            this.messageText.setColor(cc.color(255, 0, 0));
            this.messageText.setString('UID không hợp lệ!');
        }
    },

    fetchUserData: function () {
        testnetwork.connector.sendGetUserInfo();
        testnetwork.connector.sendGetMapInfo();
    },

    onReceiveUserInfo: function (userInfo) {
        PlayerInfoManager.setInfo({
            name: userInfo.name,
            avatar: userInfo.avatar,
            level: userInfo.level,
            rank: userInfo.rank,
        });
        PlayerInfoManager.setResource({
            gold: userInfo.gold,
            elixir: userInfo.elixir,
            gem: userInfo.gem,
        });
        this.loadedUserInfo = true;
        this.onReceiveData();
    },

    onReceiveMapInfo: function (mapInfo) {
        GameManager.init(mapInfo.listBuildings);
        this.loadedMapInfo = true;
        this.onReceiveData();
    },

    onReceiveData: function (){
        if (this.loadedMapInfo && this.loadedUserInfo){
            cc.director.runScene(new GameScene());
        }
    },

    onFinishLogin: function (success) {
        this.messageText.setColor(cc.color(255, 255, 255));
        this.fetchUserData();
        this.messageText.setString("Đăng nhập thành công. Đang tải dữ liệu...");
    },

    onConnectSuccess: function () {
        cc.log('connect success')
    },

    onConnectFail: function (text) {
        this.loginButton.enabled = true;
        this.messageText.setColor(cc.color(255, 255, 255));
        this.messageText.setString("Đăng nhập thất bại, vui lòng thử lại!");
        cc.log('connect fail: ' + text);
    },

    textFieldEvent: function (sender, type) {
        this.resetMessage();
    }
});

