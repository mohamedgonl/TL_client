var InfoLayer = cc.Layer.extend({
    instance: null,

    gold_container: {
        bar_bg: null,
        bar: null,
        icon: null,
        text_max: null,
        text: null
    },
    elixir_container: {
        bar_bg: null,
        bar: null,
        icon: null,
        text_max: null,
        text: null
    },
    g_container: {
        bar_bg: null,
        icon: null,
        btn_add: null,
        text: null
    },
    builder_container: {
        bar_bg: null,
        icon: null,
        btn_add: null,
        text: null
    },
    army_container: {
        bar_bg: null,
        icon: null,
        btn_add: null,
        text: null
    },
    username_container: {
        elo_bar_bg: null,
        elo_icon: null,
        exp_bar_bg: null,
        exp_bar: null,
        exp_icon: null,
        avt: null,
        username: null
    },
    btn_attack: {
        text: null
    },
    btn_shop: {
        text: null
    },
    btn_setting: {
        text: null
    },

    ctor: function () {
        this._super();
        this.init();
        this._addEventListener()
    },

    updateAllUI: function () {
      var data = PlayerInfoManager.getInstance().getAllInfo();
    },
    //init UI, add to layer, init attributes
    init: function () {
        var node = CCSUlties.parseUIFile(res_ui.INFO_LAYER);
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
        this.addChild(node);
    },

    //add event listener for all button and listen to event from PlayerInfoManager
    _addEventListener: function () {
        //add touch event to btn_shop
        this.btn_shop.addTouchEventListener(this.onTouchShop, (this));
        // this.btn_shop.setPressedActionEnabled(true);

        //add touch event to btn_attack
        this.btn_attack.addTouchEventListener(this.onTouchAttack, this);
        this.btn_attack.setPressedActionEnabled(true);

        //add touch event to btn_setting
        this.btn_setting.addTouchEventListener(this.onTouchSetting, this);
        this.btn_setting.setPressedActionEnabled(true);

        //add touch event to btn_add_G
        this.g_container.btn_add.addTouchEventListener(this.onTouchGAdd, this);
        this.g_container.btn_add.setPressedActionEnabled(true);

        //add touch event to army add button
        this.army_container.btn_add.addTouchEventListener(this.onTouchArmyAdd, this);
        this.army_container.btn_add.setPressedActionEnabled(true);

        //add touch event to builder add button
        this.builder_container.btn_add.addTouchEventListener(this.onTouchBuilderAdd, this);
        this.builder_container.btn_add.setPressedActionEnabled(true);
        //add event listener change Info UI
        {
            cc.eventManager.addListener({
                event: cc.EventListener.CUSTOM,
                eventName: EVENT_PLAYER_INFO_CHANGED,
                callback: this.updateUI.bind(this)
            }, this);
        }
    },

    onTouchArmyAdd : function (sender, type) {
        if(type === 2 ){

            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            if(popUpLayer.isVisible()) {
                popUpLayer.disappear();
            }
            else {
                popUpLayer.appear("train");
            }
        }
    },
    onTouchShop: function (sender, type) {
        if(type === 2) {
            cc.log("open shop");
            let popUplayer = cc.director.getRunningScene().getPopUpLayer();
            if(popUplayer.isVisible()) {
                popUplayer.disappear();
            }
            else {
                popUplayer.appear("shop");
            }
        }
    },

    updateUI: function (event) {
        //checked
        var data = event.getUserData();

        if(data == null) return;

        if(data.resource) {
            let resource = data.resource;
            if(resource.gold) {
                this.gold_container.text.setString(resource.gold);
            }
            if(resource.elixir) {
                this.elixir_container.text.setString(resource.elixir);
            }
            if(resource.gem) {
                this.g_container.text.setString(resource.gem);
            }
        }

        if(data.info) {
            let info = data.info;
            if(info.name) {
                this.username_container.username.setString(info.name);
            }
        }
    },


});


/*
gold_container
    bar_bg
    bar
    icon
    text_max
    text
elixir_container
    bar_bg
    bar
    icon
    text_max
    text
g_container
    bar_bg
    icon
    btn_add
    text
builder_container
    bar_bg
    icon
    btn_add
    text
army_container
    bar_bg
    icon
    btn_add
    text
username_container
    elo_bar_bg
    elo_icon
    exp_bar_bg
    exp_bar
    exp_icon
    avt
    username
btn_attack
    text
btn_shop
    text
btn_setting
*/
