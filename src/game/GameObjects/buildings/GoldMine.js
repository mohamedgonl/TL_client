var GoldMine = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);


        var upper_sprite = res_map.SPRITE.BODY.GOLD_MINE.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.GOLD_MINE.BOTTOM[level],upper_sprite,1,1);
        this.loadSubSprite();
    },
});