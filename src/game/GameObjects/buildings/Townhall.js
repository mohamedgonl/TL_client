var Townhall = Building.extend({
    gold: null,
    elixir: null,
    capacityGold: null,
    capacityElixir: null,
    _type: "TOW_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        this.init();

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.TOWNHALL[level],null,1);
    },
    //init all properties
    init: function () {
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        //chua lam gold va elixir
        this.gold = 0;
        this.elixir = 0;
        this.capacityGold = config.capacityGold;
        this.capacityElixir = config.capacityElixir;
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();
        mapManager.townHall = this;
        let capacityGold = LoadManager.Instance().getConfig(this._type,this._level,"capacityGold");
        let capacityElixir = LoadManager.Instance().getConfig(this._type,this._level,"capacityElixir");
        playerInfoManager.changeMaxResource("gold",capacityGold);
        playerInfoManager.changeMaxResource("elixir",capacityElixir);
    },
    checkCanUpgrade: function () {
        return true;
    },
    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();
        let capacityGold = LoadManager.Instance().getConfig(this._type,this._level,"capacityGold");
        let capacityElixir = LoadManager.Instance().getConfig(this._type,this._level,"capacityElixir");
        playerInfoManager.setMaxResource({gold:capacityGold,elixir:capacityElixir});
    }

});


