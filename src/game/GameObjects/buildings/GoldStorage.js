var GoldStorage = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);


        this.loadSprite(res_map.SPRITE.BODY.GOLD_STORAGE[level],null,1);
        this.loadSubSprite();
    },






});