var Wall = Building.extend({
    _upper: null,
    _type: "WAL_1",

    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);



        this.loadSprite(res_map.SPRITE.BODY.WALL[level],null,0);
        this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.WALL[level][0],null,0);
    },
});