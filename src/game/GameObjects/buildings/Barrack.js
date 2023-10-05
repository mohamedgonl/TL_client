var Barrack = Building.extend({
    _upper: null,
    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigBarrack(this.level));

        this.loadSprite(res_map.SPRITE.BODY.BARRACK[level],null,1);
        this.loadSubSprite();
    },






});