var BuilderHut = Building.extend({
        _width: null,
        _height: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigBuilderHut(this.level));
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1)
    }

});