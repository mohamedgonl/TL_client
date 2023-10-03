
var LoginView = cc.Scene.extend({
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
        textFieldUID.addEventListener(this.textFieldEvent, this);
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
            PlayerInfoManager.Instance().setId(uid);
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
        PlayerInfoManager.Instance().setInfo({
            name: "Nguyen Van A",
            avatar: "abc",
            level: "1",
            rank: "1",
        });
        PlayerInfoManager.Instance().setResource({
            gold: "500",
            elixir: "600",
            gem: "700",
        });
        this.loadedUserInfo = true;
        this.onReceiveData();
    },

    onReceiveMapInfo: function (mapInfo) {

        // PlayerInfoManager.Instance().setInfo({
        //     name: "Nguyen Van A",
        //     avatar: "abc",
        //     level: "1",
        //     rank: "1",
        // });
        // PlayerInfoManager.Instance().setResource({
        //     gold: "500",
        //     elixir: "600",
        //     gem: "700",
        // });
        MapManager.Instance().loadFromServer(mapInfo.listBuildings);


        this.loadedMapInfo = true;
        this.onReceiveData();
    },

    onReceiveData: function (){
        if (this.loadedMapInfo && this.loadedUserInfo){
            //fr.view(MapLayer)
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

