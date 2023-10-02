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
            console.log(i.getName());
            let childrenOfChildren = i.getChildren();

            childrenOfChildren.map(j => {
                this[i.getName()] [j.getName()] = j;
                console.log("    " + j.getName())
            })

        })

        this.addChild(node);

        this.updateArmy();
        this.updateBuilder();

        this.btn_shop.addTouchEventListener(this.onTouchShop, this);
        this.btn_shop.setPressedActionEnabled(true);

    },
    update: function (event) {
        // if have event.gold , update gold

        if (event.gold) {
            this.gold_container.text.setString(event.gold);
        }
        if (event.elixir) {
            this.elixir_container.text.setString(event.elixir);
        }
        if (event.gem) {
            this.g_container.text.setString(event.gem);
        }
        // if(event.army){
        //     this.army_container.text.setString(event.army +"/"+);
        // }
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
