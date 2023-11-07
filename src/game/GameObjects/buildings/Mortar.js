var Mortar = Building.extend({
    _type: "DEF_2",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.MORTAR[level][0]);
    },

});