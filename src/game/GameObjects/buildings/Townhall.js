var Townhall = Building.extend({
    gold: null,
    elixir: null,
    capacityGold: null,
    capacityElixir: null,
    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);

        this.init();

        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
        this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },

    //init all properties
    init: function () {
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this.gold = 0;
        this.elixir = 0;
        this.capacityGold = config.capacityGold;
        this.capacityElixir = config.capacityElixir;
    }




});