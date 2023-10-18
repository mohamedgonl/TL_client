var ElixirStorage = Building.extend({
    _upper: null,
    _type: "STO_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
        // this.loadSubSprite();
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentElixir = 0;
        this._capacityElixir = config.capacity;
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level][0], null,1);
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
                playerInfoManager.changeMaxResource("elixir",capacity);
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
        playerInfoManager.changeMaxResource("elixir",amountIncrease);
    }





});