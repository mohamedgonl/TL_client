var GoldStorage = Building.extend({
    _upper: null,
    _type: "STO_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentGold = 0;
        this._capacityGold = config.capacity;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level][0],null,1);
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();

        mapManager.addToListStorage(this);
        switch (this._state){
            case 0:
            case 2:
                let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");
                playerInfoManager.changeMaxResource("gold",capacity);
                break;
            case 1:
                break;
        }
    },
    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();

        let amountBefore = LoadManager.Instance().getConfig(this._type,this._level - 1,"capacity")|| 0;
        let amountIncrease = LoadManager.Instance().getConfig(this._type,this._level,"capacity") - amountBefore;
        playerInfoManager.changeMaxResource("gold",amountIncrease);
    }






});