var BattleScene = cc.Scene.extend({

    mapLayer: null,
    popUpLayer: null,
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        this.battleLayer = new BattleLayer();
        this.battleUILayer = new BattleUILayer();
        this.addChild(this.battleLayer);
        this.addChild(this.battleUILayer);
    },
});
