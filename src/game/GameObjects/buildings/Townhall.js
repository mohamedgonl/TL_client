var Townhall = Building.extend({
    gold: null,
    elixir: null,

    capacityGold: null,
    capacityElixir: null,
    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.loadConfig(ConfigManager.Instance().getConfigTownHall(this.level));
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
    },






});