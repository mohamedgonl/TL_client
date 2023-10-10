var BuilderHut = Building.extend({
    _type: "BDH_1",
    ctor: function (level,id,posX,posY,status,startTime,endTime) {
        this._super(level,id,posX,posY,status,startTime,endTime);

        // this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1)
        // this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.BUILDER_HUT[level],null,1);
    }
});