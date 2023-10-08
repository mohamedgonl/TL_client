var Wall = Building.extend({
    _upper: null,

    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);



        this.loadSprite(res_map.SPRITE.BODY.WALL[level],null,0);
        this.loadSubSprite();
    },






});