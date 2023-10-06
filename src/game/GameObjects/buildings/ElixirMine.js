var ElixirMine = Building.extend({
    _upper: null,

    ctor: function (type,level,id,posX,posY) {
        this._super(type,level,id,posX,posY);



        var upper_sprite = res_map.SPRITE.BODY.ELIXIR_MINE.UPPER[level] + "/image0000.png";
        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_MINE.BOTTOM[level],upper_sprite,1);
        this.loadSubSprite();
    },
});