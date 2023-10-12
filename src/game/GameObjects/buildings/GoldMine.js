var GoldMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        this._canHarvest = true;
    },
    onAddIntoMapManager: function () {
        this._super();
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },
    loadSpriteByLevel: function (level) {
        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],
            upper_sprite,1,1);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            if(this._canHarvest)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,1,this.onClickHarvest.bind(this));
        }
    },

    //send to server
    onClickHarvest: function () {
        testnetwork.connector.sendHarvest(this._id);
        //disable button for 5s
        let infoLayer = cc.director.getRunningScene().infoLayer;
    },

    harvest: function (lastCollectTime,gold,elixir) {
        this._lastCollectTime = lastCollectTime;
        PlayerInfoManager.Instance().setResource({gold:gold});

        //sau 5s moi duoc nhan 1 lan
        this._canHarvest = false;
        this.loadButton();
        this.scheduleOnce(function () {
            this._canHarvest = true;
            this.loadButton();
        }.bind(this),5);
    }
});