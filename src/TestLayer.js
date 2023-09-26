
var TestLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        this.init();
    },

    init: function () {
        var builderHut = new BuilderHut();
        builderHut.setPosition(cc.p(500, 500));
        this.addChild(builderHut);

    }

});