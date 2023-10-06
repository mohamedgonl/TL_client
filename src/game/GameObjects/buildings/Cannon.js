var Cannon = Building.extend({
    _upper: null,

    ctor: function (type,level,id,posX,posY) {
        this._super(type,level,id,posX,posY);

        var upper_sprite =  res_map.SPRITE.BODY.CANNON.UPPER[level];
        this.loadSprite(res_map.SPRITE.BODY.CANNON.BOTTOM[level],upper_sprite,2);
        this.loadSubSprite();
    },

});