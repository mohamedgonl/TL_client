var GoldStorage = Building.extend({
    _upper: null,

    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);


        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
        this.loadSubSprite();
    },






});