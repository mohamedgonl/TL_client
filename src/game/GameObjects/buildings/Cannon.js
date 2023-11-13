var Cannon = Building.extend({
    _type: "DEF_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        this._bodySprite = res_map.SPRITE.BODY.CANNON[level][0];
        this._upperSprite = null;
        this._shadowType = 2;
        this._isUpperAnimate = false;

    },
    loadMainSpriteByLevel: function (level) {

        this.loadMainSprite(res_map.SPRITE.BODY.CANNON[level][0],res_map.SPRITE.BODY.CANNON.ATK_0[level],1);

    },
});