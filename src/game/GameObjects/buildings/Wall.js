var Wall = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigWall(this.level));

        this.loadSprite(res_map.SPRITE.BODY.WALL[level],null,0);
    },






});