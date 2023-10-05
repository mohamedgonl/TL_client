var InfoLayer = cc.Layer.extend({
        instance: null,
        ctor: function () {
            this._super();
            this.init();
            this.loadFromServer();
            //update all UI
        },
        loadFromServer: function () {
            
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

            //add touch event to btn_shop
            this.btn_shop.addTouchEventListener(this.onTouchShop, (this));
            this.btn_shop.setPressedActionEnabled(true);

            //add touch event to btn_attack
            this.btn_attack.addTouchEventListener(this.onTouchArmyAdd, this);
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

        updateUI: function (event) {
            cc.log("updateUI: " + JSON.stringify(event, null, 2));
            return

            //
            if (event == null) return;


            //resource
            if (data.resource) {
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
                    this.gold_container.text_max.setString(data.maxResource.gold);
                }
                if(data.maxResource.elixir){
                    this.elixir_container.text_max.setString(data.maxResource.elixir);
                }
            }


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
        }
        ,

    })
;

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
