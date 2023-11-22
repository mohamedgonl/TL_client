var ElixirMine = BaseMine.extend({
    _type: "RES_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        let capacity = LoadManager.getInstance().getConfig(this._type, this._level)
        this._capacityElixir = capacity.capacity;
        this._productivityElixir = capacity.productivity;

        this._bodySprite = res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level];
        this._shadowType = 1;
        this._isUpperAnimate = true;
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level],1);
    },

    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {
        this._super(bodySprite, upperSprite, shadow_type, isUpperAnimation);
    },

    loadButton: function () {

        if(this._super() === -1) return;

        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            if(this._canHarvest)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_ELIXIR_BUTTON,3,this.onClickHarvest.bind(this));
        }
    },
    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.getInstance();
        let capacity = LoadManager.getInstance().getConfig(this._type, this._level)
        this._capacityElixir = capacity.capacity;
        this._productivityElixir = capacity.productivity;
    },
    getCurrentAmount: function () {
        //calculate current amount by lastCollectTime
        let timeNow = TimeManager.getInstance().getCurrentTimeInSecond();
        let duration = timeNow - this._lastCollectTime;
        let productivity = LoadManager.getInstance().getConfig(this._type, this._level, "productivity");
        let harvestAmount = Math.floor(duration * productivity / 3600);

        let capacity = LoadManager.getInstance().getConfig(this._type, this._level, "capacity");

        let currentAmount = Math.min(harvestAmount, capacity);
        return {
            gold: 0,
            elixir: currentAmount
        }
    },
    getCapacityByLevel: function (level) {
        let configCapacity = LoadManager.getInstance().getConfig(this._type, level, "capacity");
        return {gold: 0, elixir: configCapacity};
    }
});
