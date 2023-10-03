var GoldMine = Building.extend({
    _upper: null,
    _width: null,
    _height: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigGoldMine(this.level));

        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level] + "/image0000.png";
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],upper_sprite,1);
    },






});