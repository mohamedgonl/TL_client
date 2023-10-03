var Barrack = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigBarrack(this.level));

        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
    },






});