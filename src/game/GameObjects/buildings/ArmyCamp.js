var ArmyCamp = Building.extend({
    _width: null,
    _height: null,
    ctor: function (type,level,id, posX, posY,status,startTime,endTime) {
        this._super(type,level,id, posX, posY,status,startTime,endTime);
        this.loadSprite(res_map.SPRITE.BODY.ARMY_CAMP[1], null, 0);
        this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },


});