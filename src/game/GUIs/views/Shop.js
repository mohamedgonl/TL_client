var Shop = cc.Sprite.extend({
    resource: {
        gold: null,
        elixir: null,
        gem: null,
    },
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        let json = ccs.load(res_ui.SHOP_POPUP);
        let layout = json.node;
        this.addChild(layout);

    }
})

