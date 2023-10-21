var LoginView = cc.Scene.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        const size = cc.director.getVisibleSize();
        const node = CCSUlties.parseUIFile(res_ui.LOGIN_SCENE);


        node.setAnchorPoint(0, 0);
        node.setPosition(0, 0);

        //set scale by width height
        node.setScale(size.width / node.width, size.height / node.height);

        const loginButton = node.getChildByName("button-login");
        loginButton.addTouchEventListener(this.handleClickLogin, this);
        this.loginButton = loginButton;

        const textFieldUID = node.getChildByName("textfield-uid");
        textFieldUID.addTouchEventListener(this.textFieldEvent, this);
        const cachedUID = cc.sys.localStorage.getItem("UID");
        if (cachedUID){
            textFieldUID.setString(cachedUID);
        }
        this.textFieldUID = textFieldUID;

        const loadingBar = node.getChildByName("loading-bar");
        this.loadingBar = loadingBar;

        const messageText = gv.commonText("", size.width / 2, loadingBar.y - 50);
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

        const interval = 0.2;
        const repeat = 5;
        const delay = 0;
        this.schedule(function() {
            this.loadingBar.setPercent(this.loadingBar.getPercent() + 10);
        }, interval, repeat, delay);
    },

    onReceiveUserInfo: function (userInfo) {
        PlayerInfoManager.Instance().setPlayerInfo({
            name: userInfo.name,
            avatar: userInfo.avatar,
            level: userInfo.level,
            rank: userInfo.rank
        });
        PlayerInfoManager.Instance().setResource({
            gold: userInfo.gold,
            elixir: userInfo.elixir,
            gem: userInfo.gem,
        });

        this.loadingBar.setPercent(this.loadingBar.getPercent() + 20);
        testnetwork.connector.sendGetArmyInfo();
    },

    onReceiveArmyInfo: function (armyInfo) {
        // MapManager.Instance().loadFromServer(armyInfo.listTroops);
        cc.log("NHAN THONG TIN VE LINH : "+JSON.stringify(armyInfo.listTroops))
        ArmyManager.Instance().setArmyAmount(armyInfo.listTroops);
        this.loadingBar.setPercent(this.loadingBar.getPercent() + 20);
        testnetwork.connector.sendGetTimeServer();
    },

    onReceiveTimeServer: function (time) {
        TimeManager.Instance().setDeltaTimeClientServer(time);
        this.loadingBar.setPercent(this.loadingBar.getPercent() + 10);
        testnetwork.connector.sendGetMapInfo();
    },

    onReceiveMapInfo: function (mapInfo) {
        MapManager.Instance().loadFromServer(mapInfo.listBuildings);
        this.loadingBar.setPercent(100);
        testnetwork.connector.sendGetTimeServer();
        this.onReceiveAllData();
    },

    onReceiveAllData: function () {
        cc.sys.localStorage.setItem("UID", PlayerInfoManager.Instance().id);
        cc.director.runScene(new GameScene());
    },

    onFinishLogin: function (success) {
        this.messageText.setColor(cc.color(255, 255, 255));
        this.fetchUserData();
        this.messageText.setString("Đăng nhập thành công. Đang tải dữ liệu...");
    },

    onConnectSuccess: function () {
        //cc.log('connect success')
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

