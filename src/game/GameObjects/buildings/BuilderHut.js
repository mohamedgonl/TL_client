var BuilderHut = Building.extend({

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigBuilderHut(this.level));
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1)
        this.loadSubSprite();
    },

});