var GoldStorage = Building.extend({
    _upper: null,
    _type: "STO_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);


        // this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentGold = 0;
        this._capacityGold = config.capacity;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level][0],null,1);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        let playerInfoManager = PlayerInfoManager.Instance();

        mapManager.addToListStorage(this);
        let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");
        playerInfoManager.changeMaxResource("gold",capacity);
    },
    completeUpgrade: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();
        let capacity = LoadManager.Instance().getConfig(this._type,this._level,"capacity");
        playerInfoManager.setMaxResource({gold:capacity});
    }






});