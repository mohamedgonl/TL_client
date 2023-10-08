var InfoLayer = cc.Layer.extend({
        instance: null,
        ctor: function () {
            this._super();
            this.init();
        },

        //init UI, add to layer, init attributes, load resources
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
            this.loadResources();
            this.addEventListener();
        },

        //after init UI, get all resources to display
        loadResources: function () {
            var resource = PlayerInfoManager.Instance().resource;
            var maxResource = PlayerInfoManager.Instance().maxResource;
            var builder = PlayerInfoManager.Instance().builder;
            var info = PlayerInfoManager.Instance().info;
            // var army = PlayerInfoManager.Instance().army;
            //update UI
            this.updateUI({resource: resource, maxResource: maxResource, builder: builder, info: info});
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
                if (popUpLayer.isVisible()) {
                    popUpLayer.disappear();
                } else {
                    popUpLayer.appear("train");
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
            if (data.resource) {
                cc.log("data.resource: " + JSON.stringify(data.resource, null, 2));
                let res = data.resource;
                if (res.gold) {
                    this.gold_container.getChildByName("text").setString(res.gold);
                }
                if (res.elixir) {
                    this.elixir_container.text.setString(res.elixir);
                }
                if (res.gem) {
                    this.g_container.text.setString(res.gem);
                }
            }

            //info
            if (data.info) {
                if (data.info.name) {
                    this.username_container.username.setString(data.info.name);
                }
            }

            //max resource
            if (data.maxResource) {
                if(data.maxResource.gold){
                    this.gold_container.text_max.setString("Tối đa:"+data.maxResource.gold);
                }
                if(data.maxResource.elixir){
                    this.elixir_container.text_max.setString("Tối đa:"+data.maxResource.elixir);
                }
            }
            if(data.builder){
                //set text builder = available/total
                this.builder_container.text.setString(data.builder.available + "/" + data.builder.total);
            }
            //army ------------------------------------------------------------
        },

        test: function (data, category) {
            this._super()
            let node = CCSUlties.parseUIFile(res_ui.SHOP_ITEM);
            // find shop_item_node
            let item = node.getChildByName("shop_item_node");
            this._itemNode = item;
            this._data = data;
            this.setItemInfo(data, category);
            this.addChild(node);
        },

        onSelectBuilding: function (event) {
            let id = event.getUserData();
            let building = MapManager.Instance().getBuildingById(id);
            this.building_button = new SelectedBuildingContainer(building);
            this.addChild(this.building_button,9999);
            //set pos at middle bottom of screen
            this.building_button.setPosition(cc.winSize.width / 2, 0);
        },

        onUnselectBuilding: function (event) {
            if (this.building_button) {
                this.building_button.removeFromParent(true);
                this.building_button = null;
            }
        }


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
