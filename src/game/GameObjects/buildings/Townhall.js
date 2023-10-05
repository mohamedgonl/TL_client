var Townhall = Building.extend({
    gold: null,
    elixir: null,
    capacityGold: null,
    capacityElixir: null,
    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);

        this.init();

        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
        this.loadSubSprite();
    },

    //init all properties
    init: function () {
        let config = LoadManager.Instance().getConfig(this.type,this.level);
        this.gold = 0;
        this.elixir = 0;
        this.capacityGold = config.capacityGold;
        this.capacityElixir = config.capacityElixir;
    }




});