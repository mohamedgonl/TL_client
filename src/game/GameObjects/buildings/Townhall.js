var Townhall = Building.extend({
    gold: null,
    elixir: null,
    _width: null,
    _height: null,
    capacityGold: null,
    capacityElixir: null,
    ctor: function (level,posX,posY) {
        this._super(level,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigTownHall(this.level));
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
    },






});