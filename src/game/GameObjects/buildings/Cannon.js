var Cannon = Building.extend({
    _type: "DEF_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        this._bodySprite = res_map.SPRITE.BODY.CANNON[level][0];
        this._upperSprite = null;
        this._shadowType = 2;
        this._isUpperAnimate = false;

    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.CANNON[level][0],null,2);
    },


});