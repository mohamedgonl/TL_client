var GoldMine = BaseMine.extend({
    _type: "RES_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        let capacity = LoadManager.Instance().getConfig(this._type, this._level)
        this._capacityGold = capacity.capacity;
        this._productivityGold = capacity.productivity;

        this._bodySprite = res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level];
        this._upperSprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this._shadowType = 1;
        this._isUpperAnimate = true;
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],
            res_map.SPRITE.BODY.GOLD_MINE.UPPER[level],1,1);
    },

    loadSprite: function (bodySprite, upperSprite, shadow_type, isUpperAnimation) {
        this._super(bodySprite, upperSprite, shadow_type, isUpperAnimation);
        let icon = this._iconHarvest.getChildByName("icon");
        icon.setTexture(res.ICON.GOLD);
    },

    loadButton: function () {

        if(this._super() === -1) return;

        let infoLayer = cc.director.getRunningScene().infoLayer;
        if(this._state ===0) {
            if(this._canHarvest)
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,0,this.onClickHarvest.bind(this));
            else
                infoLayer.addButtonToMenu("Thu hoạch",res.BUTTON.HARVEST_GOLD_BUTTON,3,this.onClickHarvest.bind(this));
        }
    },
    completeProcess: function () {
        this._super();
        let playerInfoManager = PlayerInfoManager.Instance();
        let capacity = LoadManager.Instance().getConfig(this._type, this._level)
        this._capacityGold = capacity.capacity;
        this._productivityGold = capacity.productivity;
    },
    getCurrentAmount: function () {
        //calculate current amount by lastCollectTime
        let timeNow = TimeManager.Instance().getCurrentTimeInSecond();
        let duration = timeNow - this._lastCollectTime;
        let productivity = LoadManager.Instance().getConfig(this._type, this._level, "productivity");
        let harvestAmount = Math.floor(duration * productivity / 3600);

        let capacity = LoadManager.Instance().getConfig(this._type, this._level, "capacity");

        let currentAmount = Math.min(harvestAmount, capacity);
        return {
            gold: currentAmount,
            elixir: 0
        }
    },


});
