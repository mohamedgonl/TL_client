var ElixirStorage = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigElixirStorage(this.level));

        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
    },






});