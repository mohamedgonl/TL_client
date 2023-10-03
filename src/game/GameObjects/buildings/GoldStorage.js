var GoldStorage = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigGoldStorage(this.level));

        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
    },






});