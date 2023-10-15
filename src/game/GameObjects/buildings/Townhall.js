var Townhall = Building.extend({
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
        this._currentGold = 0;
        this._currentElixir = 0;
        this._capacityGold = config.capacityGold;
        this._capacityElixir = config.capacityElixir;
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
        let capacityGold = LoadManager.Instance().getConfig(this._type, this._level, "capacityGold");
        let capacityElixir = LoadManager.Instance().getConfig(this._type, this._level, "capacityElixir");
        testnetwork.connector.sendGetMapInfo();
    },
    completeUpgrade: function () {
        this._super();
        this._capacityGold  = LoadManager.Instance().getConfig(this._type,this._level,"capacityGold");
        this._capacityElixir  = LoadManager.Instance().getConfig(this._type,this._level,"capacityElixir");

    }

});


