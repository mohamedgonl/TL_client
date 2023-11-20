var Mortar = Building.extend({
    _type: "DEF_3",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(null,res_map.SPRITE.BODY.MORTAR.BOTTOM[level],1);
    },

});