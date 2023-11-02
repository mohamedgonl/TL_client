var Wall = Building.extend({
    _type: "WAL_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);
        //schedule load sprite
        // this.schedule(this.loadSpriteByLevel, 5);
        this._bodySprite = res_map.SPRITE.BODY.WALL[level][0];
        this._upperSprite = null;
        this._shadowType = 1;
        this._isUpperAnimate = false;
    },
    loadMainSpriteByLevel: function (level) {
        this.loadMainSprite(res_map.SPRITE.BODY.WALL[level][0],null,1);
    }

});