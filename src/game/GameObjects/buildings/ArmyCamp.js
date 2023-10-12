var ArmyCamp = Building.extend({
    _width: null,
    _height: null,
    _type: "AMC_1",
    ctor: function (level,id, posX, posY,status,startTime,endTime) {
        this._super(level,id, posX, posY,status,startTime,endTime);
        // this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        // this.loadSubSprite();
    },
    loadSpriteByLevel: function (level) {
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[level], null, 0);
    }


});