var ElixirMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);



        // var upper_sprite = res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level] + "/image0000.png";
        // this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],upper_sprite,1);
    },
    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },

    loadSpriteByLevel: function (level) {
        var upper_sprite = res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level] + "/image0000.png";
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],upper_sprite,1);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,0,this.onClickUpgrade.bind(this),this);
        if(this._state ===0) {
            let timeNow = TimeManager.Instance().getCurrentTime();
            //delay 5s between 2 harvest
            if(timeNow - this._lastCollectTime > 5)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,0,this.onClickHarvest.bind(this),this);
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,1,this.onClickHarvest.bind(this),this);
        }
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
    },
    harvest: function (lastCollectTime,gold,elixir) {
        this._lastCollectTime = lastCollectTime;
        PlayerInfoManager.Instance().setResource({elixir:elixir});
    }

});
