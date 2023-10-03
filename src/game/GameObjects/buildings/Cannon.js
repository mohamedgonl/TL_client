var Cannon = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigCannon(this.level));

        var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
    },

});