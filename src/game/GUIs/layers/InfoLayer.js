var InfoLayer = cc.Layer.extend({
    instance: null,
    ctor: function () {
        this._super();
        this.init();

        //add touch to this.btn_shop

    },
    onTouchShop: function (sender, type) {
      //log open shop giua man hinh
        cc.log("open shop");
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
        this.btn_shop.addTouchEventListener(this.onTouchShop, this);
        this.btn_shop.setPressedActionEnabled(true);

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

    },
    updateUI: function (event) {

        if(event == null) return;

        //resource
        if (event.gold) {
            this.gold_container.text.setString(event.gold);
        }
        if (event.elixir) {
            this.elixir_container.text.setString(event.elixir);
        }
        if (event.gem) {
            this.g_container.text.setString(event.gem);
        }

        //info
        if (event.name) {
            this.username_container.username.setString(event.name);
        }
        
    },


    test: function (data,category) {
        this._super()
        let node = CCSUlties.parseUIFile(res_ui.SHOP_ITEM);
        // find shop_item_node
        let item = node.getChildByName("shop_item_node");
        this._itemNode = item;
        this._data = data;
        this.setItemInfo(data,category);
        this.addChild(node);
    },

});

InfoLayer.Instance = function () {
    if (InfoLayer.instance == null) {
        InfoLayer.instance = new InfoLayer();
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
