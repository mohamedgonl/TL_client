var ElixirMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        let config = LoadManager.Instance().getConfig(this._type,this._level);
        this._currentElixir = 0;
        this._capacityElixir = config.capacity;
        this._productionElixir = config.productivity;

    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },

    loadSpriteByLevel: function (level) {
        // var upper_sprite = res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level] + "/image0000.png";
        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],upper_sprite,1);
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level],1,1);
    },
    loadButton: function () {
        if(this._super() === -1) return;
        let infoLayer = cc.director.getRunningScene().infoLayer;

        //button thu hoach
        if(this._state ===0) {
            let timeNow = TimeManager.Instance().getCurrentTimeInSecond();
            //delay 5s between 2 harvest
            if(timeNow - this._lastCollectTime > 5)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,1,this.onClickHarvest.bind(this));
        }
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
    },
    harvest: function (lastCollectTime,gold,elixir) {
        this._lastCollectTime = lastCollectTime;
        PlayerInfoManager.Instance().setResource({elixir:elixir});
        this.loadButton();
    },


});
