var InfoLayer = cc.Layer.extend({
    instance: null,

    button_container: null,
    ctor: function () {
        this._super();
        this.init();
        //size
        cc.log("InfoLayer ctor:::::::::::::::", JSON.stringify(this.getContentSize()));

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
        //scale by width
        // node.setScaleX(cc.winSize.width/node.getContentSize().width);
        // node.setScaleY(cc.winSize.height/node.getContentSize().height);

        // node.width = cc.winSize.width;
        // node.height = cc.winSize.height;

        // cc.log("================",JSON.stringify(node.getContentSize()));
        this.addChild(node);
        this.loadResources();
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
    },

    onClickBtnCheat: function (sender, type) {
        if (type === ccui.Widget.TOUCH_ENDED) {
            let gameScene = cc.director.getRunningScene();
            let popUpLayer = gameScene.getPopUpLayer();
            cc.log("aaa")
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
                node.amount.setString(amount);
            else
                node.amount.setVisible(false);

            //set type
            if (type != null) {
                if (type === "elixir")
                    node.type.setTexture(res.ICON.ELIXIR);
                else if(type === "gold")
                    node.type.setTexture(res.ICON.GOLD);
                else
                    node.type.setTexture(res.ICON.GEM)

            } else
                node.type.setVisible(false);

            //status

            if(status ===1 )
            {
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
        if(status ===3)
        {
            //disable
            button.setEnabled(false);
            //set to gray
            // button.setDisabledColor(cc.color.GRAY);
        }

        // let labelText = new cc.LabelBMFont(text, res.FONT.SOJI[16], null, cc.TEXT_ALIGNMENT_CENTER);
        // //label hien o giua duoi cua button
        // labelText.setPosition(spriteWidth / 2, spriteHeight / 11);
        // labelText.setAnchorPoint(0.5, 0);
        // button.addChild(labelText);
        //
        // if (textResource != null) {
        //     let labelResource = new cc.LabelBMFont(textResource, res.FONT.SOJI[16], null, cc.TEXT_ALIGNMENT_CENTER);
        //     //label hien o giua tren cua button
        //     labelResource.setPosition(spriteWidth * 0.6, spriteHeight / 11 * 10);
        //     labelResource.setAnchorPoint(0.8, 1);
        //     button.addChild(labelResource);
        //
        //     //icon cua resource
        //     if (typeResource != null) {
        //         let iconSprite = new cc.Sprite();
        //         switch (typeResource) {
        //             case "gold":
        //                 iconSprite.setTexture(res.ICON.GOLD);
        //                 break;
        //             case "elixir":
        //                 iconSprite.setTexture(res.ICON.ELIXIR);
        //                 break;
        //         }
        //         iconSprite.setScale(0.6)
        //         button.addChild(iconSprite);
        //         //set position for icon in top right of button
        //         iconSprite.setPosition(spriteWidth * 0.8, spriteHeight / 10 * 8);
        //     }
        //     if(status === 1) {
        //         //change color of text to red
        //         labelResource.setColor(cc.color.RED);
        //     }
        // }


        this.menu.addChild(button);
        this.menu.alignItemsHorizontallyWithPadding(10);
    },
    removeAllButtonInMenu: function () {
        this.menu.removeAllChildren();
    },


    //after init UI, get all resources to display
    loadResources: function () {
        var resource = PlayerInfoManager.Instance().resource;
        var maxResource = PlayerInfoManager.Instance().maxResource;
        var builder = PlayerInfoManager.Instance().builder;
        var info = PlayerInfoManager.Instance().info;
        let armyCurrent = ArmyManager.Instance().getCurrentSpace();
        let armyMax = ArmyManager.Instance().getMaxSpace();
        // var army = PlayerInfoManager.Instance().army;
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
        this.addTouchEventForButton(this.btn_attack, this.onTouchArmyAdd);
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
            if(ArmyManager.Instance().getBarrackList().length){
                if (popUpLayer.isVisible()) {
                    popUpLayer.disappear("train");
                } else {
                    popUpLayer.appear("train", {page: 0});
                }
            }
        }
    },

    onTouchShop: function (sender, type) {
        if (type === 2) {
            let popUplayer = cc.director.getRunningScene().getPopUpLayer();
            if (popUplayer.isVisible()) {
                cc.log("onTouchShop:::::::::::::::::::::::::::");
                popUplayer.disappear("shop");
            } else {
                popUplayer.appear("shop");
            }
        }
    },

    updateUI: function (data) {
        if (data == null) return;

        //resource
        if (data.resource != null) {
            let res = data.resource;
            if (res.gold != null) {
                this.gold_container.getChildByName("text").setString(res.gold);
                let barPercent = res.gold / PlayerInfoManager.Instance().getMaxResource().gold;
                this.gold_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (res.elixir != null) {
                this.elixir_container.text.setString(res.elixir);
                let barPercent = res.elixir / PlayerInfoManager.Instance().getMaxResource().elixir;
                this.elixir_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (res.gem != null) {
                this.g_container.text.setString(res.gem);
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
                this.gold_container.text_max.setString("Tối đa:" + data.maxResource.gold);
                let barPercent = PlayerInfoManager.Instance().getResource().gold / data.maxResource.gold;
                this.gold_container.bar_bg.bar.setPercent(barPercent * 100);
            }
            if (data.maxResource.elixir != null) {
                this.elixir_container.text_max.setString("Tối đa:" + data.maxResource.elixir);
                let barPercent = PlayerInfoManager.Instance().getResource().elixir / data.maxResource.elixir;
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
        let building = MapManager.Instance().getBuildingById(id);

        //rename nameBuilding
        //if building is start with OBS
        if (building._type.startsWith("OBS")) {
            //get gold and elixir of building
            let priceGold = LoadManager.Instance().getConfig(building._type, building._level, "gold");
            let priceElixir = LoadManager.Instance().getConfig(building._type, building._level, "elixir");
            if(priceGold !=null)
            {
                this.button_container.nameBuilding.setString("Vật cản");
            }
            else
                this.button_container.nameBuilding.setString("Cây cối");
        }
        else
            this.button_container.nameBuilding.setString(BuildingInfo[building._type].name);
        this.button_container.setVisible(true);
        //test

    },
    onUnselectBuilding: function (event) {
        this.button_container.setVisible(false);
        this.removeAllButtonInMenu();
    },

});

InfoLayer.Instance = function () {
    if (!InfoLayer.instance) {
        InfoLayer.instance = new InfoLayer();
        InfoLayer.instance.retain();
    }
    return InfoLayer.instance;
}

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
