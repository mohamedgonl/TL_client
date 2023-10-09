var GoldMine = Building.extend({
    _upper: null,
    _harvest_icon: null,

    ctor: function (type,level,id,posX,posY,status,startTime,endTime) {
        this._super(type,level,id,posX,posY,status,startTime,endTime);


        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],upper_sprite,1,1);
        this.loadSubSprite();
        this.update();
        this.schedule(this.update, 1, cc.REPEAT_FOREVER, 0);
    },
    onSelected: function () {
        this._super();

        //create button and add to info layer

    }
});