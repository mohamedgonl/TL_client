var GameScene = cc.Scene.extend({

    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        var mapLayer = new MapLayer();
        var infoLayer = new InfoLayer();
    }
});