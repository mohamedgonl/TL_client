var GoldMine = Building.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    onAddIntoMapManager: function () {
        let mapManager = MapManager.Instance();
        mapManager.addToListMine(this);
    },
    loadSpriteByLevel: function (level) {
        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],upper_sprite,1,1);
    },
    loadButton: function () {
        this._super();
        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) infoLayer.addButtonToMenu("Nâng cấp",res.BUTTON.UPGRADE_BUTTON,0,this.onClickUpgrade.bind(this),this);
        if(this._state ===0) {
            let timeNow = TimeManager.Instance().getCurrentTime();
            //delay 5s between 2 harvest
            if(timeNow - this._lastCollectTime > 5)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,0,this.onClickHarvest.bind(this),this);
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,1,this.onClickHarvest.bind(this),this);
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
    }
});