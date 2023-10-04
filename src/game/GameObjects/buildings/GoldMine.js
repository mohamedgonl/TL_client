var GoldMine = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigGoldMine(this.level));

        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level] + "/image0000.png";
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],upper_sprite,1);
    },






});