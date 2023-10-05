var ElixirStorage = Building.extend({
    _upper: null,

    ctor: function (level,id,posX,posY) {
        this._super(level,id,posX,posY);


        this.loadSprite(res_map.SPRITE.BODY.ELIXIR_STORAGE[level],null,1);
        this.loadSubSprite();
    },






});