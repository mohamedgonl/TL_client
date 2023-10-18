var GoldMine = Mine.extend({
    _upper: null,
    _lastCollectTime: null,
    _type: "RES_1",
    _showIconHarvest: false,
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

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


});
