var InfoLayer = cc.Layer.extend({
    instance: null,

    button_container: null,
    ctor: function () {
        this._super();
        this.init();

    },

    //init UI, add to layer, init attributes, load resources
    init: function () {
        // var json = ccs.load(res_v2.studio.json.zcsd.game.player_info.LayerPlayerInfoInGame, res.ZCSD_ROOT);
        // this._rootNode = json.node;
        // this._rootNode.setContentSize(cc.winSize);
        // ccui.helper.doLayout(this._rootNode);
        // this.addChild(this._rootNode);

        var node = CCSUlties.parseUIFile(res_ui.INFO_LAYER);
        node.setContentSize(cc.winSize);
        ccui.helper.doLayout(node);
        //for all child in node, add to layer
        let children = node.getChildren();
        //add to attribute
        children.map(i => {
            this[i.getName()] = i;
            let childrenOfChildren = i.getChildren();
            childrenOfChildren.map(j => {
                this[i.getName()] [j.getName()] = j;
                let childrenOfChildrenOfChildren = j.getChildren();
                childrenOfChildrenOfChildren.map(k => {
                    this[i.getName()] [j.getName()] [k.getName()] = k;
                })
            })
        })

        this.addChild(node);
        // this.loadResources();
        this.addEventListener();

        //container for button when select building
        this.button_container = new cc.Node();
        this.addChild(this.button_container, 99999999);
        this.button_container.setPosition(cc.winSize.width / 2, 0);
        this.button_container.setVisible(false);
        this.button_container.nameBuilding = new cc.LabelBMFont("", res.FONT.SOJI[20], null, cc.TEXT_ALIGNMENT_CENTER);
        this.button_container.nameBuilding.setPosition(0, 140);
        this.button_container.addChild(this.button_container.nameBuilding);

        this.menu = new cc.Menu();
        this.menu.setPosition(cc.winSize.width / 2, 60);
        this.addChild(this.menu, 9999999999);
        this.menu.alignItemsHorizontallyWithPadding(10);

        // //cheat btn
        // const btnCheat = new ccui.Button();
        // btnCheat.setTitleText("CHEAT");
        // btnCheat.setTitleFontSize(24);
        // btnCheat.setPosition(1030, 460);
        //
        // btnCheat.addTouchEventListener(this.onClickBtnCheat, this);
        // this.addChild(btnCheat);

        this.btn_setting.addTouchEventListener(this.onClickBtnCheat, this);
        this.btn_train.addTouchEventListener(this.onClickBtnTrain, this);
        // this.btn_history = node.getChildByName("btn_history");
        this.btn_history.addTouchEventListener(this.onClickBtnHistory, this);
    },
    onClickBtnTrain: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            popUpLayer.appear(POPUP_IDS.TRAIN, {page: 0})
        }
    },
    onClickBtnHistory: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            popUpLayer.appear(POPUP_IDS.ATTACK_HISTORY)
        }
    },

    onClickBtnCheat: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            let cheatPopup = new CheatPopup({
                acceptCallBack: (data) => {
                    testnetwork.connector.sendCheatResource(data);
                    popUpLayer.setVisible(false);
                },
                cancleCallBack: () => {
                    popUpLayer.setVisible(false);
                    cheatPopup.removeFromParent(true);
                }
            })
            popUpLayer.addChild(cheatPopup);
            popUpLayer.setVisible(true);
        }

    },

    // add button to menu button_containerm, status = 0: normal, status =  1 show but text is red
    // 3 is disable, 2 is not add to menu
    addButtonToMenu: function (text, sprite, status, callback, amount, type) {
        //button
        // Tạo sprite cho trạng thái bình thường
        let node1 = CCSUlties.parseUIFile(res_ui.BUTTON_OF_BUILDING);
        let node2 = CCSUlties.parseUIFile(res_ui.BUTTON_OF_BUILDING);
        let node3 = CCSUlties.parseUIFile(res_ui.BUTTON_OF_BUILDING);

        for (let i = 0; i < 3; i++) {
            let node;
            if (i === 0)
                node = node1;
            else if (i === 1)
                node = node2;
            else
                node = node3;

            let children = node.getChildren();
            //add to attribute
            children.map(i => {
                node[i.getName()] = i;
                let childrenOfChildren = i.getChildren();
                childrenOfChildren.map(j => {
                    node[i.getName()] [j.getName()] = j;
                    let childrenOfChildrenOfChildren = j.getChildren();
                    childrenOfChildrenOfChildren.map(k => {
                        node[i.getName()] [j.getName()] [k.getName()] = k;
                    })
                })
            });

            node.sprite.setVisible(false);
            //set text
            node.text.setString(text);

            //set amount
            if (amount != null)
                node.amount.setString(Utils.numberToText(amount));
            else
                node.amount.setVisible(false);

            //set type
            if (type != null) {
                if (type === "elixir")
                    node.type.setTexture(res.ICON.ELIXIR);
                else if (type === "gold")
                    node.type.setTexture(res.ICON.GOLD);
                else
                    node.type.setTexture(res.ICON.GEM)

            } else
                node.type.setVisible(false);

            //status

            if (status === 1) {
                node.amount.setColor(cc.color.RED);
            }

        }


        let image = new cc.Sprite(sprite);
        image.addChild(node1);
        // Tạo sprite cho trạng thái nhấn
        let imagePressed = new cc.Sprite(sprite);
        imagePressed.setColor(cc.color.GRAY);
        imagePressed.addChild(node2);
        //phong to 1.1
        imagePressed.setScale(1.1);
        imagePressed.setAnchorPoint(0.5, 0.5);

        let imageDisabled = new cc.Sprite(sprite);
        imageDisabled.setColor(cc.color.GRAY);
        imageDisabled.addChild(node3);

        var button = new cc.MenuItemSprite(image, imagePressed, imageDisabled, callback, this);
        if (status === 3) {
            //disable
            button.setEnabled(false);
            //set to gray
            // button.setDisabledColor(cc.color.GRAY);
        }


        this.menu.addChild(button);
        this.menu.alignItemsHorizontallyWithPadding(10);
    },
    removeAllButtonInMenu: function () {
        this.menu.removeAllChildren();
    },


    //after init UI, get all resources to display
    loadResources: function () {
        var resource = PlayerInfoManager.getInstance().resource;
        var maxResource = PlayerInfoManager.getInstance().maxResource;
        var builder = PlayerInfoManager.getInstance().builder;
        var info = PlayerInfoManager.getInstance().info;
        let armyCurrent = ArmyManager.getInstance().getCurrentSpace();
        let armyMax = ArmyManager.getInstance().getMaxSpace();

        //cc.log all above
        cc.log("resource: " + JSON.stringify(resource));
        cc.log("maxResource: " + JSON.stringify(maxResource));
        cc.log("builder: " + JSON.stringify(builder));
        cc.log("info: " + JSON.stringify(info));
        cc.log("army: " + JSON.stringify({current: armyCurrent, max: armyMax}));


        // var army = PlayerInfoManager.getInstance().army;
        //update UI
        this.updateUI({
            resource: resource,
            maxResource: maxResource,
            builder: builder,
            info: info,
            army: {current: armyCurrent, max: armyMax}
        });
    },

//add event listener to button
    addEventListener: function () {
        this.addTouchEventForButton(this.btn_attack, this.onTouchFight);
        this.addTouchEventForButton(this.btn_shop, this.onTouchShop);
        this.addTouchEventForButton(this.btn_setting, this.onTouchSetting);
        this.addTouchEventForButton(this.g_container.btn_add, this.onTouchGAdd);
        this.addTouchEventForButton(this.army_container.btn_add, this.onTouchArmyAdd);
        this.addTouchEventForButton(this.builder_container.btn_add, this.onTouchBuilderAdd);

        //listen to EVENT_SELECT_BUILDING with callback onSelectBuilding(id)
        cc.eventManager.addCustomListener(EVENT_SELECT_BUILDING, this.onSelectBuilding.bind(this));
        //listen to EVENT_UNSELECT_BUILDING with callback onUnselectBuilding()
        cc.eventManager.addCustomListener(EVENT_UNSELECT_BUILDING, this.onUnselectBuilding.bind(this));

    },
    addTouchEventForButton: function (button, callback) {
        button.addTouchEventListener(callback, this);
        button.setPressedActionEnabled(true);
    },

    onTouchArmyAdd: function (sender, type) {
        if (type === 2) {
            let popUpLayer = cc.director.getRunningScene().getPopUpLayer();
            if (ArmyManager.getInstance().getBarrackList().length) {
                if (popUpLayer.isVisible()) {
                    popUpLayer.disappear(POPUP_IDS.TRAIN);
                } else {
                    popUpLayer.appear(POPUP_IDS.TRAIN, {page: 0});
                }
            }
        }
    },

    onTouchShop: function (sender, type) {
        if (type === 2) {
            cc.log("onTouchShop:::::::::::::::::::::::::::");
            let popUplayer = cc.director.getRunningScene().getPopUpLayer();
            popUplayer.appear(POPUP_IDS.SHOP);
        }
    },

    onTouchFight: function (sender, type) {
        if (type === 2) {
            let popUplayer = cc.director.getRunningScene().getPopUpLayer();
            popUplayer.appear(POPUP_IDS.FIGHT);
        }
    },

    updateUI: function (data) {
        if (data == null) return;

        //resource
        if (data.resource != null) {
            let res = data.resource;
            if (res.gold != null) {
                this.gold_container.getChildByName("text").setString(Utils.numberToText(res.gold));
                let barPercent = res.gold / PlayerInfoManager.getInstance().getMaxResource().gold;

                if (barPercent >= 0 && barPercent <= 1)
                    this.gold_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (res.elixir != null) {
                this.elixir_container.text.setString(Utils.numberToText(res.elixir));
                let barPercent = res.elixir / PlayerInfoManager.getInstance().getMaxResource().elixir;

                if (barPercent >= 0 && barPercent <= 1)
                    this.elixir_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (res.gem != null) {
                this.g_container.text.setString(Utils.numberToText(res.gem));
            }
        }

        //info
        if (data.info != null) {
            if (data.info.name != null) {
                this.username_container.username.setString(data.info.name);
            }
        }

        //max resource
        if (data.maxResource != null) {
            if (data.maxResource.gold != null) {
                this.gold_container.text_max.setString("Tối đa:" +Utils.numberToText(data.maxResource.gold));
                let barPercent = PlayerInfoManager.getInstance().getResource().gold / data.maxResource.gold;
                this.gold_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (data.maxResource.elixir != null) {
                this.elixir_container.text_max.setString("Tối đa:" +Utils.numberToText(data.maxResource.elixir));
                let barPercent = PlayerInfoManager.getInstance().getResource().elixir / data.maxResource.elixir;
                this.elixir_container.bar_bg.bar.setPercent(barPercent * 100);
            }
        }
        if (data.builder != null) {
            //set text builder = available/total
            this.builder_container.text.setString(data.builder.current + "/" + data.builder.max);
        }
        //army
        if (data.army != null) {
            //set text army = available/total
            this.army_container.text.setString(data.army.current + "/" + data.army.max);
        }
    },

    onSelectBuilding: function (event) {
        let id = event.getUserData();
        cc.log("onSelectBuilding::::::::::::::::" + id)
        let building = MapManager.getInstance().getBuildingById(id);

        //select temporary building, return
        if (building == null) {
            this.menu.removeAllChildren();
            return;
        }

        //rename nameBuilding
        //if building is start with OBS
        if (building._type.startsWith(GAMEOBJECT_PREFIX.OBSTACLE)) {
            //get gold and elixir of building
            let priceGold = LoadManager.getInstance().getConfig(building._type, building._level, "gold");
            let priceElixir = LoadManager.getInstance().getConfig(building._type, building._level, "elixir");
            if (priceGold != null) {
                this.button_container.nameBuilding.setString("Vật cản");
            } else
                this.button_container.nameBuilding.setString("Cây cối");
        } else
            this.button_container.nameBuilding.setString(BuildingInfo[building._type].name);

        cc.log("---------------button containet TRUE------")
        this.button_container.setVisible(true);
        //test

    },
    onUnselectBuilding: function (event) {
        this.button_container.setVisible(false);
        this.removeAllButtonInMenu();
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
btn_train
*/
